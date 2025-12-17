import { calculateScores, getPersonalityType } from "@/lib/calculate";
import type { Answer } from "@/lib/types";

export type ParticipantRole = "user" | "partner";

export interface ParticipantState {
  answers: Answer[];
  completed: boolean;
  updatedAt: number;
}

export interface MultiDeviceSession {
  id: string;
  diagnosisType: "compatibility-54";
  createdAt: number;
  expiresAt: number;
  participants: Record<ParticipantRole, ParticipantState>;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const globalForSession = globalThis as unknown as { __matchSessionStore?: Map<string, MultiDeviceSession> };
const globalStore = globalForSession.__matchSessionStore ?? new Map<string, MultiDeviceSession>();

if (!globalForSession.__matchSessionStore) {
  globalForSession.__matchSessionStore = globalStore;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of globalStore.entries()) {
    if (session.expiresAt <= now) {
      globalStore.delete(sessionId);
    }
  }
}

function generateSessionId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function createSession(diagnosisType: "compatibility-54"): MultiDeviceSession {
  cleanupExpiredSessions();

  let sessionId = generateSessionId();
  while (globalStore.has(sessionId)) {
    sessionId = generateSessionId();
  }

  const now = Date.now();
  const session: MultiDeviceSession = {
    id: sessionId,
    diagnosisType,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    participants: {
      user: { answers: [], completed: false, updatedAt: now },
      partner: { answers: [], completed: false, updatedAt: now },
    },
  };

  globalStore.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): MultiDeviceSession | null {
  cleanupExpiredSessions();
  return globalStore.get(sessionId) ?? null;
}

function cloneAnswers(answers: Answer[]) {
  return answers.map((answer) => ({ ...answer }));
}

export function updateParticipantAnswer(
  sessionId: string,
  participant: ParticipantRole,
  answer: Answer
): MultiDeviceSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const participantState = session.participants[participant];
  const index = participantState.answers.findIndex((a) => a.questionId === answer.questionId);
  if (index >= 0) {
    participantState.answers[index] = answer;
  } else {
    participantState.answers.push(answer);
  }

  participantState.answers.sort((a, b) => a.questionId - b.questionId);
  participantState.updatedAt = Date.now();
  participantState.completed = false;
  return session;
}

export function setParticipantCompletion(
  sessionId: string,
  participant: ParticipantRole,
  completed: boolean
): MultiDeviceSession | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.participants[participant].completed = completed;
  session.participants[participant].updatedAt = Date.now();
  return session;
}

/**
 * セッションに自動的に役割を割り当てる
 * 最初に参加した人が「user」、2人目が「partner」になる
 * @returns 割り当てられた役割、またはnull（セッションが満員または存在しない場合）
 */
export function assignParticipantRole(sessionId: string): ParticipantRole | null {
  const session = getSession(sessionId);
  if (!session) {
    console.log(`[assignParticipantRole] セッションが見つかりません: ${sessionId}`);
    return null;
  }

  const userState = session.participants.user;
  const partnerState = session.participants.partner;
  const now = Date.now();

  // 両方とも初期状態（createdAtと同じupdatedAt）なら、userを割り当て
  if (userState.updatedAt === session.createdAt && partnerState.updatedAt === session.createdAt) {
    userState.updatedAt = now;
    console.log(`[assignParticipantRole] userを割り当て: ${sessionId}`);
    return "user";
  }

  // userが既に参加している場合（updatedAtがcreatedAtより大きい）、partnerを割り当て
  if (userState.updatedAt > session.createdAt && partnerState.updatedAt === session.createdAt) {
    partnerState.updatedAt = now;
    console.log(`[assignParticipantRole] partnerを割り当て: ${sessionId}`);
    return "partner";
  }

  // partnerが既に参加している場合、userを割り当て
  if (partnerState.updatedAt > session.createdAt && userState.updatedAt === session.createdAt) {
    userState.updatedAt = now;
    console.log(`[assignParticipantRole] userを割り当て（partner既参加）: ${sessionId}`);
    return "user";
  }

  // 両方とも既に参加している場合はnullを返す（満員）
  console.log(`[assignParticipantRole] セッションが満員: ${sessionId}`);
  return null;
}

export interface SessionResponsePayload {
  sessionId: string;
  diagnosisType: MultiDeviceSession["diagnosisType"];
  expiresAt: number;
  participants: Record<ParticipantRole, ParticipantState>;
  readyForResult: boolean;
  resultParams?: string;
}

export function buildSessionResponse(session: MultiDeviceSession): SessionResponsePayload {
  const participants: Record<ParticipantRole, ParticipantState> = {
    user: {
      answers: cloneAnswers(session.participants.user.answers),
      completed: session.participants.user.completed,
      updatedAt: session.participants.user.updatedAt,
    },
    partner: {
      answers: cloneAnswers(session.participants.partner.answers),
      completed: session.participants.partner.completed,
      updatedAt: session.participants.partner.updatedAt,
    },
  };

  const ready =
    participants.user.completed &&
    participants.partner.completed &&
    participants.user.answers.length > 0 &&
    participants.partner.answers.length > 0;

  let resultParams: string | undefined;
  if (ready) {
    const userScores = calculateScores(participants.user.answers, 54);
    const partnerScores = calculateScores(participants.partner.answers, 54);

    const userType = getPersonalityType(
      userScores.axis1,
      userScores.axis2,
      userScores.axis3,
      "54"
    );
    const partnerType = getPersonalityType(
      partnerScores.axis1,
      partnerScores.axis2,
      partnerScores.axis3,
      "54"
    );

    const params = new URLSearchParams({
      type: userType.type,
      score1: userScores.axis1.toString(),
      score2: userScores.axis2.toString(),
      score3: userScores.axis3.toString(),
      partnerType: partnerType.type,
      partnerScore1: partnerScores.axis1.toString(),
      partnerScore2: partnerScores.axis2.toString(),
      partnerScore3: partnerScores.axis3.toString(),
      diagnosis: "compatibility-54",
      sessionId: session.id,
    });

    resultParams = params.toString();
  }

  return {
    sessionId: session.id,
    diagnosisType: session.diagnosisType,
    expiresAt: session.expiresAt,
    participants,
    readyForResult: ready,
    resultParams,
  };
}
