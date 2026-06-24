"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const weekdays = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toArabicDisplay(value: string) {
  if (!value) return "اختر التاريخ والوقت";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DateTimePicker({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [viewDate, setViewDate] = useState(() => new Date());
  const [hour, setHour] = useState(() => new Date().getHours());
  const [minute, setMinute] = useState(0);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const offset = first.getDay();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: last.getDate() }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [viewDate]);

  const monthLabel = new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  function selectDay(day: Date) {
    const next = new Date(day);
    next.setHours(hour, minute, 0, 0);
    setSelected(toInputValue(next));
  }

  function updateTime(nextHour: number, nextMinute: number) {
    setHour(nextHour);
    setMinute(nextMinute);
    const base = selected ? new Date(selected) : new Date(viewDate);
    base.setHours(nextHour, nextMinute, 0, 0);
    setSelected(toInputValue(base));
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-slate-300">{label}</label>
      <input name={name} value={selected} required={required} readOnly className="sr-only" />
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-right text-sm text-slate-50 outline-none transition hover:border-sky-400/60 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
      >
        <span className={cn(selected ? "text-slate-50" : "text-slate-500")}>
          {toArabicDisplay(selected)}
        </span>
        <CalendarDays className="h-5 w-5 shrink-0 text-sky-300" />
      </button>

      {open ? (
        <div className="absolute z-40 mt-3 w-full min-w-[320px] rounded-2xl border border-slate-700 bg-[#0F172A] p-4 shadow-2xl shadow-slate-950/60">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              aria-label="الشهر التالي"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <p className="font-black text-white">{monthLabel}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              aria-label="الشهر السابق"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const value = day ? toInputValue(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute)) : "";
              const isSelected = selected.slice(0, 10) === value.slice(0, 10);
              return day ? (
                <button
                  type="button"
                  key={value}
                  onClick={() => selectDay(day)}
                  className={cn(
                    "grid h-9 place-items-center rounded-lg text-sm font-bold transition hover:bg-sky-400/10 hover:text-sky-200",
                    isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-300",
                  )}
                >
                  {day.getDate()}
                </button>
              ) : (
                <span key={`empty-${index}`} />
              );
            })}
          </div>

          <div className="mt-4 flex items-end gap-3 border-t border-slate-800 pt-4">
            <Clock className="mb-3 h-5 w-5 text-sky-300" />
            <label className="flex-1 text-xs font-bold text-slate-400">
              الساعة
              <select
                value={hour}
                onChange={(event) => updateTime(Number(event.target.value), minute)}
                className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-slate-50 outline-none"
              >
                {Array.from({ length: 24 }, (_, value) => (
                  <option key={value} value={value}>
                    {pad(value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 text-xs font-bold text-slate-400">
              الدقيقة
              <select
                value={minute}
                onChange={(event) => updateTime(hour, Number(event.target.value))}
                className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-slate-50 outline-none"
              >
                {[0, 15, 30, 45].map((value) => (
                  <option key={value} value={value}>
                    {pad(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Button type="button" className="mt-4 w-full" onClick={() => setOpen(false)}>
            تأكيد الموعد
          </Button>
        </div>
      ) : null}
    </div>
  );
}
