"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ヘッダー背景画像
const headerBackgroundImage = "/画像が生成されました.png";

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
    <div className="relative min-h-screen overflow-hidden bg-[#ffc9c9]">
      {/* スマホ用レイアウト */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen md:hidden py-8 px-4">
        {/* Figmaデザインスタイルのメインカード */}
        <motion.div
          className="relative bg-white border-[3.996px] border-[#2b2b2b] rounded-[49.948px] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 繰り返しテキスト - Figmaデザインスタイル */}
          <div className="text-center mb-4 py-2">
            <p className="text-[19.979px] font-['Coming_Soon:Regular',sans-serif] font-light text-[#e84d3d] tracking-[-0.3197px] leading-[31.967px]">
              相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断
            </p>
          </div>

          {/* メインタイトル - Figmaデザインスタイル */}
          <div className="text-center mb-8 py-4">
            <h1 className="text-[65.931px] font-['Coming_Soon:Regular',sans-serif] font-bold text-[#ff9960] mb-2 leading-[31.967px] tracking-[-0.3197px]">
              PAIRLY LAB
            </h1>
            <p className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black">
              恋愛相性診断
            </p>
          </div>

          {/* メインコンテンツエリア */}
          <div className="relative bg-white rounded-[35px] px-[12px] py-[24px]">
            {/* 説明文 - Figmaデザインスタイル（大きな黄色緑色テキスト） */}
            <motion.div
              className="text-center mb-8 py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[55.942px] font-['Coming_Soon:Regular',sans-serif] font-normal text-[#c1d50c] leading-[64.932px] whitespace-pre-wrap max-w-[615px] mx-auto">
                2人のリズムを数分で診断。恋愛タイプの測定と相性分析をかんたん＆ビジュアルに届ける診断アプリです。
              </p>
            </motion.div>

            {/* メニューフレーム風のコンテナ - Figmaデザインスタイル */}
            <div className="border-[#2a2a2a] border-[3.996px] border-solid rounded-[31.967px] p-6 mb-8">
              {/* クイックアクションボタン - Figmaデザインのスタイルに合わせて調整 */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/diagnoses/compatibility-54"
                  className="group relative px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] bg-[#FFB6C1] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02]"
                >
                  <span className="relative z-10">54問でじっくり</span>
                </Link>
                <Link
                  href="/diagnoses/compatibility-18"
                  className="group relative px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] bg-[#87CEEB] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02]"
                >
                  <span className="relative z-10">3分で試す</span>
                </Link>
              </motion.div>

              {/* ボタン風の要素 - Figmaデザインスタイル */}
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <div className="bg-[#ffebdc] border-[#2a2a2a] border-[3.996px] border-solid h-[54.943px] rounded-[15.983px] px-6 flex items-center justify-center">
                  <p className="font-['Coming_Soon:Regular',sans-serif] font-bold text-[#2a2a2a] text-[24.974px] tracking-[-0.3197px]">
                    診断モード
                  </p>
                </div>
                <div className="bg-[#ffebdc] border-[#2a2a2a] border-[3.996px] border-solid h-[54.943px] rounded-[15.983px] px-6 flex items-center justify-center">
                  <p className="font-['Coming_Soon:Regular',sans-serif] font-bold text-[#2a2a2a] text-[24.974px] tracking-[-0.3197px]">
                    相性分析
                  </p>
                </div>
              </div>
            </div>

            {/* 統計セクション - Figmaデザインのスタイルに合わせて調整 */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-12 px-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "質問", value: "18/54" },
                { label: "タイプ", value: "27" },
                { label: "相性", value: "729" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[16px] border border-black bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <div className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{stat.value}</div>
                  <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* 診断モードカード - Figmaデザインの色合いとスタイルを適用 */}
            <div className="space-y-4 px-[22px] mb-8">
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black mb-2">選べる診断</p>
                <h2 className="text-3xl sm:text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black">
                  モードを選ぶ
                </h2>
              </motion.div>

              {diagnostics.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link href={mode.href}>
                    <div
                      className="relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[115px] flex items-center justify-center cursor-pointer transform hover:scale-[1.02] transition-all"
                      style={{ backgroundColor: mode.bgColor }}
                    >
                      <div className="text-center px-4 max-w-[300px] mx-auto">
                        <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] mb-2 opacity-80 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {mode.duration}
                        </div>
                        <h3 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {mode.title}
                        </h3>
                        <p className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.5]">
                          {mode.description}
                        </p>
                        <p className="text-[10px] font-['Coming_Soon:Regular',sans-serif] font-normal text-black/70 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.4]">
                          {mode.subtext}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 使い方セクション - Figmaデザインのスタイルに合わせて調整 */}
            <motion.section
              className="rounded-[16px] border border-black bg-[#FFB6C1] p-8 mb-8 mx-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] text-black mb-3 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">使い方</p>
                <h3 className="text-3xl sm:text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">かんたん3ステップ</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { num: "01", title: "診断を選ぶ", desc: "気分に合わせて3分 or 7分" },
                  { num: "02", title: "質問に答える", desc: "シンプルな選択肢だけ" },
                  { num: "03", title: "結果を共有", desc: "カードでスクショして拡散" },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/30 mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.num}</div>
                    <h4 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.title}</h4>
                    <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/70 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* CTAセクション - Figmaデザインのスタイルに合わせて調整 */}
            <motion.section
              className="mt-8 text-center mb-20 px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-[16px] border border-black bg-[#FFF8DC] p-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="text-2xl sm:text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.5] mx-auto max-w-[320px]">
                  今日の2人の温度を<br />
                  診断してみる
                </h3>
                <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 mb-8 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.6] mx-auto max-w-[340px]">
                  気分が上がる前にサッと診断したい日も、<br />
                  じっくり語り合いたい日もOK。
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/diagnoses/compatibility-54"
                    className="px-10 py-5 text-xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] border border-black bg-white text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all"
                  >
                    徹底診断を始める
                  </Link>
                  <Link
                    href="/diagnoses/compatibility-18"
                    className="px-10 py-5 text-xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] border border-black bg-[#FFB6C1] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all"
                  >
                    クイック診断
                  </Link>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:block relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Figmaデザインスタイルのメインカード - PC用 */}
        <motion.div
          className="relative bg-white border-[3.996px] border-[#2b2b2b] rounded-[49.948px] p-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 繰り返しテキスト - Figmaデザインスタイル PC用 */}
          <div className="text-center mb-6 py-2">
            <p className="text-[19.979px] font-['Coming_Soon:Regular',sans-serif] font-light text-[#e84d3d] tracking-[-0.3197px] leading-[31.967px]">
              相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断 · 相性診断
            </p>
          </div>

          {/* メインタイトル - Figmaデザインスタイル PC用 */}
          <div className="text-center mb-8 py-4">
            <h1 className="text-[65.931px] font-['Coming_Soon:Regular',sans-serif] font-bold text-[#ff9960] mb-4 leading-[31.967px] tracking-[-0.3197px]">
              PAIRLY LAB
            </h1>
            <p className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-6">
              恋愛相性診断
            </p>
            <p className="text-[55.942px] font-['Coming_Soon:Regular',sans-serif] font-normal text-[#c1d50c] leading-[64.932px] whitespace-pre-wrap max-w-[615px] mx-auto">
              2人のリズムを数分で診断。恋愛タイプの測定と相性分析をかんたん＆ビジュアルに届ける診断アプリです。
            </p>
          </div>

        {/* メインコンテンツエリア - PC用 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 左カラム */}
          <div className="space-y-8">
            {/* メニューフレーム風のコンテナ - Figmaデザインスタイル PC用 */}
            <div className="border-[#2a2a2a] border-[3.996px] border-solid rounded-[31.967px] p-8">
              {/* クイックアクションボタン - PC用 */}
              <motion.div
                className="flex flex-col gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/diagnoses/compatibility-54"
                  className="group relative px-12 py-6 text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] bg-[#FFB6C1] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02] text-center"
                >
                  <span className="relative z-10">54問でじっくり</span>
                </Link>
                <Link
                  href="/diagnoses/compatibility-18"
                  className="group relative px-12 py-6 text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] bg-[#87CEEB] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02] text-center"
                >
                  <span className="relative z-10">3分で試す</span>
                </Link>
              </motion.div>

              {/* ボタン風の要素 - Figmaデザインスタイル PC用 */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-[#ffebdc] border-[#2a2a2a] border-[3.996px] border-solid h-[54.943px] rounded-[15.983px] px-8 flex items-center justify-center">
                  <p className="font-['Coming_Soon:Regular',sans-serif] font-bold text-[#2a2a2a] text-[24.974px] tracking-[-0.3197px]">
                    診断モード
                  </p>
                </div>
                <div className="bg-[#ffebdc] border-[#2a2a2a] border-[3.996px] border-solid h-[54.943px] rounded-[15.983px] px-8 flex items-center justify-center">
                  <p className="font-['Coming_Soon:Regular',sans-serif] font-bold text-[#2a2a2a] text-[24.974px] tracking-[-0.3197px]">
                    相性分析
                  </p>
                </div>
              </div>
            </div>

            {/* 統計セクション - PC用 */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "質問", value: "18/54" },
                { label: "タイプ", value: "27" },
                { label: "相性", value: "729" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-[16px] border border-black bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <div className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{stat.value}</div>
                  <div className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 右カラム */}
          <div className="space-y-8">
            {/* 診断モードカード - PC用 */}
            <div className="space-y-4">
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.3em] text-black mb-2">選べる診断</p>
                <h2 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black">
                  モードを選ぶ
                </h2>
              </motion.div>

              {diagnostics.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link href={mode.href}>
                    <div
                      className="relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[140px] flex items-center justify-center cursor-pointer transform hover:scale-[1.02] transition-all"
                      style={{ backgroundColor: mode.bgColor }}
                    >
                      <div className="text-center px-8">
                        <div className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] mb-2 opacity-80 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {mode.duration}
                        </div>
                        <h3 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          {mode.title}
                        </h3>
                        <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.5]">
                          {mode.description}
                        </p>
                        <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/70 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.4]">
                          {mode.subtext}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 使い方セクション - PC用 */}
        <motion.section
          className="rounded-[16px] border border-black bg-[#FFB6C1] p-12 mb-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal uppercase tracking-[0.4em] text-black mb-3 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">使い方</p>
            <h3 className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">かんたん3ステップ</h3>
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-7xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/30 mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.num}</div>
                <h4 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-3 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.title}</h4>
                <p className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black/70 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTAセクション - PC用 */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="rounded-[16px] border border-black bg-[#FFF8DC] p-16 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-4xl mx-auto">
            <h3 className="text-4xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.5]">
              今日の2人の温度を<br />
              診断してみる
            </h3>
            <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 mb-10 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] leading-[1.6]">
              気分が上がる前にサッと診断したい日も、<br />
              じっくり語り合いたい日もOK。
            </p>
            <div className="flex justify-center gap-6">
              <Link
                href="/diagnoses/compatibility-54"
                className="px-12 py-6 text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] border border-black bg-white text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all"
              >
                徹底診断を始める
              </Link>
              <Link
                href="/diagnoses/compatibility-18"
                className="px-12 py-6 text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal rounded-[16px] border border-black bg-[#FFB6C1] text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all"
              >
                クイック診断
              </Link>
            </div>
          </div>
        </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
