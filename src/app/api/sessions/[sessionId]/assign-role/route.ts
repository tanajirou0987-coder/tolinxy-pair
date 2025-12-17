import { NextResponse } from "next/server";
import { assignParticipantRole } from "@/lib/session-store";

export async function POST(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const role = assignParticipantRole(sessionId);

  if (!role) {
    return NextResponse.json(
      { error: "セッションが満員です。またはセッションが見つかりません。" },
      { status: 400 }
    );
  }

  return NextResponse.json({ role });
}

