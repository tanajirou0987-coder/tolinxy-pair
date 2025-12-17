"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Compatibility54StartPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <main className="relative mx-auto w-full max-w-4xl rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <motion.div
          className="rounded-3xl border border-white/10 bg-transparent p-6 text-foreground sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">precision mode</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">徹底相性診断</h1>
              <p className="text-muted-foreground">
                54問で価値観から生活リズムまで照射。ひとつずつ丁寧に進められるので、相手と共有する前に自分の感覚も整理できます。
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-white/15 px-3 py-1 uppercase tracking-[0.3em]">54 questions</span>
                <span className="rounded-full border border-white/15 px-3 py-1 uppercase tracking-[0.3em]">about 7 min</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "精度", value: "★★★★★" },
                  { label: "相性指標", value: "6軸" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <Button
                  onClick={() => router.push("/diagnoses/compatibility-54/questions")}
                  className="w-full rounded-2xl bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(255,217,59,0.35)]"
                  size="lg"
                >
                  徹底診断を始める
                </Button>
                <div className="relative">
                  <div className="absolute -top-2 left-4 z-10 rounded-full bg-gradient-to-r from-[#7ff6f2] to-[#9a8cff] px-3 py-1 text-[0.65rem] font-bold text-[#050608] shadow-md">
                    おすすめ
                  </div>
                  <Button
                    onClick={() => router.push("/diagnoses/compatibility-54/multi")}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#7ff6f2] to-[#9a8cff] text-[#050608] shadow-[0_18px_40px_rgba(127,246,242,0.25)] transition hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(154,140,255,0.35)]"
                    size="lg"
                  >
                    ふたりで同時接続
                  </Button>
                </div>
                <Button
                  onClick={() => router.push("/diagnoses")}
                  variant="outline"
                  className="w-full rounded-2xl border-white/20 text-foreground hover:border-primary hover:text-primary"
                  size="lg"
                >
                  他の診断を見る
                </Button>
              </div>
            </div>
            <Card className="flex-1 border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg text-white">診断内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-white">コミュニケーション特性</p>
                  <p className="text-xs text-muted-foreground">18問 / 話し方・聞き方のクセ</p>
                </div>
                <div>
                  <p className="font-semibold text-white">意思決定特性</p>
                  <p className="text-xs text-muted-foreground">18問 / ロジックと感情のバランス</p>
                </div>
                <div>
                  <p className="font-semibold text-white">関係性特性</p>
                  <p className="text-xs text-muted-foreground">18問 / リード＆サポートの傾向</p>
                </div>
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.08] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  途中保存に対応。回答した内容はそのまま相性リポートに転写され、後からでもゆっくり読み返せます。
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
