import { NextResponse } from 'next/server';

// Health check endpoint for uptime monitoring.
// Returns 200 with a JSON payload indicating the site is healthy.
// Used by external monitors (UptimeRobot, BetterStack, etc.) and by Vercel's
// own deployment health checks.
export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'portfolio',
    timestamp: new Date().toISOString(),
  });
}
