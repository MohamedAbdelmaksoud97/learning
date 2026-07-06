"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getSaudiDateParts, SAUDI_TIME_ZONE } from "@/lib/utils";

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toInputValue(year: number, month: number, day: number, hour: number, minute: number) {
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

function getSaudiMonthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: SAUDI_TIME_ZONE,
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 15, 12)));
}

function toArabicDisplay(value: string) {
  if (!value) return "اختر التاريخ والوقت";
  const date = new Date(`${value}:00+03:00`);
  return `${new Intl.DateTimeFormat("ar-EG", {
    timeZone: SAUDI_TIME_ZONE,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date)} بتوقيت السعودية`;
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
  const nowSaudi = useMemo(() => getSaudiDateParts(new Date()), []);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [viewYear, setViewYear] = useState(nowSaudi.year);
  const [viewMonth, setViewMonth] = useState(nowSaudi.month);
  const [hour, setHour] = useState(nowSaudi.hour);
  const [minute, setMinute] = useState(0);

  const days = useMemo(() => {
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0, 12)).getUTCDate();
    const offset = new Date(Date.UTC(viewYear, viewMonth - 1, 1, 12)).getUTCDay();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [viewMonth, viewYear]);

  const monthLabel = getSaudiMonthLabel(viewYear, viewMonth);

  function moveMonth(direction: 1 | -1) {
    const next = new Date(Date.UTC(viewYear, viewMonth - 1 + direction, 1, 12));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth() + 1);
  }

  function selectDay(day: number) {
    setSelected(toInputValue(viewYear, viewMonth, day, hour, minute));
  }

  function updateTime(nextHour: number, nextMinute: number) {
    setHour(nextHour);
    setMinute(nextMinute);
    if (!selected) return;
    const base = {
      year: Number(selected.slice(0, 4)),
      month: Number(selected.slice(5, 7)),
      day: Number(selected.slice(8, 10)),
    };
    setSelected(toInputValue(base.year, base.month, base.day, nextHour, nextMinute));
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
          <div className="mb-3 rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-100">
            جميع الأوقات هنا بتوقيت السعودية
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveMonth(1)}
              aria-label="الشهر التالي"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <p className="font-black text-white">{monthLabel}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveMonth(-1)}
              aria-label="الشهر السابق"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500">
            {weekdays.map((day) => (
              <span key={day}>{day.slice(0, 3)}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const value = day ? toInputValue(viewYear, viewMonth, day, hour, minute) : "";
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
                  {day}
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
            تأكيد الموعد بتوقيت السعودية
          </Button>
        </div>
      ) : null}
    </div>
  );
}
