import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 相性計算API
  return NextResponse.json({ message: "相性計算API" });
}




