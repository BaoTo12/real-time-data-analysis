import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8183';
const BASE = `${BACKEND}/elastic-query-service`;

export async function GET() {
  try {
    const res = await fetch(`${BASE}/documents/`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Backend is unreachable. Showing mock data.' },
      { status: 503 }
    );
  }
}
