export interface CalendarItem {
  id: string;
  summary: string;
  backgroundColor?: string;
  foregroundColor?: string;
  selected?: boolean;
  primary?: boolean;
}

export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  colorId?: string;
  calendarId: string;
  calendarColor?: string;
  calendarName?: string;
  allDay?: boolean;
}

export interface FamilyMember {
  calendarId: string;
  name: string;
  color: string;
}

export interface WeekConfig {
  weekStart: Date;
  selectedCalendars: string[];
  familyMembers: FamilyMember[];
}
