import { NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export async function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 5; // Max requests per windowMs

  if (!store[ip]) {
    store[ip] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  if (now > store[ip].resetTime) {
    store[ip] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  store[ip].count++;

  if (store[ip].count > max) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  return null;
}
