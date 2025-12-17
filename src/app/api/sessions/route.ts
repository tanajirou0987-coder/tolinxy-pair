import { NextResponse } from "next/server";
import { createSession, buildSessionResponse } from "@/lib/session-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const diagnosisType = body?.diagnosisType;

    if (diagnosisType !== "compatibility-54") {
      return NextResponse.json({ error: "診断タイプが不明です。" }, { status: 400 });
    }

    const session = createSession("compatibility-54");
    return NextResponse.json(buildSessionResponse(session));
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json({ error: "セッションの作成に失敗しました。" }, { status: 500 });
  }
}
