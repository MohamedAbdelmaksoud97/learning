"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, CornerDownLeft, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "اشرح لي الدرس بطريقة أبسط",
  "اختبرني بخمسة أسئلة قصيرة",
  "ساعدني أعمل خطة مذاكرة اليوم",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function readTextStream(response: Response, onChunk: (text: string) => void) {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    text += decoder.decode(value, { stream: true });
    onChunk(text);
  }

  text += decoder.decode();
  onChunk(text);
  return text;
}

export function AIChatClient({ userName }: { userName?: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content: `أهلا ${userName || "بك"}، كيف أساعدك في المذاكرة اليوم؟`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || isSending) return;

    setError("");
    setInput("");
    setIsSending(true);

    const userMessage: ChatMessage = { id: createId(), role: "user", content: cleanText };
    const assistantMessage: ChatMessage = { id: createId(), role: "assistant", content: "" };
    const nextMessages = [...messages, userMessage, assistantMessage];
    setMessages(nextMessages);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.content.trim())
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "تعذر الاتصال بالمساعد الذكي");
      }

      const assistantText = await readTextStream(response, (text) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id ? { ...message, content: text } : message,
          ),
        );
      });

      if (!assistantText.trim()) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: "لم أستطع توليد رد واضح. حاول صياغة السؤال بطريقة مختلفة." }
              : message,
          ),
        );
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "حدث خطأ غير متوقع";
      setError(message);
      setMessages((current) => current.filter((message) => message.id !== assistantMessage.id));
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-blue-950/20">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/40">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-black text-white">المساعد الذكي</h1>
            <p className="text-xs text-slate-400">مدعوم من Gemini للمحادثات التعليمية</p>
          </div>
        </div>
        <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-200">
          مباشر
        </span>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-6 md:px-8">
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", isAssistant ? "justify-start" : "justify-end")}
            >
              {isAssistant ? (
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-sky-400/10 text-sky-200">
                  <Bot className="h-5 w-5" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[min(760px,85%)] rounded-3xl px-5 py-4 text-sm leading-8 shadow-xl",
                  isAssistant
                    ? "rounded-tr-md border border-slate-800 bg-slate-900/90 text-slate-100 shadow-slate-950/20"
                    : "rounded-tl-md bg-blue-600 text-white shadow-blue-950/30",
                )}
              >
                {message.content ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <span className="inline-flex items-center gap-2 text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    يكتب الآن...
                  </span>
                )}
              </div>
              {!isAssistant ? (
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-blue-600/20 text-blue-100">
                  <User className="h-5 w-5" />
                </span>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              disabled={isSending}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-sky-400/60 hover:text-white disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        {error ? <p className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
        <form onSubmit={submit} className="flex items-end gap-3 rounded-3xl border border-slate-700 bg-slate-950/80 p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="اكتب سؤالك هنا..."
            className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-sm leading-7 text-slate-50 outline-none placeholder:text-slate-500"
          />
          <Button type="submit" disabled={!canSend} size="icon" aria-label="إرسال">
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CornerDownLeft className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
