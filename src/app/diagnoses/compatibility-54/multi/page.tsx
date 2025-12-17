"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copyToClipboard } from "@/lib/clipboard";

interface SessionInfo {
  sessionId: string;
  expiresAt: number;
}

export default function Compatibility54MultiPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const userLink = useMemo(() => {
    if (!session || !origin) return "";
    return `${origin}/diagnoses/compatibility-54/questions?sessionId=${session.sessionId}&role=user`;
  }, [origin, session]);

  const partnerLink = useMemo(() => {
    if (!session || !origin) return "";
    return `${origin}/diagnoses/compatibility-54/questions?sessionId=${session.sessionId}&role=partner`;
  }, [origin, session]);

  const handleCreateSession = useCallback(async () => {
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

  const handleCopy = useCallback(async (text: string) => {
    if (!text) return;
    const copied = await copyToClipboard(text);
    if (!copied) {
      alert("コピーに失敗しました。長押しでコピーしてください。");
    }
  }, []);

  return (
    <div className="pairly-legacy relative min-h-screen overflow-hidden bg-[#fefcf8] px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-4 top-6 h-28 rounded-3xl border border-white/70 bg-white/70 shadow-[0_25px_60px_rgba(40,34,28,0.08)]" />
      <div className="pointer-events-none absolute left-0 top-16 h-48 w-48 rounded-full bg-[#fff2e4]/60 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-[#eff4f1]/60 blur-[140px]" />
      <main className="relative mx-auto w-full max-w-4xl space-y-8">
        <motion.div
          className="rounded-3xl border border-[#ede3d9] bg-white/95 p-8 shadow-[0_20px_55px_rgba(38,32,24,0.06)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8c857a]">sync mode</p>
              <h1 className="text-3xl font-semibold text-[#2f2722] sm:text-4xl">ふたりで同時接続</h1>
              <p className="text-[#5f5b56]">
                それぞれの端末から同じセッションにアクセスして回答を同期。お互いのペースで答えても、結果は自動でまとめられます。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-[#2f2722]">使い方</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[#5f5b56]">
                  <p>1. セッションを作成してURLをコピー</p>
                  <p>2. 片方は「あなた」で回答開始</p>
                  <p>3. 相手は共有リンクから「パートナー」で参加</p>
                  <p>4. 両方の回答がそろうと自動で結果生成</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-[#2f2722]">同時接続の特徴</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-[#5f5b56]">
                  <p>・途中保存OK、別々の場所でも進められる</p>
                  <p>・進捗はリアルタイムで同期</p>
                  <p>・両端末とも同じ結果ページへリダイレクト</p>
                  <p>・最終結果は共有リンクにも連携</p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-3xl border border-dashed border-[#e4e0d8] bg-[#f9f4ef] p-6 text-sm text-[#5f5b56]">
              <p className="font-semibold text-[#2f2722]">セッションを作成</p>
              <p className="mt-2 text-[#5f5b56]">
                セッションIDは12時間保持されます。途中で落ちても同じURLから再開できます。
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="flex-1 rounded-2xl bg-[#d9b49c] text-white"
                  size="lg"
                >
                  {isCreating ? "セッションを準備中..." : "セッションを作成"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl border-[#e4e0d8] text-[#2f2722]"
                  onClick={() => router.push("/diagnoses/compatibility-54")}
                >
                  徹底診断トップへ戻る
                </Button>
              </div>
              {error && <p className="mt-3 text-sm text-[#c25656]">{error}</p>}
            </div>

            {session && (
              <div className="space-y-5 rounded-3xl border border-[#ede3d9] bg-white/95 p-6 shadow-sm">
                <div className="space-y-2 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8c857a]">Session ID</p>
                  <p className="text-2xl font-semibold text-[#2f2722]">{session.sessionId}</p>
                  <p className="text-sm text-[#5f5b56]">
                    有効期限: {new Date(session.expiresAt).toLocaleString()}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8c857a]">あなた用URL</p>
                    <p className="mt-2 break-words text-sm text-[#2f2722]">{userLink}</p>
                    <Button
                      onClick={() => handleCopy(userLink)}
                      className="mt-3 w-full rounded-2xl bg-[#d9b49c] text-white"
                    >
                      コピーする
                    </Button>
                  </div>
                  <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8c857a]">パートナー用URL</p>
                    <p className="mt-2 break-words text-sm text-[#2f2722]">{partnerLink}</p>
                    <Button
                      onClick={() => handleCopy(partnerLink)}
                      className="mt-3 w-full rounded-2xl bg-[#7a9a8d] text-white"
                    >
                      コピーする
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
