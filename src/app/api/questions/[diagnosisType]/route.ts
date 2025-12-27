import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// 診断タイプに応じた質問データを返す
export async function GET(
  _: Request,
  { params }: { params: Promise<{ diagnosisType: string }> }
) {
  try {
    const { diagnosisType } = await params;
    
    if (diagnosisType !== "compatibility-18" && diagnosisType !== "compatibility-54") {
      return NextResponse.json(
        { error: "無効な診断タイプです" },
        { status: 400 }
      );
    }

    // JSONファイルから読み込み（将来的にDBに変更可能）
    const filePath = join(
      process.cwd(),
      "data/diagnoses",
      diagnosisType,
      "questions.json"
    );

    const questionsData = JSON.parse(readFileSync(filePath, "utf-8"));

    // キャッシュヘッダーを設定（1時間）
    return NextResponse.json(questionsData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("質問データの取得エラー:", error);
    return NextResponse.json(
      { error: "質問データの取得に失敗しました" },
      { status: 500 }
    );
  }
}









