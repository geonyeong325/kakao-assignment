import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch todos" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return NextResponse.json({ error: "Failed to create todo" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}
