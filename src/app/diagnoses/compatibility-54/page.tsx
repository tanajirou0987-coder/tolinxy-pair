"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Compatibility54StartPage() {
  const router = useRouter();

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
      <div className="relative z-10 min-h-screen px-4 py-12 lg:hidden">
        <div className="relative mx-auto w-full max-w-md">
        <motion.main
          className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-8 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
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
                className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-lg p-4 text-center shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
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
                { title: "コミュニケーション", desc: "18問 / 話し方・聞き方のクセ", bgColor: "#87CEEB" },
                { title: "意思決定", desc: "18問 / ロジックと感情のバランス", bgColor: "#87CEEB" },
                { title: "関係性", desc: "18問 / リード＆サポートの傾向", bgColor: "#FFF8DC" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="rounded-[32px] border border-white/70 p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] backdrop-blur-lg"
                  style={{ backgroundColor: `${item.bgColor}CC`, background: `linear-gradient(135deg, ${item.bgColor}DD 0%, ${item.bgColor}BB 100%)` }}
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
              className="w-full rounded-[32px] border border-white/60 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md px-8 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_12px_40px_rgba(255,182,193,0.4),0px_6px_20px_rgba(255,182,193,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(255,182,193,0.5),0px_8px_25px_rgba(255,182,193,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              徹底診断を始める
            </motion.button>
            
            <div className="relative">
              <div className="absolute -top-3 left-6 z-10 rounded-full border border-black bg-[#87CEEB] px-4 py-1 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                おすすめ
              </div>
              <motion.button
                onClick={() => router.push("/diagnoses/compatibility-54/multi")}
                className="w-full rounded-[32px] border border-white/60 bg-gradient-to-br from-sky-300/90 via-sky-200/90 to-sky-300/90 backdrop-blur-md px-8 py-6 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_12px_40px_rgba(135,206,235,0.4),0px_6px_20px_rgba(135,206,235,0.3),inset_0px_1px_0px_rgba(255,255,255,0.6)] hover:shadow-[0px_16px_50px_rgba(135,206,235,0.5),0px_8px_25px_rgba(135,206,235,0.4),inset_0px_1px_0px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.8)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ふたりで同時接続
              </motion.button>
            </div>

            <motion.button
              onClick={() => router.push("/")}
              className="w-full rounded-[32px] border border-white/60 bg-white/95 backdrop-blur-md px-8 py-4 text-lg font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12),0px_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
            >
              ホームに戻る
            </motion.button>
          </div>
        </motion.main>
      </div>
      </div>

      {/* PC用レイアウト */}
      <div className="hidden lg:block relative z-10 min-h-screen px-8 py-16">
        <div className="relative mx-auto w-full px-12">
          <motion.main
            className="rounded-[48px] border border-white/70 bg-white/90 backdrop-blur-2xl p-12 shadow-[0px_30px_80px_rgba(0,0,0,0.12),0px_15px_40px_rgba(0,0,0,0.08),inset_0px_1px_0px_rgba(255,255,255,0.8)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-12 mb-12">
              {/* 左カラム */}
              <div className="space-y-8">
                <div className="text-left">
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
                      className="rounded-[36px] border border-white/70 bg-white/85 backdrop-blur-lg p-6 text-center shadow-[0px_16px_48px_rgba(0,0,0,0.1),0px_8px_24px_rgba(0,0,0,0.06),inset_0px_1px_0px_rgba(255,255,255,0.9)]"
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
                        className="rounded-[32px] border border-white/70 p-6 shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_6px_16px_rgba(0,0,0,0.05),inset_0px_1px_0px_rgba(255,255,255,0.9)] backdrop-blur-lg"
                        style={{ background: `linear-gradient(135deg, ${item.bgColor}DD 0%, ${item.bgColor}BB 100%)` }}
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
                className="w-full rounded-[36px] border border-white/60 bg-gradient-to-br from-pink-300/90 via-pink-200/90 to-pink-300/90 backdrop-blur-md px-12 py-8 text-3xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 shadow-[0px_16px_48px_rgba(255,182,193,0.45),0px_8px_24px_rgba(255,182,193,0.35),inset_0px_1px_0px_rgba(255,255,255,0.7)] hover:shadow-[0px_20px_60px_rgba(255,182,193,0.55),0px_10px_30px_rgba(255,182,193,0.45),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                徹底診断を始める
              </motion.button>
              
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10 rounded-full border border-black bg-[#87CEEB] px-4 py-1 text-sm font-['Coming_Soon:Regular',sans-serif] font-normal text-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  おすすめ
                </div>
                <motion.button
                  onClick={() => router.push("/diagnoses/compatibility-54/multi")}
                  className="w-full rounded-[36px] border border-white/60 bg-gradient-to-br from-sky-300/90 via-sky-200/90 to-sky-300/90 backdrop-blur-md px-12 py-8 text-2xl font-['Coming_Soon:Regular',sans-serif] font-bold text-gray-900 shadow-[0px_16px_48px_rgba(135,206,235,0.45),0px_8px_24px_rgba(135,206,235,0.35),inset_0px_1px_0px_rgba(255,255,255,0.7)] hover:shadow-[0px_20px_60px_rgba(135,206,235,0.55),0px_10px_30px_rgba(135,206,235,0.45),inset_0px_1px_0px_rgba(255,255,255,0.9)] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ふたりで同時接続
                </motion.button>
              </div>

              <motion.button
                onClick={() => router.push("/")}
                className="w-full rounded-[36px] border border-white/60 bg-white/95 backdrop-blur-md px-12 py-6 text-xl font-['Coming_Soon:Regular',sans-serif] font-semibold text-gray-900 shadow-[0px_16px_48px_rgba(0,0,0,0.1),0px_8px_24px_rgba(0,0,0,0.06),inset_0px_1px_0px_rgba(255,255,255,0.9)] hover:shadow-[0px_20px_60px_rgba(0,0,0,0.15),0px_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
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
