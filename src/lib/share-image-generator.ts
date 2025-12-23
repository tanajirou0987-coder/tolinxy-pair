/**
 * 共有画像生成機能
 * フロントエンドのみで完結、非表示canvasを使用して画像を生成
 * Instagramストーリー用比率（1080 × 1920、9:16）を厳守
 * 
 * コンセプト：「トレーディングカードスタイル」
 * - Figmaのトレーディングカードデザインを参考
 * - カラフルで装飾的なデザイン
 * - 大胆なタイポグラフィと視覚的な魅力
 */

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
const CARD_BG_COLOR = "#564EB3";

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
  // レイヤー1: カード背景（Figmaの指定通り）
  // ==========================================
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, CARD_BORDER_RADIUS, 1);
  ctx.fillStyle = CARD_BG_COLOR;
  ctx.fill();
  ctx.restore();
  
  // 装飾的な背景パターン（Figmaスタイル）
  ctx.save();
  ctx.globalAlpha = 0.4;
  
  // 上部に花のような装飾（大きな円）
  const flowerSize = 344;
  const flowerX = CANVAS_WIDTH / 2;
  const flowerY = -158;
  drawCircle(ctx, flowerX, flowerY, flowerSize / 2, SCALE, "#746ae1", "transparent", 0);
  
  // 左下にプラネットのような装飾
  const planetSize = 224;
  const planetX = 33;
  const planetY = CANVAS_HEIGHT - 201;
  drawCircle(ctx, planetX, planetY, planetSize / 2, SCALE, "#746ae1", "transparent", 0);
  
  // 右下にハートのような装飾（大きな円）
  const heartSize = 416;
  const heartX = CANVAS_WIDTH;
  const heartY = CANVAS_HEIGHT + 100;
  drawCircle(ctx, heartX, heartY, heartSize / 2, SCALE, "#746ae1", "transparent", 0);
  
  ctx.restore();
  
  // ==========================================
  // レイヤー2: カード内のコンテンツ（flex-direction: column, align-items: flex-end）
  // ==========================================
  // コンテンツエリア（padding内側）
  const contentX = CARD_PADDING_LEFT;
  const contentY = CARD_PADDING_TOP;
  const contentWidth = CANVAS_WIDTH - CARD_PADDING_LEFT - CARD_PADDING_RIGHT;
  
  // 画像エリア（400×400px、右寄せ）
  const imageX = contentX + contentWidth - IMAGE_SIZE; // 右寄せ
  const imageY = contentY;
  
  // 画像フレームの影（外側）
  const frameShadowOffset = 26;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(
    ctx,
    imageX - frameShadowOffset,
    imageY - frameShadowOffset,
    IMAGE_SIZE + frameShadowOffset * 2,
    IMAGE_SIZE + frameShadowOffset * 2,
    24,
    1
  );
  ctx.fillStyle = "#ff84c5";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // 画像フレーム（内側）
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(ctx, imageX, imageY, IMAGE_SIZE, IMAGE_SIZE, 24, 1);
  ctx.fillStyle = "#ffa5d4";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // 画像背景（黄色、フレーム内）
  const imagePadding = 24;
  const imageBgX = imageX + imagePadding;
  const imageBgY = imageY + imagePadding;
  const imageBgSize = IMAGE_SIZE - imagePadding * 2;
  
  ctx.save();
  ctx.scale(SCALE, SCALE);
  drawRoundedRect(ctx, imageBgX, imageBgY, imageBgSize, imageBgSize, 16, 1); // 角丸16px
  ctx.fillStyle = "#f1dd02";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // キャラクター画像を描画（正方形にクロップ、角丸付き）
  try {
    const characterImagePath = getRankCharacterImagePath(data.rankInfo.rank);
    const characterImage = await loadImage(characterImagePath);
    
    const imageDrawX = imageBgX * SCALE;
    const imageDrawY = imageBgY * SCALE;
    const imageDrawSize = imageBgSize * SCALE;
    const imageRadius = 16 * SCALE; // 角丸16px
    
    // 角丸のクリッピングパスを作成
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(imageDrawX + imageRadius, imageDrawY);
    ctx.lineTo(imageDrawX + imageDrawSize - imageRadius, imageDrawY);
    ctx.quadraticCurveTo(imageDrawX + imageDrawSize, imageDrawY, imageDrawX + imageDrawSize, imageDrawY + imageRadius);
    ctx.lineTo(imageDrawX + imageDrawSize, imageDrawY + imageDrawSize - imageRadius);
    ctx.quadraticCurveTo(imageDrawX + imageDrawSize, imageDrawY + imageDrawSize, imageDrawX + imageDrawSize - imageRadius, imageDrawY + imageDrawSize);
    ctx.lineTo(imageDrawX + imageRadius, imageDrawY + imageDrawSize);
    ctx.quadraticCurveTo(imageDrawX, imageDrawY + imageDrawSize, imageDrawX, imageDrawY + imageDrawSize - imageRadius);
    ctx.lineTo(imageDrawX, imageDrawY + imageRadius);
    ctx.quadraticCurveTo(imageDrawX, imageDrawY, imageDrawX + imageRadius, imageDrawY);
    ctx.closePath();
    ctx.clip();
    
    // 画像を正方形にクロップして描画
    drawImageSquareCrop(
      ctx,
      characterImage,
      imageDrawX,
      imageDrawY,
      imageDrawSize
    );
    
    ctx.restore();
  } catch (error) {
    console.warn("Failed to load character image:", error);
  }
  
  // 上部の名前（カードの外側、左側、中央寄せに調整）
  const topNameX = imageX - 80; // 左に少し移動
  const topNameY = imageY - 48.5;
  const topNameFontSize = 64;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `400 ${topNameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(data.userNickname.toUpperCase(), topNameX, topNameY);
  ctx.restore();
  
  // 下部の名前（画像フレームの下、左側、中央寄せに調整）
  const bottomNameX = imageX - 80; // 左に少し移動
  const bottomNameY = imageY + IMAGE_SIZE + 0.5;
  const bottomNameFontSize = 64;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.font = `400 ${bottomNameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(data.partnerNickname.toUpperCase(), bottomNameX, bottomNameY);
  ctx.restore();
  
  // 星のアイコン（右上）- SVG画像を使用
  try {
    const sparkleFilledImg = await loadImage("/sparkle-filled.svg");
    const starRightX = imageX + IMAGE_SIZE + 64;
    const starRightY = imageY + 28;
    const starRightSize = 64;
    drawImage(ctx, sparkleFilledImg, starRightX * SCALE, starRightY * SCALE, starRightSize * SCALE, starRightSize * SCALE);
  } catch (error) {
    console.warn("Failed to load sparkle-filled icon:", error);
  }
  
  // 星のアイコン（左下）- SVG画像を使用
  try {
    const sparkleFilledImg = await loadImage("/sparkle-filled.svg");
    const starLeftX = imageX - 53;
    const starLeftY = imageY + IMAGE_SIZE - 13.23 - 88;
    const starLeftSize = 88;
    drawImage(ctx, sparkleFilledImg, starLeftX * SCALE, starLeftY * SCALE, starLeftSize * SCALE, starLeftSize * SCALE);
  } catch (error) {
    console.warn("Failed to load sparkle-filled icon:", error);
  }
  
  // 下部セクション（gap: 24px）
  let currentY = imageY + IMAGE_SIZE + CARD_GAP;
  
  // 下部セクション（BIOとFun factスタイル、Figma: gap-[64px] h-[225px]）
  const bottomSectionY = currentY;
  const bottomSectionHeight = 225;
  const bottomSectionGap = 64;
  
  // 左右均等に配置（中央寄せ）
  const bottomSectionTotalWidth = contentWidth;
  const bioSectionWidth = (bottomSectionTotalWidth - bottomSectionGap) / 2;
  
  // 左側: BIOセクション
  const bioSectionX = contentX;
  const bioSectionY = bottomSectionY;
  
  // BIOボックス（先に描画、後ろに配置）
  const bioBoxX = bioSectionX + 16;
  const bioBoxY = bioSectionY + 16;
  const bioBoxWidth = bioSectionWidth - 16;
  const bioBoxHeight = bottomSectionHeight - 16;
  
  ctx.save();
  ctx.scale(SCALE, SCALE);
  
  ctx.beginPath();
  ctx.moveTo(bioBoxX + 16, bioBoxY);
  ctx.lineTo(bioBoxX + bioBoxWidth - 16, bioBoxY);
  ctx.quadraticCurveTo(bioBoxX + bioBoxWidth, bioBoxY, bioBoxX + bioBoxWidth, bioBoxY + 16);
  ctx.lineTo(bioBoxX + bioBoxWidth, bioBoxY + bioBoxHeight - 16);
  ctx.quadraticCurveTo(bioBoxX + bioBoxWidth, bioBoxY + bioBoxHeight, bioBoxX + bioBoxWidth - 16, bioBoxY + bioBoxHeight);
  ctx.lineTo(bioBoxX + 16, bioBoxY + bioBoxHeight);
  ctx.quadraticCurveTo(bioBoxX, bioBoxY + bioBoxHeight, bioBoxX, bioBoxY + bioBoxHeight - 16);
  ctx.lineTo(bioBoxX, bioBoxY + 16);
  ctx.quadraticCurveTo(bioBoxX, bioBoxY, bioBoxX + 16, bioBoxY);
  ctx.closePath();
  
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // BIOテキスト内容（名前、BIOタグの下に余白を追加）
  const bioText = `${data.userNickname} × ${data.partnerNickname}`;
  ctx.font = `600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const bioTextX = bioBoxX + 16;
  const bioTextY = bioBoxY + 80; // 64から80に変更してBIOタグとの間隔を広げる
  ctx.fillText(bioText, bioTextX, bioTextY);
  
  // ポイント（スコア）をBIOボックス内に追加
  const scoreText = `${data.score} pts`;
  ctx.font = `600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.fillText(scoreText, bioTextX, bioTextY + 24);
  
  ctx.restore();
  
  // BIOタイトル（黄色のタグ、3層、後から描画して前面に表示）
  const bioTitleWidth = 145;
  const bioTitleHeight = 66;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  
  // BIOタイトルの3層（後ろから順に描画）
  for (let i = 2; i >= 0; i--) {
    const offsetX = i === 0 ? 0 : i === 1 ? bioTitleWidth * 0.0483 : bioTitleWidth * 0.0966;
    const offsetY = i === 0 ? 0 : i === 1 ? bioTitleHeight * 0.0758 : bioTitleHeight * 0.1515;
    const width = bioTitleWidth * (1 - offsetX * 2 / bioTitleWidth);
    const height = bioTitleHeight * (1 - offsetY * 2 / bioTitleHeight);
    
    ctx.beginPath();
    ctx.moveTo(bioSectionX + offsetX + 24, bioSectionY + offsetY);
    ctx.lineTo(bioSectionX + offsetX + width - 24, bioSectionY + offsetY);
    ctx.quadraticCurveTo(bioSectionX + offsetX + width, bioSectionY + offsetY, bioSectionX + offsetX + width, bioSectionY + offsetY + 24);
    ctx.lineTo(bioSectionX + offsetX + width, bioSectionY + offsetY + height - 24);
    ctx.quadraticCurveTo(bioSectionX + offsetX + width, bioSectionY + offsetY + height, bioSectionX + offsetX + width - 24, bioSectionY + offsetY + height);
    ctx.lineTo(bioSectionX + offsetX + 24, bioSectionY + offsetY + height);
    ctx.quadraticCurveTo(bioSectionX + offsetX, bioSectionY + offsetY + height, bioSectionX + offsetX, bioSectionY + offsetY + height - 24);
    ctx.lineTo(bioSectionX + offsetX, bioSectionY + offsetY + 24);
    ctx.quadraticCurveTo(bioSectionX + offsetX, bioSectionY + offsetY, bioSectionX + offsetX + 24, bioSectionY + offsetY);
    ctx.closePath();
    
    ctx.fillStyle = "#f1dd02";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // BIOテキスト（最前面）- "result"に変更
  ctx.font = `400 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`; // フォントサイズを40から32に縮小
  ctx.fillStyle = "#564eb3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("result", bioSectionX + bioTitleWidth / 2, bioSectionY + bioTitleHeight / 2);
  
  ctx.restore();
  
  // 右側: Fun factセクション（左側の隣）
  const funFactSectionX = bioSectionX + bioSectionWidth + bottomSectionGap;
  const funFactSectionY = bottomSectionY;
  
  ctx.save();
  ctx.scale(SCALE, SCALE);
  
  // Fun factボックス
  const funFactBoxWidth = bioSectionWidth;
  const funFactBoxHeight = bottomSectionHeight;
  
  ctx.beginPath();
  ctx.moveTo(funFactSectionX + 16, funFactSectionY);
  ctx.lineTo(funFactSectionX + funFactBoxWidth - 16, funFactSectionY);
  ctx.quadraticCurveTo(funFactSectionX + funFactBoxWidth, funFactSectionY, funFactSectionX + funFactBoxWidth, funFactSectionY + 16);
  ctx.lineTo(funFactSectionX + funFactBoxWidth, funFactSectionY + funFactBoxHeight - 16);
  ctx.quadraticCurveTo(funFactSectionX + funFactBoxWidth, funFactSectionY + funFactBoxHeight, funFactSectionX + funFactBoxWidth - 16, funFactSectionY + funFactBoxHeight);
  ctx.lineTo(funFactSectionX + 16, funFactSectionY + funFactBoxHeight);
  ctx.quadraticCurveTo(funFactSectionX, funFactSectionY + funFactBoxHeight, funFactSectionX, funFactSectionY + funFactBoxHeight - 16);
  ctx.lineTo(funFactSectionX, funFactSectionY + 16);
  ctx.quadraticCurveTo(funFactSectionX, funFactSectionY, funFactSectionX + 16, funFactSectionY);
  ctx.closePath();
  
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Fun factタイトル（上部）
  ctx.font = `400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#564eb3";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Fun fact!", funFactSectionX + 16, funFactSectionY + 16);
  
  // ランク表示（上部、Fun factタイトルの下）
  const rankFontSize = 48;
  ctx.font = `900 ${rankFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.fillText(data.rankInfo.rank, funFactSectionX + 16, funFactSectionY + 40);
  
  // ランク帯名（ランクの下）
  const rankBandName = getRankBandName(data.rankInfo.bandName);
  const bandNameFontSize = 20;
  const bandNameY = funFactSectionY + 40 + rankFontSize + 8;
  ctx.font = `600 ${bandNameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.fillText(rankBandName, funFactSectionX + 16, bandNameY);
  
  // パーセンタイル表示（ランク帯名の下、中央に配置）
  const percentileFontSize = 16;
  const percentileY = bandNameY + bandNameFontSize + 20; // ランク帯名の下に余白を追加
  ctx.font = `600 ${percentileFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const percentileX = funFactSectionX + funFactBoxWidth / 2;
  ctx.fillText(data.percentileDisplay, percentileX, percentileY);
  
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
