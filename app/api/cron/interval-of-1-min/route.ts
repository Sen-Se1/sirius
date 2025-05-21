import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/check-deadlines`)
          .then((res) => res.text())
          .catch((err) => console.error("Error calling check-deadlines:", err));
      }, i * 5000);
    }
    return NextResponse.json(
      { message: "Scheduled 12 calls to check-deadlines" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to check card deadlines" },
      { status: 500 }
    );
  }
}
