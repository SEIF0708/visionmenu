import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    uptime: process.uptime(),
  };

  return NextResponse.json(checks, { status: 200 });
}
