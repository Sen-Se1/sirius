import { NextRequest, NextResponse } from "next/server";
import { checkCardDeadlines } from "@/actions/check-card-deadlines";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-vercel-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await checkCardDeadlines({});
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Failed to check card deadlines" }, { status: 500 });
  }
}