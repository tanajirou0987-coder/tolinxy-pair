import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const typeCode = formData.get("typeCode") as string;

    if (!file || !typeCode) {
      return NextResponse.json({ error: "ファイルとタイプコードが必要です" }, { status: 400 });
    }

    // ファイルタイプの検証
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "画像ファイルのみアップロード可能です" }, { status: 400 });
    }

    // public/character-images ディレクトリのパス
    const publicDir = join(process.cwd(), "public", "character-images");
    
    // ディレクトリが存在しない場合は作成
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    // ファイル名を {typeCode}.png に統一
    const fileName = `${typeCode}.png`;
    const filePath = join(publicDir, fileName);

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイルを保存
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "画像のアップロードが完了しました",
      path: `/character-images/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
