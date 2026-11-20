import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const calendarIds = searchParams.getAll("calendarId");
  const timeMin = searchParams.get("timeMin") ?? new Date().toISOString();
  const timeMax =
    searchParams.get("timeMax") ??
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });
  const calendar = google.calendar({ version: "v3", auth });

  const ids = calendarIds.length ? calendarIds : ["primary"];

  const allEvents = await Promise.all(
    ids.map(async (calId) => {
      const { data } = await calendar.events.list({
        calendarId: calId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      });
      return (data.items ?? []).map((e) => ({ ...e, calendarId: calId }));
    })
  );

  return NextResponse.json(allEvents.flat());
}
