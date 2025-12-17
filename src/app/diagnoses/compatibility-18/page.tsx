"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export default function Compatibility18StartPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <motion.main
        className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[32px] border border-white/5 bg-white/5 p-8 backdrop-blur-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <Card className="border-white/5 bg-transparent text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            <CardHeader className="border-b border-white/10 pb-8">
              <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}>
                <CardTitle className="text-3xl font-semibold text-white">クイック相性診断</CardTitle>
              </motion.div>
              <p className="mt-2 text-sm uppercase tracking-[0.4em] text-muted-foreground">18 questions / about 3 min</p>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                待ち合わせの前にタイプ感をざっと共有したいとき向けの18問。テンポ・意思決定・距離感をシンプルに確認できます。
              </p>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <motion.div className="grid gap-6 md:grid-cols-2" variants={itemVariants}>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-white/90">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">こんなとき</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">今すぐ温度感を確かめたい</h3>
                  <p className="mt-2 text-sm text-muted-foreground">会話テンポのズレや距離感を素早く可視化。</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-white/90">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">測る軸</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>• コミュニケーション 6問</li>
                    <li>• 意思決定 6問</li>
                    <li>• 関係性 6問</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div className="grid gap-4 sm:grid-cols-2" variants={itemVariants}>
                {[{ label: "平均回答時間", value: "約3分" }, { label: "ラブタイプ", value: "27分類" }].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.08] px-5 py-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-white">ご利用前のメモ</p>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    クイック診断は1台の端末を交互に操作する方式です。同時入力をしたい場合は54問モードをご利用ください。
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => router.push("/diagnoses/compatibility-18/questions")}
                    className="w-full rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-[0_20px_45px_rgba(255,217,59,0.35)]"
                    size="lg"
                  >
                    診断を始める
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="flex flex-col gap-3 pt-2 text-sm" variants={itemVariants}>
                <Button
                  onClick={() => router.push("/diagnoses")}
                  variant="outline"
                  className="w-full rounded-2xl border-white/20 text-foreground hover:border-primary hover:text-primary"
                >
                  診断一覧に戻る
                </Button>
                <Button onClick={() => router.push("/")} variant="ghost" className="w-full rounded-2xl text-muted-foreground hover:text-primary">
                  ホームに戻る
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
}
