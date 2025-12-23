"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Compatibility54StartPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      {/* スマホ用レイアウト */}
      <div className="relative min-h-screen px-4 py-12 md:hidden">
        <div className="relative mx-auto w-full max-w-md">
        <motion.main
          className="rounded-[16px] border border-black bg-[#e2bef1] p-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-5xl font-['Coming_Soon:Regular',sans-serif] font-normal mb-4 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              DEEP 54
            </h1>
            <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">徹底相性診断</p>
            <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 max-w-2xl mx-auto leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              54問で価値観から生活リズムまで照射。<br />
              ひとつずつ丁寧に進められるので、相手と共有する前に自分の感覚も整理できます。
            </p>
          </div>

          <div className="grid gap-4 mb-10 grid-cols-3">
            {[
              { label: "質問数", value: "54問" },
              { label: "所要時間", value: "約7-8分" },
              { label: "相性軸", value: "6軸" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="rounded-[16px] border border-black bg-white p-4 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-1 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.value}</div>
                <div className="text-xs font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断内容</h2>
            <div className="space-y-4">
              {[
                { title: "コミュニケーション", desc: "18問 / 話し方・聞き方のクセ", bgColor: "#fbf7d5" },
                { title: "意思決定", desc: "18問 / ロジックと感情のバランス", bgColor: "#f97b83" },
                { title: "関係性", desc: "18問 / リード＆サポートの傾向", bgColor: "#f9ded7" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="rounded-[16px] border border-black p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                  style={{ backgroundColor: item.bgColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <h3 className="text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.title}</h3>
                  <p className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              onClick={() => router.push("/diagnoses/compatibility-54/questions")}
              className="w-full rounded-[16px] border border-black bg-white px-8 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all transform hover:scale-105 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              徹底診断を始める
            </motion.button>
            
            <div className="relative">
              <div className="absolute -top-3 left-6 z-10 rounded-full border border-black bg-[#fbf7d5] px-4 py-1 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                おすすめ
              </div>
              <motion.button
                onClick={() => router.push("/diagnoses/compatibility-54/multi")}
                className="w-full rounded-[16px] border border-black bg-[#fbf7d5] px-8 py-6 text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all transform hover:scale-105 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ふたりで同時接続
              </motion.button>
            </div>

            <motion.button
              onClick={() => router.push("/")}
              className="w-full rounded-[16px] border border-black bg-white px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-normal text-black hover:bg-gray-100 transition-all shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
            >
              ホームに戻る
            </motion.button>
          </div>
        </motion.main>
      </div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden md:block relative min-h-screen px-8 py-16">
        <div className="relative mx-auto w-full max-w-7xl">
          <motion.main
            className="rounded-[16px] border border-black bg-[#e2bef1] p-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* 左カラム */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-7xl font-['Coming_Soon:Regular',sans-serif] font-normal mb-6 text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                    DEEP 54
                  </h1>
                  <p className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-4 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">徹底相性診断</p>
                  <p className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 leading-relaxed text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                    54問で価値観から生活リズムまで照射。<br />
                    ひとつずつ丁寧に進められるので、相手と共有する前に自分の感覚も整理できます。
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "質問数", value: "54問" },
                    { label: "所要時間", value: "約7-8分" },
                    { label: "相性軸", value: "6軸" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="rounded-[16px] border border-black bg-white p-6 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.value}</div>
                      <div className="text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 右カラム */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-6 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">診断内容</h2>
                  <div className="space-y-4">
                    {[
                      { title: "コミュニケーション", desc: "18問 / 話し方・聞き方のクセ", bgColor: "#fbf7d5" },
                      { title: "意思決定", desc: "18問 / ロジックと感情のバランス", bgColor: "#f97b83" },
                      { title: "関係性", desc: "18問 / リード＆サポートの傾向", bgColor: "#f9ded7" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.title}
                        className="rounded-[16px] border border-black p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                        style={{ backgroundColor: item.bgColor }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <h3 className="text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black mb-2 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.title}</h3>
                        <p className="text-base font-['Coming_Soon:Regular',sans-serif] font-normal text-black/80 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <motion.button
                onClick={() => router.push("/diagnoses/compatibility-54/questions")}
                className="w-full rounded-[16px] border border-black bg-white px-12 py-8 text-3xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all transform hover:scale-105 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                徹底診断を始める
              </motion.button>
              
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10 rounded-full border border-black bg-[#fbf7d5] px-4 py-1 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  おすすめ
                </div>
                <motion.button
                  onClick={() => router.push("/diagnoses/compatibility-54/multi")}
                  className="w-full rounded-[16px] border border-black bg-[#fbf7d5] px-12 py-8 text-2xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all transform hover:scale-105 text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ふたりで同時接続
                </motion.button>
              </div>

              <motion.button
                onClick={() => router.push("/")}
                className="w-full rounded-[16px] border border-black bg-white px-12 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-normal text-black hover:bg-gray-100 transition-all shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              >
                ホームに戻る
              </motion.button>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
