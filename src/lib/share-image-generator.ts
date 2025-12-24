/**
 * 共有画像生成機能
 * フロントエンドのみで完結、非表示canvasを使用して画像を生成
 * Instagramストーリー用比率（1080 × 1920、9:16）を厳守
 * 
 * コンセプト：「トレーディングカードスタイル」
 * - Figmaのトレーディングカードデザインを参考
 * - カラフルで装飾的なデザイン
 * - 大胆なタイポグラフィと視覚的な魅力
 * 
 * Version: 2.0 (2024-12-XX)
 * - 最新UIデザインに更新（白背景、#e2bef1カード、PAIRLY LABヘッダー）
 * - 診断結果画面と同じレイアウト構造に統一
 */

import { getRankImagePath } from "./calculate";

// ==========================================
// 定数定義（比率・サイズ・文言）
// ==========================================
// Figmaのトレーディングカードサイズ: 700 x 1080
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 1080;
const SCALE = 2; // Retina対応

// カードレイアウト（Figmaの指定通り）
// padding: 48px 64px 64px 56px (top right bottom left)
const CARD_PADDING_TOP = 48;
const CARD_PADDING_RIGHT = 64;
const CARD_PADDING_BOTTOM = 64;
const CARD_PADDING_LEFT = 56;
const CARD_BORDER_RADIUS = 64;
const CARD_GAP = 24; // gap: 24px
const CARD_BG_COLOR = "#e2bef1"; // 最新UIのカード背景色 v2.0

// 画像サイズ
const IMAGE_SIZE = 400; // 400×400px

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
 * 画像を正方形にクロップして描画（横の長さを維持し、上を少し切り取って下を伸ばす）
 */
function drawImageSquareCrop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number
): void {
  // 画像の幅をそのまま使用
  const drawWidth = size;
  const drawHeight = size; // 正方形
  
  // 画像の上を少し切り取って下を伸ばす（上20%、下80%の比率）
  const imgAspect = img.width / img.height;
  let sourceWidth: number;
  let sourceHeight: number;
  let sourceX: number;
  let sourceY: number;
  
  if (imgAspect > 1) {
    // 画像が横長の場合：高さを基準に、幅の中央部分を切り取る
    sourceHeight = img.height;
    sourceWidth = img.height; // 正方形
    sourceX = (img.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    // 画像が縦長または正方形の場合：幅を基準に、高さの上10%を切り取って下90%を使用
    sourceWidth = img.width;
    sourceHeight = img.width; // 正方形
    sourceX = 0;
    // 上を10%切り取る（つまり、上から10%の位置から開始）
    sourceY = img.height * 0.1;
    // もし下が足りない場合は、上をさらに切り取る
    if (sourceY + sourceHeight > img.height) {
      sourceY = img.height - sourceHeight;
      if (sourceY < 0) {
        sourceY = 0;
        sourceHeight = img.height;
      }
    }
  }
  
  // 画像をクロップして描画
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight, // ソース（元画像の切り取り範囲）
    x, y, drawWidth, drawHeight // デスティネーション（描画先）
  );
}

/**
 * 星を描画（装飾用）
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  scale: number,
  color: string = "#ffffff"
): void {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  
  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  const step = Math.PI / spikes;
  
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * 円を描画（装飾用）
 */
function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  scale: number,
  fillColor: string,
  strokeColor: string = "#000000",
  strokeWidth: number = 2
): void {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
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
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 12 * scale;
  
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
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
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
 * テキストを描画（左揃え）
 */
function drawLeftText(
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
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  
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
 * ランクに応じたカード背景色を取得
 */
function getCardBackgroundColor(rank: string): string {
  const colors: Record<string, string> = {
    SS: "#564eb3", // 紫
    S: "#f1dd02", // 黄色
    A: "#ff84c5", // ピンク
    B: "#d4ff4e", // ライム
    C: "#746ae1", // ライトパープル
    D: "#949494", // グレー
    E: "#949494",
    F: "#949494",
    G: "#949494",
  };
  return colors[rank] || colors.G;
}

/**
 * 共有画像を生成する（非表示canvasを使用）
 * 
 * レイアウト構造（トレーディングカードスタイル）:
 * ① 背景（ランクに応じた色）
 * ② 装飾要素（星、円など）
 * ③ メインカード（中央）
 *    - キャラクター画像（フレーム付き）
 *    - 大きな名前表示
 *    - ランク情報
 *    - スコア情報
 * ④ フッター（QRコード）
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
  // レイヤー1: 背景（白）
  // ==========================================
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = "#ffffff"; // 白背景
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
  
  // ==========================================
  // レイヤー2: メインカード（最新UIデザイン）
  // ==========================================
  const cardPadding = 32;
  const cardX = cardPadding;
  const cardY = cardPadding;
  const cardWidth = CANVAS_WIDTH - cardPadding * 2;
  const cardHeight = CANVAS_HEIGHT - cardPadding * 2;
  
  // カードの影
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 4 * SCALE;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4 * SCALE;
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 16, 1); // 角丸16px
  ctx.fillStyle = CARD_BG_COLOR; // #e2bef1
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // ==========================================
  // レイヤー3: カード内のコンテンツ
  // ==========================================
  // コンテンツエリア（カード内のpadding）
  const contentPadding = 24;
  const contentX = cardX + contentPadding;
  const contentY = cardY + contentPadding;
  const contentWidth = cardWidth - contentPadding * 2;
  
  // ヘッダー（PAIRLY LAB）
  const headerY = contentY + 20;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `400 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  // テキストシャドウを描画
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.fillText("PAIRLY LAB", contentX + contentWidth / 2, headerY);
  ctx.restore();
  
  // メインコンテンツエリア（診断結果画面と同じレイアウト）
  const mainContentY = headerY + 50;
  
  // スコア表示（円形プログレス）- 上部に配置
  const scoreCircleRadius = 50;
  const scoreCircleX = contentX + contentWidth / 2;
  const scoreCircleY = mainContentY + scoreCircleRadius + 20;
  
  // 円形プログレスバー（背景）
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.beginPath();
  ctx.arc(scoreCircleX, scoreCircleY, scoreCircleRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 10;
  ctx.stroke();
  
  // 円形プログレスバー（スコア）
  const scorePercentage = Math.min(data.score, 100);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (scorePercentage / 100) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(scoreCircleX, scoreCircleY, scoreCircleRadius, startAngle, endAngle);
  ctx.strokeStyle = "#e2bef1";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
  
  // スコアテキスト
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `400 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // テキストシャドウ
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.fillText(data.score.toString(), scoreCircleX, scoreCircleY);
  ctx.restore();
  
  // pts テキスト
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `400 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  // テキストシャドウ
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.fillText("pts", scoreCircleX, scoreCircleY + 25);
  ctx.restore();
  
  // ランク画像（中央に配置）
  const rankImageY = scoreCircleY + scoreCircleRadius + 30;
  const rankImageSize = 200;
  const rankImageX = contentX + (contentWidth - rankImageSize) / 2;
  
  // ランク画像を描画
  try {
    const rankImagePath = getRankImagePath(data.rankInfo.rank);
    const rankImage = await loadImage(rankImagePath);
    
    const imageDrawX = rankImageX * SCALE;
    const imageDrawY = rankImageY * SCALE;
    const imageDrawSize = rankImageSize * SCALE;
    
    // 正方形にクロップして描画
    ctx.save();
    ctx.beginPath();
    ctx.rect(imageDrawX, imageDrawY, imageDrawSize, imageDrawSize);
    ctx.clip();
    
    // 画像を正方形にクロップ（最新UIと同じ方法）
    drawImageSquareCrop(
      ctx,
      rankImage,
      imageDrawX,
      imageDrawY,
      imageDrawSize
    );
    
    ctx.restore();
  } catch (error) {
    console.warn("Failed to load rank image:", error);
  }
  
  // ランク情報セクション（画像の下）
  const rankSectionY = rankImageY + rankImageSize + 20;
  const rankBoxWidth = contentWidth;
  const rankBoxHeight = 100;
  const rankBoxX = contentX;
  const rankBoxY = rankSectionY;
  
  // ランク情報ボックス（白背景）
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(ctx, rankBoxX, rankBoxY, rankBoxWidth, rankBoxHeight, 16, 1);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // ランク表示（大きく中央に）
  const rankFontSize = 64;
  ctx.font = `900 ${rankFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(data.rankInfo.rank, rankBoxX + rankBoxWidth / 2, rankBoxY + 10);
  
  // ランク帯名（ランクの下、中央に）
  const rankBandName = getRankBandName(data.rankInfo.bandName);
  const bandNameFontSize = 18;
  const bandNameY = rankBoxY + 10 + rankFontSize + 4;
  ctx.font = `600 ${bandNameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.fillText(rankBandName, rankBoxX + rankBoxWidth / 2, bandNameY);
  
  // パーセンタイル表示（ランク帯名の下、中央に）
  const percentileFontSize = 14;
  const percentileY = bandNameY + bandNameFontSize + 4;
  ctx.font = `600 ${percentileFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.fillText(data.percentileDisplay, rankBoxX + rankBoxWidth / 2, percentileY);
  
  ctx.restore();
  
  // メッセージ表示（ランク情報の下）
  if (data.message) {
    const messageY = rankBoxY + rankBoxHeight + 20;
    ctx.save();
    ctx.scale(SCALE, SCALE);
    ctx.font = `400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // テキストシャドウ
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    // テキストを折り返して表示
    const maxWidth = contentWidth - 40;
    const words = data.message.split("");
    let line = "";
    let lineY = messageY;
    const lineHeight = 28;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, contentX + contentWidth / 2, lineY);
        line = words[i];
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      ctx.fillText(line, contentX + contentWidth / 2, lineY);
    }
    ctx.restore();
  }
  
  
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
 * 画像をダウンロード（PC・スマホ対応）
 */
export function downloadImage(blob: Blob, filename: string): void {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // モバイルの場合：新しいタブで画像を開く（長押しで保存可能）
    const url = URL.createObjectURL(blob);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                margin: 0;
                padding: 20px;
                background: #000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
              p {
                color: white;
                text-align: center;
                margin-top: 20px;
                font-size: 16px;
                line-height: 1.5;
              }
              .instruction {
                color: #ccc;
                font-size: 14px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div>
              <img src="${url}" alt="${filename}" />
              <p>画像を長押しして保存してください</p>
              <p class="instruction">（iOS: 長押し → 画像を保存）</p>
              <p class="instruction">（Android: 長押し → 画像をダウンロード）</p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
      // 5秒後にURLを解放
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
      // ポップアップブロックされた場合、フォールバック
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }
  } else {
    // PCの場合：通常のダウンロード
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    link.setAttribute("download", filename); // 明示的にdownload属性を設定
    
    // DOMに追加してからクリック
    document.body.appendChild(link);
    
    // クリックイベントを確実に発火させる
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    link.dispatchEvent(clickEvent);
    
    // 少し待ってからクリーンアップ
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 200);
  }
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
  
  // モバイルでWeb Share APIが利用可能な場合
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
      // ユーザーがキャンセルした場合は何もしない
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      // その他のエラーの場合はダウンロードにフォールバック
      console.log("Web Share API failed, falling back to download", error);
    }
  }
  
  // Web Share APIが使えない、または失敗した場合はダウンロード
  downloadImage(blob, filename);
}
