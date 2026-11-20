"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CalendarEvent, FamilyMember } from "@/types/calendar";
import {
  getWeekDays,
  weekRange,
  eventsForDay,
  prevWeek,
  nextWeek,
} from "@/lib/weekUtils";
import EventChip from "./EventChip";

interface Props {
  familyMembers: FamilyMember[];
  onConfigure: () => void;
}

export default function WeeklyCalendar({ familyMembers, onConfigure }: Props) {
  const [weekStart, setWeekStart] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const days = getWeekDays(weekStart);

  const loadEvents = useCallback(async () => {
    if (!familyMembers.length) return;
    setLoading(true);
    const { timeMin, timeMax } = weekRange(weekStart);
    const params = new URLSearchParams({ timeMin, timeMax });
    familyMembers.forEach((m) => params.append("calendarId", m.calendarId));
    const res = await fetch(`/api/events?${params}`);
    const data: CalendarEvent[] = await res.json();

    // Attach color and name from family config
    const enriched = data.map((e) => {
      const member = familyMembers.find((m) => m.calendarId === e.calendarId);
      return {
        ...e,
        calendarColor: member?.color ?? "#4285f4",
        calendarName: member?.name ?? e.calendarId,
      };
    });
    setEvents(enriched);
    setLoading(false);
  }, [familyMembers, weekStart]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden flex items-center justify-between px-4 py-3 border-b bg-gray-50 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(prevWeek)}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            aria-label="Previous week"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-700 w-44 text-center">
            {format(days[0], "MMM d")} – {format(days[6], "MMM d, yyyy")}
          </span>
          <button
            onClick={() => setWeekStart(nextWeek)}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            aria-label="Next week"
          >
            →
          </button>
          <button
            onClick={() => setWeekStart(new Date())}
            className="ml-2 text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {familyMembers.map((m) => (
            <span key={m.calendarId} className="flex items-center gap-1 text-xs text-gray-700">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: m.color }}
              />
              {m.name}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onConfigure}
            className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600"
          >
            Configure
          </button>
          <button
            onClick={() => window.print()}
            className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="print:hidden text-center py-2 text-sm text-gray-400 bg-blue-50">
          Loading events…
        </div>
      )}

      {/* Calendar grid */}
      <div className="p-4 print:p-2">
        {/* Print header */}
        <div className="hidden print:flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">
            Family Calendar — {format(days[0], "MMM d")} –{" "}
            {format(days[6], "MMM d, yyyy")}
          </h1>
          <div className="flex gap-3">
            {familyMembers.map((m) => (
              <span key={m.calendarId} className="flex items-center gap-1 text-xs">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: m.color }}
                />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 print:gap-0.5">
          {/* Day headers */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="text-center pb-1 border-b border-gray-200"
            >
              <div className="text-xs font-medium text-gray-400 uppercase">
                {format(day, "EEE")}
              </div>
              <div
                className={`text-sm font-bold mt-0.5 ${
                  format(day, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd")
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}

          {/* Event columns */}
          {days.map((day) => {
            const dayEvents = eventsForDay(events, day);
            return (
              <div
                key={day.toISOString()}
                className="min-h-32 pt-1 print:min-h-24"
              >
                {dayEvents.length === 0 ? (
                  <div className="text-xs text-gray-300 text-center mt-4">
                    —
                  </div>
                ) : (
                  dayEvents.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      color={event.calendarColor ?? "#4285f4"}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
