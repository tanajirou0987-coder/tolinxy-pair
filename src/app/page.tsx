"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const diagnostics = [
  {
    title: "Compatibility Deep 54",
    description: "54問でリズムも価値観も整理。節目の会話に。",
    href: "/diagnoses/compatibility-54",
    duration: "約7-8分 / 54問",
    gradient: "from-[#ffd93b] via-[#ffb347] to-[#ff8e53]",
    stats: ["6軸×9問", "27タイプ / 729相性"],
  },
  {
    title: "Compatibility Quick 18",
    description: "18問で温度感をチェック。待ち合わせ前でもすぐ。",
    href: "/diagnoses/compatibility-18",
    duration: "約3分 / 18問",
    gradient: "from-[#7ff6f2] via-[#6ac9ff] to-[#9a8cff]",
    stats: ["3軸×6問", "即時タイプ共有"],
  },
];

const heroStats = [
  { label: "質問数", value: "18 or 54", meta: "モードを選べる" },
  { label: "タイプ", value: "27分類", meta: "3軸×3段階" },
  { label: "相性データ", value: "729パターン", meta: "事前に解析済み" },
];

const steps = [
  {
    title: "コミュニケーション軸",
    description: "テンポや話し方のクセを3段階で判断。",
  },
  {
    title: "意思決定軸",
    description: "直感派かロジック派かのバランスを把握。",
  },
  {
    title: "関係性軸",
    description: "距離感と支え方のスタイルを整理。",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-14">
      <motion.section
        className="space-y-8 rounded-[36px] border border-white/5 bg-gradient-to-br from-[#121524]/80 via-[#0b0d16]/85 to-[#0e111c]/90 px-6 py-10 text-center shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold uppercase tracking-[0.6em] text-white sm:text-5xl">PAIRLY LAB</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
          2人のテンポ・判断軸・距離感を3つの質問セットでチェック。必要なときに必要な深さだけ診断できます。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/diagnoses/compatibility-54"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-[0_20px_45px_rgba(255,217,59,0.35)] transition hover:bg-primary/90"
          >
            54問でじっくり
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/diagnoses/compatibility-18"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:border-primary hover:text-primary"
          >
            3分で試す
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-5">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.meta}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">DIAGNOSIS MODE</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">目的に合わせてモードを選ぶ。</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {diagnostics.map((mode) => (
            <motion.div
              key={mode.title}
              className="rounded-[28px] border border-white/5 bg-card/70 p-8 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs uppercase tracking-[0.45em] text-white/70">MODE</p>
              <h3 className="mt-3 text-2xl font-semibold">{mode.title}</h3>
              <p className="mt-2 text-sm text-white/80">{mode.description}</p>
              <div className="mt-5 space-y-1 text-sm text-white/80">
                <p>{mode.duration}</p>
                <p>{mode.stats.join(" / ")}</p>
              </div>
              <Link href={mode.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/90 hover:text-white">
                詳細を見る
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        className="space-y-8 rounded-[32px] border border-white/5 bg-white/5 px-6 py-10 backdrop-blur-3xl sm:px-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">PROCESS</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">3軸を組み合わせて27タイプを作成。</h3>
          <p className="mt-3 text-sm text-muted-foreground">各軸のスコアを組み合わせ、共通言語に変換します。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-white/10 bg-black/20 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">STEP {index + 1}</span>
              </div>
              <p className="mt-3 text-lg font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="space-y-4 rounded-[32px] border border-white/5 bg-gradient-to-r from-[#ffd93b1a] via-[#7ff6f218] to-[#9a8cff1f] px-6 py-10 text-center backdrop-blur-3xl sm:px-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">SHARE</p>
        <h3 className="text-3xl font-semibold text-white">結果は1枚のカードに集約。</h3>
        <p className="text-sm text-muted-foreground">タイプとコメントをまとめたカードをすぐに共有できます。</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-white">
          <Link href="/diagnoses/compatibility-54" className="rounded-full border border-white/20 px-6 py-3 transition hover:border-primary hover:text-primary">
            徹底診断へ
          </Link>
          <Link href="/diagnoses/compatibility-18" className="rounded-full border border-white/20 px-6 py-3 transition hover:border-primary hover:text-primary">
            クイック診断へ
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
