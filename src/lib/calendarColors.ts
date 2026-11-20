// Google Calendar color IDs → hex
export const GOOGLE_COLORS: Record<string, string> = {
  "1": "#a4bdfc",
  "2": "#7ae7bf",
  "3": "#dbadff",
  "4": "#ff887c",
  "5": "#fbd75b",
  "6": "#ffb878",
  "7": "#46d6db",
  "8": "#e1e1e1",
  "9": "#5484ed",
  "10": "#51b749",
  "11": "#dc2127",
};

export const PALETTE = [
  "#4285f4",
  "#ea4335",
  "#34a853",
  "#fbbc05",
  "#9c27b0",
  "#00bcd4",
  "#ff5722",
  "#607d8b",
  "#e91e63",
  "#3f51b5",
];

export function colorForCalendar(index: number, calBg?: string): string {
  return calBg ?? PALETTE[index % PALETTE.length];
}

export function textColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1f2937" : "#ffffff";
}
