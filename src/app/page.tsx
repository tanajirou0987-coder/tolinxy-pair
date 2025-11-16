import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <main className="flex w-full max-w-md flex-col items-center justify-center space-y-8 text-center">
        {/* ロゴ */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#2C3E50] sm:text-6xl">
            🎵 MatchTune
          </h1>
          <p className="text-lg text-[#2C3E50]/80 sm:text-xl">
            2人の音色、調べてみる？
          </p>
        </div>

        {/* ボタンエリア */}
        <div className="flex w-full flex-col gap-4 sm:gap-6">
          <Link
            href="/diagnoses"
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#F39C12] to-[#E67E22] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <span className="relative z-10">診断を始める</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E67E22] to-[#F39C12] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* フッター説明 */}
        <p className="mt-8 text-sm text-[#2C3E50]/60">
          科学的に性格を測定して、精度の高い相性を診断
        </p>

        {/* 開発者用ショートカット（一時的） */}
        <Link
          href="/dev"
          className="mt-4 text-xs text-[#2C3E50]/40 hover:text-[#F39C12] underline"
        >
          🛠️ 開発者用ショートカット
        </Link>
      </main>
    </div>
  );
}
