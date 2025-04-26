import { NextResponse, NextRequest } from "next/server";
import { checkCardDeadlines } from "@/actions/check-card-deadlines";

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.headers.get("x-vercel-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkCardDeadlines({});
  return NextResponse.json(result, { status: 200 });
}