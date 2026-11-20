import { CalendarEvent } from "@/types/calendar";
import { formatEventTime } from "@/lib/weekUtils";
import { textColor } from "@/lib/calendarColors";

interface Props {
  event: CalendarEvent;
  color: string;
}

export default function EventChip({ event, color }: Props) {
  const fg = textColor(color);
  const time = formatEventTime(event);
  return (
    <div
      className="rounded px-1.5 py-0.5 text-xs mb-0.5 leading-tight break-words print:break-inside-avoid"
      style={{ backgroundColor: color, color: fg }}
    >
      {time && (
        <span className="font-semibold opacity-80 mr-1 whitespace-nowrap">
          {time}
        </span>
      )}
      <span className="font-medium">{event.summary ?? "(no title)"}</span>
    </div>
  );
}
