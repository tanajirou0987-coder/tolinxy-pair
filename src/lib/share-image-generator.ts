/**
 * 共有画像生成機能
 * フロントエンドのみで完結、非表示canvasを使用して画像を生成
 * Instagramストーリー用比率（1080 × 1920、9:16）を厳守
 * 
 * コンセプト：「縦に流れる評価カード」
 * - 上から下へ自然に視線が流れる
 * - 情報は少なめ・感情は強め
 * - 下半分は"余白"を味方につける
 */

// ==========================================
// 定数定義（比率・サイズ・文言）
// ==========================================
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920; // 9:16比率を厳守（ストーリー用）
const SCALE = 2; // Retina対応

// レイアウト定数（9:16比率を厳守）
const PADDING_X = 60;
const CONTENT_WIDTH = CANVAS_WIDTH - PADDING_X * 2;

// セクション分割（9:16比率に最適化・ストーリー用）
// 「中央1カード・上下余白」構造
// 情報の90%を画面中央に集約、上下は"呼吸する余白"として使う
const HEADER_TOP = 60; // ヘッダー開始位置（弱め・上端）
const HEADER_HEIGHT = 100; // ヘッダー高さ
const MAIN_CARD_TOP = HEADER_TOP + HEADER_HEIGHT + 100; // メインカード開始（上部余白100px）
const ELEMENT_GAP = 30; // 要素間の余白（一定）
const FOOTER_START = CANVAS_HEIGHT - 100; // フッター開始（最下部・弱め）

interface ShareImageData {
  userNickname: string;
  partnerNickname: string;
  score: number;
  percentileDisplay: string;
  rankInfo: {
    rank: string;
    rankName: string; // ベストリア, リンクス, グットン, etc.
    tier: string;
    bandName: string; // ランク帯名（評価名）：奇跡級, 理想ペア, 赤の他人, etc.
  };
  rankImagePath: string;
  message?: string;
  shareUrl: string;
}

/**
 * ランク帯名（評価名）の全一覧
 */
export const ALL_RANK_BAND_NAMES: Record<string, string> = {
  SS: "運命レベル",
  S: "恋人以上",
  A: "恋人未満",
  B: "友達以上",
  C: "安心できる距離",
  D: "初対面感覚",
  E: "少し距離あり",
  F: "敬遠しがち",
  G: "赤の他人",
};

/**
 * ランクに応じたキャラクター画像パスを取得
 * 既存の rank-images フォルダ内の画像を使用
 */
function getRankCharacterImagePath(rank: string): string {
  const rankImageMap: Record<string, string> = {
    SS: "/rank-images/10.png",
    S: "/rank-images/9.png",
    A: "/rank-images/8.png",
    B: "/rank-images/7.png",
    C: "/rank-images/6.png",
    D: "/rank-images/5.png",
    E: "/rank-images/4.png",
    F: "/rank-images/3.png",
    G: "/rank-images/2.png",
  };
  return rankImageMap[rank] || rankImageMap.G;
}

/**
 * ランク帯名を取得（感情ラベル）
 * rankInfo.bandName を使用（運命レベル, 恋人以上, 赤の他人, etc.）
 */
function getRankBandName(bandName: string): string {
  // bandName をそのまま使用（既に calculate.ts で定義済み）
  return bandName;
}

/**
 * ランク帯名の補足コピーを取得（1行・関係性の説明）
 */
function getRankBandSubCopy(rank: string): string {
  const subCopies: Record<string, string> = {
    SS: "そうそう出会わない",
    S: "かなり強い結びつき",
    A: "めちゃ相性いい",
    B: "心地いい関係",
    C: "",
    D: "可も不可もなし",
    E: "ズレを感じる",
    F: "合わせにくい",
    G: "",
  };
  return subCopies[rank] || subCopies.G;
}

/**
 * ランク帯名の感情コピーを取得（1行・共感を呼ぶ）
 */
function getRankEmotionalCopy(rank: string): string {
  const emotionalCopies: Record<string, string> = {
    SS: "無理しなくていい関係",
    S: "気づいたら距離が縮む",
    A: "自然体で続く距離感",
    B: "無理しなくていい関係",
    C: "自然体で続く距離感",
    D: "可も不可もなし",
    E: "少し距離を感じる",
    F: "合わせにくい関係",
    G: "赤の他人",
  };
  return emotionalCopies[rank] || emotionalCopies.G;
}

/**
 * 評価の補足ラベルを取得（主）
 */
function getRankEvaluationLabel(rank: string): string {
  const evaluationLabels: Record<string, string> = {
    SS: "かなり高評価",
    S: "かなり高評価",
    A: "かなり高評価",
    B: "良い評価",
    C: "普通の評価",
    D: "普通の評価",
    E: "",
    F: "",
    G: "",
  };
  return evaluationLabels[rank] || "";
}

/**
 * 画像を読み込む（Promise）
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * 画像をcontain的に描画（画像の比率を歪めず、指定エリア内に収める）
 */
function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): { drawnWidth: number; drawnHeight: number } {
  const imgAspect = img.width / img.height;
  const areaAspect = maxWidth / maxHeight;
  
  let drawWidth: number;
  let drawHeight: number;
  
  if (imgAspect > areaAspect) {
    drawWidth = maxWidth;
    drawHeight = drawWidth / imgAspect;
  } else {
    drawHeight = maxHeight;
    drawWidth = drawHeight * imgAspect;
  }
  
  const offsetX = x + (maxWidth - drawWidth) / 2;
  const offsetY = y + (maxHeight - drawHeight) / 2;
  
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  
  return { drawnWidth: drawWidth, drawnHeight: drawHeight };
}

/**
 * 角丸矩形の影を描画（カード感を出す）
 */
function drawCardShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  scale: number
): void {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 20 * scale;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8 * scale;
  
  // 角丸矩形のパスを作成
  const r = radius * scale;
  ctx.beginPath();
  ctx.moveTo((x + r) * scale, y * scale);
  ctx.lineTo((x + width - r) * scale, y * scale);
  ctx.quadraticCurveTo((x + width) * scale, y * scale, (x + width) * scale, (y + r) * scale);
  ctx.lineTo((x + width) * scale, (y + height - r) * scale);
  ctx.quadraticCurveTo((x + width) * scale, (y + height) * scale, (x + width - r) * scale, (y + height) * scale);
  ctx.lineTo((x + r) * scale, (y + height) * scale);
  ctx.quadraticCurveTo(x * scale, (y + height) * scale, x * scale, (y + height - r) * scale);
  ctx.lineTo(x * scale, (y + r) * scale);
  ctx.quadraticCurveTo(x * scale, y * scale, (x + r) * scale, y * scale);
  ctx.closePath();
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fill();
  ctx.restore();
}

/**
 * 角丸矩形を描画
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  scale: number
): void {
  const r = radius * scale;
  ctx.beginPath();
  ctx.moveTo((x + r) * scale, y * scale);
  ctx.lineTo((x + width - r) * scale, y * scale);
  ctx.quadraticCurveTo((x + width) * scale, y * scale, (x + width) * scale, (y + r) * scale);
  ctx.lineTo((x + width) * scale, (y + height - r) * scale);
  ctx.quadraticCurveTo((x + width) * scale, (y + height) * scale, (x + width - r) * scale, (y + height) * scale);
  ctx.lineTo((x + r) * scale, (y + height) * scale);
  ctx.quadraticCurveTo(x * scale, (y + height) * scale, x * scale, (y + height - r) * scale);
  ctx.lineTo(x * scale, (y + r) * scale);
  ctx.quadraticCurveTo(x * scale, y * scale, (x + r) * scale, y * scale);
  ctx.closePath();
}

/**
 * テキストを描画（中央揃え）
 */
function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontWeight: string,
  color: string,
  scale: number,
  maxWidth?: number
): void {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  if (maxWidth) {
    const words = text.split(" ");
    let line = "";
    let lineY = y;
    const lineHeight = fontSize * 1.5;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, lineY);
        line = words[i] + " ";
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);
  } else {
    ctx.fillText(text, x, y);
  }
  
  ctx.restore();
}

/**
 * QRコードをcanvasに描画
 */
async function drawQRCode(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number,
  scale: number
): Promise<void> {
  const qrCanvas = document.createElement("canvas");
  const qrSize = size * scale;
  qrCanvas.width = qrSize;
  qrCanvas.height = qrSize;
  
  try {
    const QRCode = await import("qrcode");
    await QRCode.toCanvas(qrCanvas, url, {
      width: qrSize,
      margin: 1,
      color: {
        dark: "#18181b",
        light: "#ffffff",
      },
    });
    ctx.drawImage(qrCanvas, x * scale, y * scale);
  } catch (error) {
    console.error("QR code generation failed:", error);
    const qrCtx = qrCanvas.getContext("2d");
    if (qrCtx) {
      qrCtx.fillStyle = "#ffffff";
      qrCtx.fillRect(0, 0, qrSize, qrSize);
      qrCtx.fillStyle = "#18181b";
      qrCtx.font = `${12 * scale}px sans-serif`;
      qrCtx.textAlign = "center";
      qrCtx.textBaseline = "middle";
      qrCtx.fillText("QR", qrSize / 2, qrSize / 2);
      ctx.drawImage(qrCanvas, x * scale, y * scale);
    }
  }
}

/**
 * 共有画像を生成する（非表示canvasを使用）
 * 
 * レイアウト構造（Instagramストーリー 9:16 / 1080×1920）:
 * ① ヘッダー（最上部・必須）
 *    - Pairly Lab（ロゴ的）
 *    - 相性診断結果
 * ② キャラクターゾーン（画面上部 25-30%）
 *    - キャラクター画像を大きめに
 *    - 余白をしっかり取る
 * ③ ランクゾーン（画面中央・主役）
 *    - ランク記号（Cなど）
 *    - ランク帯名（タグ風）
 * ④ 組み合わせ名（1行）
 * ⑤ 感情コピー（1行・重要）
 * ⑥ 評価補足（弱め）
 *    - 評価の補足ラベル
 *    - スコアとパーセンタイル
 * ⑦ フッター（最下部・共有動機）
 *    - Pairly Lab（ロゴ的）
 *    - この相性、どう思う？
 */
export async function generateShareImageBlob(data: ShareImageData): Promise<Blob> {
  await document.fonts.ready;
  
  const width = CANVAS_WIDTH * SCALE;
  const height = CANVAS_HEIGHT * SCALE;
  
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  
  // ==========================================
  // レイヤー1: シンプルな背景
  // ==========================================
  ctx.fillStyle = "#ffffff"; // 白背景（カード感を出す）
  ctx.fillRect(0, 0, width, height);
  
  // 微細なグラデーション（立体感）
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, "rgba(0, 0, 0, 0.02)");
  bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // ==========================================
  // レイヤー2: ヘッダー（弱め・上端）
  // ==========================================
  let currentY = HEADER_TOP;
  
  // "Pairly Lab"（ロゴ的・弱め）
  const headerFontSize = 20;
  drawCenteredText(
    ctx,
    "Pairly Lab",
    CANVAS_WIDTH / 2,
    currentY,
    headerFontSize,
    "500",
    "rgba(0, 0, 0, 0.55)",
    SCALE
  );
  currentY += headerFontSize * 1.3 + 8;
  
  // "相性診断結果"
  const subtitleFontSize = 14;
  drawCenteredText(
    ctx,
    "相性診断結果",
    CANVAS_WIDTH / 2,
    currentY,
    subtitleFontSize,
    "400",
    "rgba(0, 0, 0, 0.45)",
    SCALE
  );
  
  // ==========================================
  // レイヤー3: メインカード（画面中央・主役）
  // ==========================================
  // 縦積み（column）でY座標を積み上げ方式で計算
  currentY = MAIN_CARD_TOP;
  
  // キャラクター画像（カード内でランクより少し上の存在感）
  const imageAreaWidth = CONTENT_WIDTH * 0.75;
  const imageAreaLeft = PADDING_X + (CONTENT_WIDTH - imageAreaWidth) / 2;
  const imageAreaHeight = 380; // 固定高さ（カード内で適切なサイズ）
  
  let characterImageHeight = 0;
  try {
    const characterImagePath = getRankCharacterImagePath(data.rankInfo.rank);
    const characterImage = await loadImage(characterImagePath);
    
    // 画像をcontain的に描画
    const drawn = drawImageContain(
      ctx,
      characterImage,
      imageAreaLeft * SCALE,
      currentY * SCALE,
      imageAreaWidth * SCALE,
      imageAreaHeight * SCALE
    );
    
    characterImageHeight = drawn.drawnHeight / SCALE;
  } catch (error) {
    console.warn("Failed to load character image:", error);
  }
  
  // 縦積み：画像の下にランクを配置
  currentY += imageAreaHeight + ELEMENT_GAP;
  
  // ランク文字（主役・画面高さの12-14%程度）
  const rankFontSize = 110; // 1920 * 0.057 ≈ 110px（適切なサイズ）
  drawCenteredText(
    ctx,
    data.rankInfo.rank, // SS / S / A など
    CANVAS_WIDTH / 2,
    currentY,
    rankFontSize,
    "900",
    "#000000",
    SCALE
  );
  
  // 縦積み：ランクの下にランク帯名を配置（セットで扱う）
  currentY += rankFontSize * 0.4; // ランク直下に密接配置
  
  // ランク帯名（感情ラベル・ランクとセット）
  const rankBandName = getRankBandName(data.rankInfo.bandName);
  const bandNameFontSize = 28;
  
  // ランク帯名の背景（タグ感を出す）
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `700 ${bandNameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const bandNameMetrics = ctx.measureText(rankBandName);
  const bandNameWidth = bandNameMetrics.width + 40;
  const bandNameHeight = bandNameFontSize + 20;
  const bandNameX = (CANVAS_WIDTH - bandNameWidth) / 2;
  const bandNameY = currentY - bandNameHeight / 2;
  
  // 角丸矩形の背景
  const tagRadius = 16;
  ctx.beginPath();
  ctx.moveTo(bandNameX + tagRadius, bandNameY);
  ctx.lineTo(bandNameX + bandNameWidth - tagRadius, bandNameY);
  ctx.quadraticCurveTo(bandNameX + bandNameWidth, bandNameY, bandNameX + bandNameWidth, bandNameY + tagRadius);
  ctx.lineTo(bandNameX + bandNameWidth, bandNameY + bandNameHeight - tagRadius);
  ctx.quadraticCurveTo(bandNameX + bandNameWidth, bandNameY + bandNameHeight, bandNameX + bandNameWidth - tagRadius, bandNameY + bandNameHeight);
  ctx.lineTo(bandNameX + tagRadius, bandNameY + bandNameHeight);
  ctx.quadraticCurveTo(bandNameX, bandNameY + bandNameHeight, bandNameX, bandNameY + bandNameHeight - tagRadius);
  ctx.lineTo(bandNameX, bandNameY + tagRadius);
  ctx.quadraticCurveTo(bandNameX, bandNameY, bandNameX + tagRadius, bandNameY);
  ctx.closePath();
  
  // ランクに応じた背景色
  const rankBandColors: Record<string, string> = {
    SS: "rgba(253, 224, 71, 0.15)",
    S: "rgba(192, 132, 252, 0.15)",
    A: "rgba(96, 165, 250, 0.15)",
    B: "rgba(74, 222, 128, 0.15)",
    C: "rgba(251, 146, 60, 0.15)",
    D: "rgba(156, 163, 175, 0.15)",
    E: "rgba(156, 163, 175, 0.15)",
    F: "rgba(156, 163, 175, 0.15)",
    G: "rgba(156, 163, 175, 0.15)",
  };
  ctx.fillStyle = rankBandColors[data.rankInfo.rank] || rankBandColors.G;
  ctx.fill();
  ctx.restore();
  
  // ランク帯名のテキスト
  drawCenteredText(
    ctx,
    rankBandName,
    CANVAS_WIDTH / 2,
    currentY,
    bandNameFontSize,
    "700",
    "#000000",
    SCALE
  );
  
  // 縦積み：ランク帯名の下に関係性コピーを配置（セットで扱う）
  currentY += bandNameFontSize * 0.5 + ELEMENT_GAP;
  
  // 関係性コピー（ランクとセット）
  const emotionalCopy = getRankEmotionalCopy(data.rankInfo.rank);
  const emotionalCopyFontSize = 30;
  drawCenteredText(
    ctx,
    emotionalCopy,
    CANVAS_WIDTH / 2,
    currentY,
    emotionalCopyFontSize,
    "600",
    "rgba(0, 0, 0, 0.85)",
    SCALE,
    CONTENT_WIDTH
  );
  
  // ==========================================
  // レイヤー4: 補足情報（カード直下・近接）
  // ==========================================
  // 縦積み：関係性コピーの下に補足情報を配置（近接・一定の余白）
  currentY += emotionalCopyFontSize * 1.3 + ELEMENT_GAP;
  
  // 組み合わせ名
  const combinationFontSize = 24;
  drawCenteredText(
    ctx,
    `${data.userNickname} × ${data.partnerNickname}`,
    CANVAS_WIDTH / 2,
    currentY,
    combinationFontSize,
    "600",
    "rgba(0, 0, 0, 0.75)",
    SCALE,
    CONTENT_WIDTH
  );
  
  // 縦積み：組み合わせ名の下に評価を配置
  currentY += combinationFontSize * 1.4 + ELEMENT_GAP;
  
  // 評価の補足（主）
  const evaluationLabel = getRankEvaluationLabel(data.rankInfo.rank);
  if (evaluationLabel) {
    const evaluationFontSize = 20;
    drawCenteredText(
      ctx,
      evaluationLabel,
      CANVAS_WIDTH / 2,
      currentY,
      evaluationFontSize,
      "600",
      "rgba(0, 0, 0, 0.7)",
      SCALE
    );
    
    // 縦積み：評価の下にスコアを配置
    currentY += evaluationFontSize * 1.4 + ELEMENT_GAP;
  }
  
  // スコアとパーセンタイル（納得材料・補足）
  const scoreAndPercentile = `${data.score} pts（${data.percentileDisplay}）`;
  const scoreFontSize = 18;
  drawCenteredText(
    ctx,
    scoreAndPercentile,
    CANVAS_WIDTH / 2,
    currentY,
    scoreFontSize,
    "500",
    "rgba(0, 0, 0, 0.65)",
    SCALE
  );
  
  // ==========================================
  // レイヤー5: フッター（最下部・弱め）
  // ==========================================
  // フッターは最下部に配置（弱め）
  let footerY = FOOTER_START;
  
  ctx.save();
  ctx.scale(SCALE, SCALE);
  // "Pairly Lab"（ロゴ的・弱め）
  const footerBrandFontSize = 18;
  ctx.font = `500 ${footerBrandFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Pairly Lab", CANVAS_WIDTH / 2, footerY);
  
  // 「この相性、どう思う？」（感情を呼ぶ・弱め）
  footerY += footerBrandFontSize * 1.3 + 8;
  const footerCopyFontSize = 16;
  ctx.font = `400 ${footerCopyFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText("この相性、どう思う？", CANVAS_WIDTH / 2, footerY);
  ctx.restore();
  
  // ==========================================
  // Blobを生成
  // ==========================================
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate blob"));
        }
      },
      "image/png",
      1.0
    );
  });
}

/**
 * 画像をダウンロード
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Web Share APIで共有、またはダウンロードにフォールバック
 */
export async function shareOrDownloadImage(
  blob: Blob,
  filename: string,
  shareData?: { title: string; text: string }
): Promise<void> {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile && navigator.share) {
    try {
      const file = new File([blob], filename, { type: "image/png" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareData?.title || "相性診断結果",
          text: shareData?.text || "",
        });
        return;
      }
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.log("Web Share API failed, falling back to download", error);
      }
    }
  }
  
  downloadImage(blob, filename);
  
  // iOS Safari対策
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    setTimeout(() => {
      const url = URL.createObjectURL(blob);
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>相性診断結果</title>
              <style>
                body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; height: auto; }
                p { color: white; text-align: center; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div>
                <img src="${url}" alt="相性診断結果" />
                <p>画像を長押しして保存してください</p>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }, 100);
  }
}
