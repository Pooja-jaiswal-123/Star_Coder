// app/api/auth/callback/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const res = NextResponse.redirect(new URL('/', req.url));

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Exchange Code Error:', error);
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    console.log('Session created:', data.session);
  }

  return res;
}