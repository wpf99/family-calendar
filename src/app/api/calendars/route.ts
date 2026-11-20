import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });
  const calendar = google.calendar({ version: "v3", auth });

  const { data } = await calendar.calendarList.list();
  return NextResponse.json(data.items ?? []);
}
