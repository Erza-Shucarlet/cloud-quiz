import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, time: Date.now() });
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const body = await request.json();
    const { table, data } = body;
    if (!table || !data) return NextResponse.json({ error: 'Missing table or data' }, { status: 400 });

    const targetUrl = `${supabaseUrl}/rest/v1/${table}`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        apikey: supabaseKey || '',
        Authorization: `Bearer ${supabaseKey || ''}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText, supabaseStatus: res.status }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
