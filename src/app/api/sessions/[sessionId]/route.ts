import { NextResponse } from "next/server";
import {
  buildSessionResponse,
  getSession,
  ParticipantRole,
  setParticipantCompletion,
  updateParticipantAnswer,
} from "@/lib/session-store";
import type { Score } from "@/lib/types";

const REQUIRED_ANSWERS = 54;

export async function GET(_: Request, { params }: { params: { sessionId: string } }) {
  const session = getSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: "セッションが見つかりません。" }, { status: 404 });
  }
  return NextResponse.json(buildSessionResponse(session));
}

export async function PATCH(request: Request, { params }: { params: { sessionId: string } }) {
  const session = getSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: "セッションが見つかりません。" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const participant = body.participant as ParticipantRole | undefined;
  if (participant !== "user" && participant !== "partner") {
    return NextResponse.json({ error: "回答者を指定してください。" }, { status: 400 });
  }

  const questionId = body.questionId as number | undefined;
  const score = body.score as Score | undefined;

  if (typeof questionId === "number" && typeof score === "number") {
    updateParticipantAnswer(session.id, participant, { questionId, score });
  }

  if (typeof body.completed === "boolean") {
    const answers = getSession(session.id)?.participants[participant].answers ?? [];
    if (body.completed && answers.length !== REQUIRED_ANSWERS) {
      return NextResponse.json({ error: "すべての質問に回答してください。" }, { status: 400 });
    }
    setParticipantCompletion(session.id, participant, body.completed);
  }

  const updated = getSession(session.id);
  if (!updated) {
    return NextResponse.json({ error: "セッションの取得に失敗しました。" }, { status: 500 });
  }
  return NextResponse.json(buildSessionResponse(updated));
}
