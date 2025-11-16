"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Compatibility54StartPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/diagnoses/compatibility-54/questions");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <main className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center text-3xl">
              <span>🔍</span>
              <span>徹底相性診断</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-center">
              <p className="text-lg text-[#2C3E50]">
                精度の高い相性を診断
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-[#2C3E50]/60">
                <span>54問</span>
                <span>•</span>
                <span>約7分</span>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-[#2C3E50]/10 p-4">
              <h3 className="font-semibold text-[#2C3E50]">診断内容</h3>
              <ul className="space-y-2 text-sm text-[#2C3E50]/80">
                <li>• コミュニケーション特性（18問）</li>
                <li>• 意思決定特性（18問）</li>
                <li>• 関係性特性（18問）</li>
              </ul>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-lg font-semibold text-white hover:opacity-90"
              size="lg"
            >
              診断を始める
            </Button>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => router.push("/diagnoses")}
                variant="outline"
                className="w-full border-[#2C3E50]/20 text-[#2C3E50] hover:bg-[#2C3E50]/10"
              >
                診断一覧に戻る
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="w-full text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-transparent"
              >
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


