"use client";
import { useState, useEffect } from "react";
import { CalendarItem, FamilyMember } from "@/types/calendar";
import { colorForCalendar } from "@/lib/calendarColors";

interface Props {
  onSave: (members: FamilyMember[]) => void;
  initial: FamilyMember[];
}

export default function CalendarSetup({ onSave, initial }: Props) {
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendars")
      .then((r) => r.json())
      .then((data: CalendarItem[]) => {
        setCalendars(data);
        if (members.length === 0) {
          setMembers(
            data.map((c, i) => ({
              calendarId: c.id,
              name: c.summary,
              color: colorForCalendar(i, c.backgroundColor),
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(calId: string) {
    setMembers((prev) =>
      prev.some((m) => m.calendarId === calId)
        ? prev.filter((m) => m.calendarId !== calId)
        : [
            ...prev,
            {
              calendarId: calId,
              name:
                calendars.find((c) => c.id === calId)?.summary ?? calId,
              color: colorForCalendar(
                calendars.findIndex((c) => c.id === calId),
                calendars.find((c) => c.id === calId)?.backgroundColor
              ),
            },
          ]
    );
  }

  function updateName(calId: string, name: string) {
    setMembers((prev) =>
      prev.map((m) => (m.calendarId === calId ? { ...m, name } : m))
    );
  }

  function updateColor(calId: string, color: string) {
    setMembers((prev) =>
      prev.map((m) => (m.calendarId === calId ? { ...m, color } : m))
    );
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading calendars…</div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Configure Family Calendars
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose which calendars to show, set a name and color for each person.
      </p>
      <div className="space-y-3">
        {calendars.map((cal, i) => {
          const member = members.find((m) => m.calendarId === cal.id);
          const active = !!member;
          return (
            <div
              key={cal.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                active
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle(cal.id)}
                className="w-4 h-4 accent-blue-600"
              />
              {active ? (
                <>
                  <input
                    type="color"
                    value={member!.color}
                    onChange={(e) => updateColor(cal.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={member!.name}
                    onChange={(e) => updateName(cal.id, e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  />
                </>
              ) : (
                <>
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      background:
                        cal.backgroundColor ??
                        colorForCalendar(i),
                    }}
                  />
                  <span className="text-sm text-gray-500">{cal.summary}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => onSave(members)}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
      >
        Save & View Calendar
      </button>
    </div>
  );
}
