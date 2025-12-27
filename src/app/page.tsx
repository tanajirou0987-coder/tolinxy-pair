"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ヘッダー背景画像
const headerBackgroundImage = "/unnamed.jpg";

const diagnostics = [
  {
    title: "DEEP 54",
    description: "価値観まで測る徹底54問",
    subtext: "感情・意思決定・生活リズムまで6軸で深掘り",
    href: "/diagnoses/compatibility-54",
    duration: "約7-8分",
    bgColor: "#FFB6C1", // ライトピンク
  },
  {
    title: "QUICK 18",
    description: "3分で使えるクイック診断",
    subtext: "飲み会やちょっとした待ち時間で使える",
    href: "/diagnoses/compatibility-18",
    duration: "約3分",
    bgColor: "#87CEEB", // スカイブルー
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 背景を全画面に固定 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 -z-10"></div>
      {/* 装飾的な背景要素 - Soft UIスタイル */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>
      {/* スマホ用レイアウト */}
      <div className="relative z-10 max-w-md mx-auto lg:hidden py-6 px-4">
        {/* ヘッダーセクション - Soft UIスタイル強化 */}
        <motion.section
          className="relative h-[280px] rounded-[40px] overflow-hidden mb-6 shadow-[0px_20px_60px_rgba(0,0,0,0.12),0px_8px_24px_rgba(0,0,0,0.08)] border border-white/60"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[40px]">
            <img alt="" className="absolute inset-0 w-full h-full object-cover" src={headerBackgroundImage} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 rounded-[40px]"></div>
          {/* 引用文 - Soft UIスタイル */}
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Inter:Extra_Bold_Italic',sans-serif] font-extrabold italic text-lg text-center text-white drop-shadow-[0px_4px_12px_rgba(0,0,0,0.4)] max-w-[280px] leading-[1.6] z-10 px-2">
            2人のリズム、<br />
            響き合う瞬間を。
          </p>
        </motion.section>

        {/* メインコンテナ - Soft UIデザインスタイル強化 */}
        <div className="relative mb-12">
          {/* メインコンテンツエリア - Soft UIカード強化 */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-2xl rounded-[48px] shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)] px-8 py-10 border border-white/70"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* ロゴ/タイトル - Soft UIスタイル強化 */}
            <motion.div
              className="text-center mb-8 pt-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-bold tracking-[-0.02em] mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-[0px_2px_8px_rgba(0,0,0,0.1)]">
                トリンクシーのふたり診断
              </h1>
            </motion.div>

            {/* クイックアクションボタン - Soft UIスタイル強化 */}
            <motion.div
              className="flex flex-col gap-4 mb-10 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <Link
                href="/diagnoses/compatibility-54"
                className="group relative px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold rounded-[32px] bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md text-gray-900 shadow-[0px_12px_40px_rgba(255,182,193,0.4),0px_6px_20px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(255,182,193,0.5),0px_8px_25px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 border border-white/60"
              >
                <span className="relative z-10 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">54問でじっくり</span>
              </Link>
              <Link
                href="/diagnoses/compatibility-18"
                className="group relative px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold rounded-[32px] bg-gradient-to-br from-sky-300/90 via-sky-200/90 to-sky-300/90 backdrop-blur-md text-gray-900 shadow-[0px_12px_40px_rgba(135,206,235,0.4),0px_6px_20px_rgba(135,206,235,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(135,206,235,0.5),0px_8px_25px_rgba(135,206,235,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 border border-white/60"
              >
                <span className="relative z-10 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">3分で試す</span>
              </Link>
            </motion.div>

            {/* 統計セクション - Soft UIスタイル強化 */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { label: "質問", value: "18/54" },
                { label: "タイプ", value: "27" },
                { label: "相性", value: "729" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[32px] bg-white/80 backdrop-blur-lg p-4 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] border border-white/70 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12),0px_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">{stat.value}</div>
                  <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* 診断モードカード - Soft UIスタイル強化 */}
            <div className="space-y-5 mb-8">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-medium uppercase tracking-[0.4em] text-gray-500 mb-3">選べる診断</p>
                <h2 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 drop-shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
                  モードを選ぶ
                </h2>
              </motion.div>

              {diagnostics.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                >
                  <Link href={mode.href}>
                    <motion.div
                      className="relative rounded-[36px] h-[120px] flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/70 overflow-hidden group"
                      style={{ 
                        background: mode.bgColor === "#FFB6C1" 
                          ? "linear-gradient(135deg, rgba(255,182,193,0.85) 0%, rgba(255,192,203,0.75) 50%, rgba(255,182,193,0.85) 100%)"
                          : "linear-gradient(135deg, rgba(135,206,235,0.85) 0%, rgba(176,224,230,0.75) 50%, rgba(135,206,235,0.85) 100%)"
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 text-center px-6 max-w-[320px] mx-auto">
                        <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.3em] mb-2 text-gray-700 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">
                          {mode.duration}
                        </div>
                        <h3 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]">
                          {mode.title}
                        </h3>
                        <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-800 mb-1 leading-[1.5] drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">
                          {mode.description}
                        </p>
                        <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-gray-700 leading-[1.4] drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">
                          {mode.subtext}
                        </p>
                      </div>
                      <div className="absolute inset-0 shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_8px_24px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.6)] rounded-[36px] pointer-events-none"></div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 使い方セクション - Soft UIスタイル強化 */}
            <motion.section
              className="rounded-[40px] bg-gradient-to-br from-pink-200/70 via-pink-100/70 to-pink-200/70 backdrop-blur-2xl p-8 mb-8 shadow-[0px_24px_64px_rgba(255,182,193,0.25),0px_12px_32px_rgba(255,182,193,0.2),inset_0px_1px_0px_rgba(255,255,255,0.6)] border border-white/70"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-8">
                <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.5em] text-gray-600 mb-4">使い方</p>
                <h3 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 drop-shadow-[0px_2px_8px_rgba(255,255,255,0.8)] whitespace-nowrap">かんたん3ステップ</h3>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { num: "01", title: "診断を選ぶ", desc: "気分に合わせて3分 or 7分" },
                  { num: "02", title: "質問に答える", desc: "シンプルな選択肢だけ" },
                  { num: "03", title: "結果を共有", desc: "カードでスクショして拡散" },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-6xl font-['Coming_Soon:Regular',sans-serif] font-bold text-white/50 mb-3 drop-shadow-[0px_2px_8px_rgba(0,0,0,0.1)]">{step.num}</div>
                    <h4 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-3 drop-shadow-[0px_1px_4px_rgba(255,255,255,0.8)]">{step.title}</h4>
                    <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 leading-relaxed drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* CTAセクション - Soft UIスタイル強化 */}
            <motion.section
              className="mt-8 text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-[40px] bg-gradient-to-br from-yellow-50/90 via-amber-50/90 to-yellow-50/90 backdrop-blur-2xl p-10 shadow-[0px_24px_64px_rgba(255,248,220,0.35),0px_12px_32px_rgba(255,248,220,0.25),inset_0px_1px_0px_rgba(255,255,255,0.7)] border border-white/70">
                <h3 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-6 drop-shadow-[0px_2px_8px_rgba(255,255,255,0.9)] leading-[1.4] mx-auto max-w-[360px]">
                  今日の2人の温度を<br />
                  診断してみる
                </h3>
                <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 mb-10 leading-[1.7] mx-auto max-w-[380px] drop-shadow-[0px_1px_4px_rgba(255,255,255,0.8)]">
                  気分が上がる前にサッと診断したい日も、<br />
                  じっくり語り合いたい日もOK。
                </p>
                <div className="flex flex-col gap-4 items-center">
                  <Link
                    href="/diagnoses/compatibility-54"
                    className="px-10 py-5 text-lg font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[32px] bg-white/95 backdrop-blur-md text-gray-900 shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_8px_24px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_20px_60px_rgba(0,0,0,0.16),0px_10px_30px_rgba(0,0,0,0.12),inset_0px_1px_0px_rgba(255,255,255,1)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/80 w-full max-w-[320px]"
                  >
                    徹底診断を始める
                  </Link>
                  <Link
                    href="/diagnoses/compatibility-18"
                    className="px-10 py-5 text-lg font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[32px] bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md text-gray-900 shadow-[0px_16px_48px_rgba(255,182,193,0.4),0px_8px_24px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.7)] hover:shadow-[0px_20px_60px_rgba(255,182,193,0.5),0px_10px_30px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.9)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/70 w-full max-w-[320px]"
                  >
                    クイック診断
                  </Link>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden lg:block relative z-10 w-full px-12 py-20">
        {/* ヘッダーセクション - PC用 Soft UIスタイル強化 */}
        <motion.section
          className="relative h-[450px] rounded-[48px] overflow-hidden mb-16 shadow-[0px_30px_80px_rgba(0,0,0,0.15),0px_15px_40px_rgba(0,0,0,0.1)] border border-white/60"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[48px]">
            <img alt="" className="absolute inset-0 w-full h-full object-cover" src={headerBackgroundImage} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 rounded-[48px]"></div>
          {/* 引用文 - PC用 Soft UIスタイル */}
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Inter:Extra_Bold_Italic',sans-serif] font-extrabold italic text-4xl text-center text-white drop-shadow-[0px_6px_16px_rgba(0,0,0,0.5)] max-w-3xl leading-[1.6] z-10">
            2人のリズム、<br />
            響き合う瞬間を。
          </p>
        </motion.section>

        {/* メインコンテンツエリア - PC用 Soft UIスタイル強化 */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          {/* 左カラム */}
          <div className="space-y-10">
            {/* ロゴ/タイトル - PC用 Soft UIスタイル */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-7xl font-['Coming_Soon:Regular',sans-serif] font-bold tracking-[-0.03em] mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
                トリンクシーのふたり診断
              </h1>
            </motion.div>

            {/* クイックアクションボタン - PC用 Soft UIスタイル強化 */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                href="/diagnoses/compatibility-54"
                className="group relative px-14 py-7 text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[36px] bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md text-gray-900 shadow-[0px_16px_48px_rgba(255,182,193,0.45),0px_8px_24px_rgba(255,182,193,0.35),inset_0px_1px_0px_rgba(255,255,255,0.7)] hover:shadow-[0px_20px_60px_rgba(255,182,193,0.55),0px_10px_30px_rgba(255,182,193,0.45),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 text-center border border-white/70"
              >
                <span className="relative z-10 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]">54問でじっくり</span>
              </Link>
              <Link
                href="/diagnoses/compatibility-18"
                className="group relative px-14 py-7 text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[36px] bg-gradient-to-br from-sky-300/90 via-sky-200/90 to-sky-300/90 backdrop-blur-md text-gray-900 shadow-[0px_16px_48px_rgba(135,206,235,0.45),0px_8px_24px_rgba(135,206,235,0.35),inset_0px_1px_0px_rgba(255,255,255,0.7)] hover:shadow-[0px_20px_60px_rgba(135,206,235,0.55),0px_10px_30px_rgba(135,206,235,0.45),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 text-center border border-white/70"
              >
                <span className="relative z-10 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]">3分で試す</span>
              </Link>
            </motion.div>

            {/* 統計セクション - PC用 Soft UIスタイル強化 */}
            <motion.div
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { label: "質問", value: "18/54" },
                { label: "タイプ", value: "27" },
                { label: "相性", value: "729" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[36px] bg-white/85 backdrop-blur-lg p-8 shadow-[0px_16px_48px_rgba(0,0,0,0.1),0px_8px_24px_rgba(0,0,0,0.06),inset_0px_1px_0px_rgba(255,255,255,0.9)] text-center border border-white/70 hover:shadow-[0px_20px_60px_rgba(0,0,0,0.15),0px_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-2 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">{stat.value}</div>
                  <div className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 右カラム */}
          <div className="space-y-10">
            {/* 診断モードカード - PC用 Soft UIスタイル強化 */}
            <div className="space-y-6">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-semibold uppercase tracking-[0.5em] text-gray-500 mb-4">選べる診断</p>
                <h2 className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 drop-shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
                  モードを選ぶ
                </h2>
              </motion.div>

              {diagnostics.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                >
                  <Link href={mode.href}>
                    <motion.div
                      className="relative rounded-[40px] h-[160px] flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/70 overflow-hidden group"
                      style={{ 
                        background: mode.bgColor === "#FFB6C1" 
                          ? "linear-gradient(135deg, rgba(255,182,193,0.9) 0%, rgba(255,192,203,0.8) 50%, rgba(255,182,193,0.9) 100%)"
                          : "linear-gradient(135deg, rgba(135,206,235,0.9) 0%, rgba(176,224,230,0.8) 50%, rgba(135,206,235,0.9) 100%)"
                      }}
                      whileHover={{ scale: 1.04, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 text-center px-10">
                        <div className="text-sm font-['Coming_Soon:Regular',sans-serif] font-bold uppercase tracking-[0.3em] mb-3 text-gray-700 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]">
                          {mode.duration}
                        </div>
                        <h3 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-3 drop-shadow-[0px_2px_6px_rgba(255,255,255,0.9)]">
                          {mode.title}
                        </h3>
                        <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-800 mb-2 leading-[1.5] drop-shadow-[0px_1px_3px_rgba(255,255,255,0.9)]">
                          {mode.description}
                        </p>
                        <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-medium text-gray-700 leading-[1.4] drop-shadow-[0px_1px_2px_rgba(255,255,255,0.9)]">
                          {mode.subtext}
                        </p>
                      </div>
                      <div className="absolute inset-0 shadow-[0px_20px_60px_rgba(0,0,0,0.15),0px_10px_30px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,0.7)] rounded-[40px] pointer-events-none"></div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 使い方セクション - PC用 Soft UIスタイル強化 */}
        <motion.section
          className="rounded-[48px] bg-gradient-to-br from-pink-200/75 via-pink-100/75 to-pink-200/75 backdrop-blur-2xl p-16 mb-12 shadow-[0px_30px_80px_rgba(255,182,193,0.3),0px_15px_40px_rgba(255,182,193,0.25),inset_0px_1px_0px_rgba(255,255,255,0.7)] border border-white/70"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-bold uppercase tracking-[0.6em] text-gray-600 mb-5">使い方</p>
            <h3 className="text-6xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 drop-shadow-[0px_3px_10px_rgba(255,255,255,0.9)]">かんたん3ステップ</h3>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {[
              { num: "01", title: "診断を選ぶ", desc: "気分に合わせて3分 or 7分" },
              { num: "02", title: "質問に答える", desc: "シンプルな選択肢だけ" },
              { num: "03", title: "結果を共有", desc: "カードでスクショして拡散" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-8xl font-['Coming_Soon:Regular',sans-serif] font-bold text-white/60 mb-5 drop-shadow-[0px_3px_10px_rgba(0,0,0,0.15)]">{step.num}</div>
                <h4 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-4 drop-shadow-[0px_2px_6px_rgba(255,255,255,0.9)]">{step.title}</h4>
                <p className="text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-700 leading-relaxed drop-shadow-[0px_1px_4px_rgba(255,255,255,0.9)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTAセクション - PC用 Soft UIスタイル強化 */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="rounded-[48px] bg-gradient-to-br from-yellow-50/95 via-amber-50/95 to-yellow-50/95 backdrop-blur-2xl p-20 shadow-[0px_30px_80px_rgba(255,248,220,0.4),0px_15px_40px_rgba(255,248,220,0.3),inset_0px_1px_0px_rgba(255,255,255,0.8)] mx-auto border border-white/70">
            <h3 className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 mb-8 drop-shadow-[0px_3px_10px_rgba(255,255,255,0.9)] leading-[1.4]">
              今日の2人の温度を<br />
              診断してみる
            </h3>
            <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-700 mb-12 leading-[1.7] drop-shadow-[0px_2px_6px_rgba(255,255,255,0.9)]">
              気分が上がる前にサッと診断したい日も、<br />
              じっくり語り合いたい日もOK。
            </p>
            <div className="flex justify-center gap-6">
              <Link
                href="/diagnoses/compatibility-54"
                className="px-16 py-7 text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[36px] bg-white/95 backdrop-blur-md text-gray-900 shadow-[0px_20px_60px_rgba(0,0,0,0.15),0px_10px_30px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,1)] hover:shadow-[0px_24px_72px_rgba(0,0,0,0.2),0px_12px_36px_rgba(0,0,0,0.15),inset_0px_1px_0px_rgba(255,255,255,1)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/80"
              >
                徹底診断を始める
              </Link>
              <Link
                href="/diagnoses/compatibility-18"
                className="px-16 py-7 text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold rounded-[36px] bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md text-gray-900 shadow-[0px_20px_60px_rgba(255,182,193,0.45),0px_10px_30px_rgba(255,182,193,0.35),inset_0px_1px_0px_rgba(255,255,255,0.8)] hover:shadow-[0px_24px_72px_rgba(255,182,193,0.55),0px_12px_36px_rgba(255,182,193,0.45),inset_0px_1px_0px_rgba(255,255,255,1)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/70"
              >
                クイック診断
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
