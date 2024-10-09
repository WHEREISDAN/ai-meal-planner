import { NextResponse } from "next/server";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

let lastResetTime = Date.now();
let requestCount = 0;

export async function rateLimit(ip: string) {
  const now = Date.now();

  if (now - lastResetTime > WINDOW_SIZE) {
    lastResetTime = now;
    requestCount = 0;
  }

  requestCount++;

  console.log(
    `Rate limit: ${requestCount}/${MAX_REQUESTS} requests in the last minute`
  );

  if (requestCount > MAX_REQUESTS) {
    console.log(`Rate limit exceeded`);
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  return null;
}
