import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import { CalendarEvent } from "@/types/calendar";

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function weekRange(date: Date): { timeMin: string; timeMax: string } {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
  };
}

export function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((e) => {
    const dateStr = e.start.dateTime ?? e.start.date ?? "";
    if (!dateStr) return false;
    const d = dateStr.includes("T") ? parseISO(dateStr) : parseISO(dateStr + "T00:00:00");
    return isSameDay(d, day);
  });
}

export function formatEventTime(event: CalendarEvent): string {
  if (event.start.date && !event.start.dateTime) return "All day";
  if (!event.start.dateTime) return "";
  return format(parseISO(event.start.dateTime), "h:mm a");
}

export function prevWeek(date: Date): Date {
  return subWeeks(date, 1);
}

export function nextWeek(date: Date): Date {
  return addWeeks(date, 1);
}
