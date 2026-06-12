import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') || 'leaderboard';
  const date = searchParams.get('date');
  const select = searchParams.get('select') || '*';
  const order = searchParams.get('order');
  const limit = searchParams.get('limit');

  try {
    let url = `${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
    if (date) url += `&date=eq.${date}`;
    if (order) url += `&order=${order}`;
    if (limit) url += `&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        apikey: supabaseKey || '',
        Authorization: `Bearer ${supabaseKey || ''}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const body = await request.json();
    const table = body.table || 'leaderboard';

    const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey || '',
        Authorization: `Bearer ${supabaseKey || ''}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body.data),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
