import { createClient } from "@/lib/supabase/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_MESSAGES = 12;
const SYSTEM_INSTRUCTION = [
  "أنت مساعد تعليمي عربي داخل منصة تعليمية.",
  "أجب بالعربية الفصحى المبسطة، وكن واضحا ومباشرا ومشجعا بدون مبالغة.",
  "إذا طلب الطالب حل واجب أو اختبار، ساعده على الفهم خطوة بخطوة بدلا من إعطاء الإجابة فقط.",
  "لا تخترع معلومات عن محتوى المنصة أو الدروس إذا لم يتم تزويدك بها.",
].join("\n");

function buildInput(messages: ChatMessage[]) {
  const recentMessages = messages.slice(-MAX_MESSAGES);
  return recentMessages
    .map((message) => `${message.role === "user" ? "الطالب" : "المساعد"}: ${message.content}`)
    .join("\n\n");
}

function extractTextFromEvent(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const event = payload as {
    event_type?: string;
    delta?: { type?: string; text?: string };
    error?: { message?: string };
    output_text?: string;
  };

  if (event.event_type === "error" && event.error?.message) {
    return `تعذر توليد الرد من Gemini: ${event.error.message}`;
  }

  if (event.event_type === "step.delta" && event.delta?.type === "text") {
    return event.delta.text ?? "";
  }

  return event.output_text ?? "";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is missing" }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { messages?: ChatMessage[] } | null;
  const messages = body?.messages?.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim(),
  );

  if (!messages?.length) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      system_instruction: SYSTEM_INSTRUCTION,
      input: buildInput(messages),
      stream: true,
      generation_config: {
        temperature: 0.7,
        thinking_level: "low",
      },
    }),
  });

  if (!geminiResponse.ok || !geminiResponse.body) {
    const errorText = await geminiResponse.text().catch(() => "");
    return Response.json(
      { error: errorText || "Gemini request failed" },
      { status: geminiResponse.status || 502 },
    );
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = geminiResponse.body!.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const dataLine = event
              .split("\n")
              .find((line) => line.startsWith("data:"));

            if (!dataLine) continue;

            const json = dataLine.slice(5).trim();
            if (!json || json === "[DONE]") continue;

            try {
              const text = extractTextFromEvent(JSON.parse(json));
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Ignore malformed stream fragments; the next chunk may still be valid.
            }
          }
        }
      } catch (error) {
        controller.error(error);
        return;
      } finally {
        reader.releaseLock();
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
