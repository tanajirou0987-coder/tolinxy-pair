"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/lib/clipboard";
import { QRCodeCanvas } from "qrcode.react";

interface SessionInfo {
  sessionId: string;
  expiresAt: number;
}

export default function Compatibility54MultiPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

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

  const handleCopy = useCallback(async (text: string, linkType: "user" | "partner") => {
    if (!text) return;
    const copied = await copyToClipboard(text);
    if (copied) {
      setCopiedLink(linkType);
      setTimeout(() => setCopiedLink(null), 2000);
    } else {
      alert("コピーに失敗しました。長押しでコピーしてください。");
    }
  }, []);

  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* 背景エフェクト */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1a0033] to-[#000033]" />
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[#00f5ff] opacity-20 blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#8338ec] opacity-20 blur-[200px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative mx-auto w-full max-w-4xl">
        <motion.main
          className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#00f5ff]/20 via-[#8338ec]/20 to-[#ff006e]/20 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,245,255,0.4)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#00f5ff] to-[#8338ec] bg-clip-text text-transparent">
                同時接続モード
              </span>
            </h1>
            <p className="text-xl font-black text-white mb-2">ふたりで同時に診断</p>
            <p className="text-white/80 max-w-2xl mx-auto">
              それぞれの端末から同じセッションにアクセスして回答を同期。<br />
              お互いのペースで答えても、結果は自動でまとめられます。
            </p>
          </div>

          {!session ? (
            <div className="space-y-8">
              {/* 使い方 */}
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  className="rounded-[30px] border-4 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-black text-white mb-4">使い方</h2>
                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#8338ec] text-white font-black text-xs flex items-center justify-center">1</span>
                      <p>セッションを作成してQRコードを表示</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#8338ec] text-white font-black text-xs flex items-center justify-center">2</span>
                      <p>片方は「あなた用QRコード」をスキャンして開始</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#8338ec] text-white font-black text-xs flex items-center justify-center">3</span>
                      <p>相手は「パートナー用QRコード」をスキャンして参加</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#8338ec] text-white font-black text-xs flex items-center justify-center">4</span>
                      <p>両方の回答がそろうと自動で結果生成</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-[30px] border-4 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-black text-white mb-4">特徴</h2>
                  <div className="space-y-2 text-sm text-white/80">
                    <p>・途中保存OK、別々の場所でも進められる</p>
                    <p>・進捗はリアルタイムで同期</p>
                    <p>・両端末とも同じ結果ページへリダイレクト</p>
                    <p>・最終結果は共有リンクにも連携</p>
                  </div>
                </motion.div>
              </div>

              {/* セッション作成 */}
              <motion.div
                className="rounded-[40px] border-4 border-white/30 bg-gradient-to-r from-[#00f5ff]/30 to-[#8338ec]/30 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,245,255,0.4)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-black text-white mb-4 text-center">セッションを作成</h2>
                <p className="text-sm text-white/80 text-center mb-6">
                  セッションIDは12時間保持されます。途中で落ちても同じURLから再開できます。
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <motion.button
                    onClick={handleCreateSession}
                    disabled={isCreating}
                    className="flex-1 rounded-[40px] border-4 border-white bg-gradient-to-r from-[#00f5ff] to-[#8338ec] px-8 py-6 text-xl font-black text-white shadow-[0_0_60px_rgba(0,245,255,0.6)] transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    whileHover={{ scale: isCreating ? 1 : 1.05 }}
                    whileTap={{ scale: isCreating ? 1 : 0.95 }}
                  >
                    {isCreating ? "セッションを準備中..." : "セッションを作成"}
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/diagnoses/compatibility-54")}
                    className="flex-1 rounded-[40px] border-4 border-white/20 bg-white/5 px-8 py-6 text-lg font-black text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    徹底診断トップへ戻る
                  </motion.button>
                </div>
                {error && (
                  <p className="mt-4 text-center text-sm font-black text-white bg-red-500/20 border-2 border-red-500/50 rounded-[30px] px-4 py-3">
                    {error}
                  </p>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* セッション情報 */}
              <div className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#8338ec]/30 to-[#ff006e]/30 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(131,56,236,0.4)]">
                <div className="text-center mb-6">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-2">Session ID</p>
                  <p className="text-4xl font-black text-white mb-2">{session.sessionId}</p>
                  <p className="text-sm text-white/70">
                    有効期限: {new Date(session.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* QRコード共有 */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* あなた用QRコード */}
                <motion.div
                  className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#00f5ff]/20 to-[#8338ec]/20 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(0,245,255,0.3)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-black text-white mb-4 text-center">あなた用QRコード</h3>
                  <div className="flex flex-col items-center mb-4">
                    <div className="rounded-[30px] border-4 border-white/30 bg-white p-4 mb-4">
                      <QRCodeCanvas
                        value={userLink}
                        size={240}
                        bgColor="#ffffff"
                        fgColor="#18181b"
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-white/70 mb-2">スマホでスキャンして開始</p>
                    <div className="rounded-[20px] border-2 border-white/20 bg-black/20 p-3 w-full">
                      <p className="break-words text-xs text-white/90 font-medium text-center">{userLink}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleCopy(userLink, "user")}
                    className="w-full rounded-[30px] border-4 border-white bg-gradient-to-r from-[#00f5ff] to-[#8338ec] px-6 py-4 text-lg font-black text-white shadow-[0_0_40px_rgba(0,245,255,0.5)] transition-all transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedLink === "user" ? "コピーしました！" : "URLをコピー"}
                  </motion.button>
                </motion.div>

                {/* パートナー用QRコード */}
                <motion.div
                  className="rounded-[40px] border-4 border-white/30 bg-gradient-to-br from-[#ff006e]/20 to-[#8338ec]/20 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(255,0,110,0.3)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-black text-white mb-4 text-center">パートナー用QRコード</h3>
                  <div className="flex flex-col items-center mb-4">
                    <div className="rounded-[30px] border-4 border-white/30 bg-white p-4 mb-4">
                      <QRCodeCanvas
                        value={partnerLink}
                        size={240}
                        bgColor="#ffffff"
                        fgColor="#18181b"
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-white/70 mb-2">スマホでスキャンして参加</p>
                    <div className="rounded-[20px] border-2 border-white/20 bg-black/20 p-3 w-full">
                      <p className="break-words text-xs text-white/90 font-medium text-center">{partnerLink}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleCopy(partnerLink, "partner")}
                    className="w-full rounded-[30px] border-4 border-white bg-gradient-to-r from-[#ff006e] to-[#8338ec] px-6 py-4 text-lg font-black text-white shadow-[0_0_40px_rgba(255,0,110,0.5)] transition-all transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedLink === "partner" ? "コピーしました！" : "URLをコピー"}
                  </motion.button>
                </motion.div>
              </div>

              {/* 注意事項 */}
              <div className="rounded-[30px] border-4 border-dashed border-white/30 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-sm font-black text-white mb-2">重要</p>
                <p className="text-sm text-white/80 leading-relaxed mb-3">
                  それぞれのQRコードを正しく使い分けてください。「あなた」と「パートナー」で異なるQRコードを使用します。
                  両方の回答が完了すると、自動的に結果ページへリダイレクトされます。
                </p>
                <p className="text-xs text-white/60">
                  💡 QRコードが読み取れない場合は、URLをコピーして共有することもできます。
                </p>
              </div>
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
