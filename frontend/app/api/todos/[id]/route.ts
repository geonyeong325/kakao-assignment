import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Todo not found" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return NextResponse.json({ error: "Failed to update todo" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) return NextResponse.json({ error: "Failed to delete todo" }, { status: res.status });
  return NextResponse.json({ message: "삭제되었습니다." });
}
