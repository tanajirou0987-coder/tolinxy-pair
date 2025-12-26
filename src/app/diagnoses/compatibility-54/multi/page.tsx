"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/lib/clipboard";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "@/hooks/useSession";

export default function Compatibility54MultiPage() {
  const router = useRouter();
  const { session, isCreating, error, createSession } = useSession();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const joinLink = useMemo(() => {
    if (!session || !origin) return "";
    return `${origin}/diagnoses/compatibility-54/questions?sessionId=${session.sessionId}`;
  }, [origin, session]);

  const handleCopy = useCallback(async (text: string) => {
    if (!text) return;
    const copied = await copyToClipboard(text);
    if (copied) {
      setCopiedLink("join");
      setTimeout(() => setCopiedLink(null), 2000);
    } else {
      alert("コピーに失敗しました。長押しでコピーしてください。");
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 装飾的な背景要素 - Soft UIスタイル */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <motion.main
          className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 sm:p-12 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.5em] text-gray-500 mb-4">同時接続モード</p>
              <h1 className="text-5xl sm:text-6xl font-['Coming_Soon:Regular',sans-serif] font-bold mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-[0px_2px_8px_rgba(0,0,0,0.1)]">
                同時接続モード
              </h1>
              <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">ふたりで同時に診断</p>
              <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 max-w-2xl mx-auto leading-relaxed drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                それぞれの端末から同じセッションにアクセスして回答を同期。<br />
                お互いのペースで答えても、結果は自動でまとめられます。
              </p>
            </motion.div>
          </div>

          {!session ? (
            <div className="space-y-8">
              {/* 使い方 */}
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  className="rounded-[36px] border border-white/70 bg-white/90 backdrop-blur-lg p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-4 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">使い方</h2>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 text-white font-['Coming_Soon:Regular',sans-serif] font-bold text-xs flex items-center justify-center shadow-[0px_4px_12px_rgba(255,182,193,0.3)]">1</span>
                      <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">セッションを作成してQRコードを表示</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 text-white font-['Coming_Soon:Regular',sans-serif] font-bold text-xs flex items-center justify-center shadow-[0px_4px_12px_rgba(255,182,193,0.3)]">2</span>
                      <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">2人とも同じQRコードをスキャン</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 text-white font-['Coming_Soon:Regular',sans-serif] font-bold text-xs flex items-center justify-center shadow-[0px_4px_12px_rgba(255,182,193,0.3)]">3</span>
                      <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">自動で「あなた」「パートナー」に振り分けられる</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 text-white font-['Coming_Soon:Regular',sans-serif] font-bold text-xs flex items-center justify-center shadow-[0px_4px_12px_rgba(255,182,193,0.3)]">4</span>
                      <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">両方の回答がそろうと自動で結果生成</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-[36px] border border-white/70 bg-white/90 backdrop-blur-lg p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-4 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">特徴</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">・途中保存OK、別々の場所でも進められる</p>
                    <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">・進捗はリアルタイムで同期</p>
                    <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">・両端末とも同じ結果ページへリダイレクト</p>
                    <p className="font-['Coming_Soon:Regular',sans-serif] font-medium">・最終結果は共有リンクにも連携</p>
                  </div>
                </motion.div>
              </div>

              {/* セッション作成 */}
              <motion.div
                className="rounded-[40px] border border-white/70 bg-gradient-to-br from-pink-200/90 via-pink-100/90 to-pink-200/90 backdrop-blur-2xl p-8 shadow-[0px_24px_64px_rgba(255,182,193,0.25),0px_12px_32px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-4 text-center drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">セッションを作成</h2>
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 text-center mb-6 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">
                  セッションIDは12時間保持されます。途中で落ちても同じURLから再開できます。
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={createSession}
                    disabled={isCreating}
                    className="flex-1 rounded-[32px] border border-white/60 bg-white/95 backdrop-blur-md px-8 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0px_12px_40px_rgba(0,0,0,0.12),0px_6px_20px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_16px_50px_rgba(0,0,0,0.16),0px_8px_25px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
                  >
                    {isCreating ? "セッションを準備中..." : "セッションを作成"}
                  </button>
                  <button
                    onClick={() => router.push("/diagnoses/compatibility-54")}
                    className="flex-1 rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-md px-8 py-6 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_12px_40px_rgba(0,0,0,0.08),0px_6px_20px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_16px_50px_rgba(0,0,0,0.12),0px_8px_25px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,1)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
                  >
                    徹底診断トップへ戻る
                  </button>
                </div>
                {error && (
                  <p className="mt-4 text-center text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 bg-red-100/90 backdrop-blur-sm border border-red-300/70 rounded-[24px] px-4 py-3 shadow-[0px_8px_24px_rgba(239,68,68,0.15),0px_4px_12px_rgba(239,68,68,0.1),inset_0px_1px_0px_rgba(255,255,255,0.6)] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
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
              <div className="rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_24px_64px_rgba(0,0,0,0.12),0px_12px_32px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]">
                <div className="text-center mb-6">
                  <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.4em] text-gray-500 mb-2">Session ID</p>
                  <p className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">{session.sessionId}</p>
                  <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                    有効期限: {new Date(session.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* QRコード共有 */}
              {joinLink && (
                <motion.div
                  className="rounded-[40px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_24px_64px_rgba(0,0,0,0.12),0px_12px_32px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-6 text-center drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">参加用QRコード</h3>
                  <div className="flex flex-col items-center mb-6">
                    <div className="rounded-[32px] border border-white/70 bg-white p-6 mb-4 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
                      <QRCodeCanvas
                        value={joinLink}
                        size={280}
                        bgColor="#ffffff"
                        fgColor="#18181b"
                        level="M"
                      />
                    </div>
                    <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-3 text-center drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                      2人とも同じQRコードをスキャン<br />
                      セッション作成者が「あなた」、読み込んだ人が「パートナー」に自動で振り分けられます
                    </p>
                    <div className="rounded-[24px] border border-white/70 bg-white/90 backdrop-blur-sm p-4 w-full shadow-[0px_8px_24px_rgba(0,0,0,0.08),0px_4px_12px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]">
                      <p className="break-words text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 text-center drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{joinLink}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(joinLink)}
                    className="w-full rounded-[32px] border border-white/60 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_12px_40px_rgba(255,182,193,0.4),0px_6px_20px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(255,182,193,0.5),0px_8px_25px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
                  >
                    {copiedLink === "join" ? "コピーしました！" : "URLをコピー"}
                  </button>
                </motion.div>
              )}

              {/* 注意事項 */}
              <div className="rounded-[36px] border border-white/70 bg-gradient-to-br from-yellow-50/90 via-amber-50/90 to-yellow-50/90 backdrop-blur-2xl p-6 shadow-[0px_12px_32px_rgba(255,248,220,0.25),0px_6px_16px_rgba(255,248,220,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)]">
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">重要</p>
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 leading-relaxed mb-3 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                  2人とも同じQRコードをスキャンしてください。最初にスキャンした人が「あなた」、2人目が「パートナー」として自動的に振り分けられます。
                  両方の回答が完了すると、自動的に結果ページへリダイレクトされます。
                </p>
                <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
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
