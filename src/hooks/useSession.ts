import { useCallback, useState } from "react";

interface SessionInfo {
  sessionId: string;
  expiresAt: number;
}

export function useSession() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    try {
      setIsCreating(true);
      setError(null);
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosisType: "compatibility-54" }),
      });

      if (!response.ok) {
        throw new Error("セッションの作成に失敗しました");
      }

      const data = await response.json();
      setSession({ sessionId: data.sessionId, expiresAt: data.expiresAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "セッションの作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { session, isCreating, error, createSession };
}

