/**
 * キャラクター画像マッピング
 * 27タイプそれぞれに対応するキャラクター画像を管理
 */

import type { PersonalityTypeCode } from "./types";

/**
 * 全27タイプのタイプコード一覧
 */
export const ALL_27_TYPES: PersonalityTypeCode[] = [
  "積極型_論理型_リード型",
  "積極型_論理型_対等型",
  "積極型_論理型_寄り添い型",
  "積極型_ハイブリッド型_リード型",
  "積極型_ハイブリッド型_対等型",
  "積極型_ハイブリッド型_寄り添い型",
  "積極型_感情型_リード型",
  "積極型_感情型_対等型",
  "積極型_感情型_寄り添い型",
  "バランス型_論理型_リード型",
  "バランス型_論理型_対等型",
  "バランス型_論理型_寄り添い型",
  "バランス型_ハイブリッド型_リード型",
  "バランス型_ハイブリッド型_対等型",
  "バランス型_ハイブリッド型_寄り添い型",
  "バランス型_感情型_リード型",
  "バランス型_感情型_対等型",
  "バランス型_感情型_寄り添い型",
  "受容型_論理型_リード型",
  "受容型_論理型_対等型",
  "受容型_論理型_寄り添い型",
  "受容型_ハイブリッド型_リード型",
  "受容型_ハイブリッド型_対等型",
  "受容型_ハイブリッド型_寄り添い型",
  "受容型_感情型_リード型",
  "受容型_感情型_対等型",
  "受容型_感情型_寄り添い型",
];

/**
 * キャラクター画像パスを取得するオプション
 */
interface GetCharacterImagePathOptions {
  /** ランク（フォールバック用） */
  rank?: string;
  /** ユーザーのタイプコード */
  userTypeCode?: PersonalityTypeCode;
  /** パートナーのタイプコード */
  partnerTypeCode?: PersonalityTypeCode;
  /** タイプの組み合わせ画像を優先するか */
  preferTypePair?: boolean;
  /** 個別タイプ画像を優先するか */
  preferTypeIndividual?: boolean;
}

/**
 * キャラクター画像のパスを取得
 * 
 * 優先順位:
 * 1. タイプの組み合わせ画像（userTypeCode_partnerTypeCode.png）
 * 2. 個別タイプ画像（userTypeCode.png）
 * 3. ランク画像（フォールバック）
 * 
 * @param options オプション
 * @returns 画像パス
 */
export function getCharacterImagePath(options: GetCharacterImagePathOptions): string {
  const {
    rank = "G",
    userTypeCode,
    partnerTypeCode,
    preferTypePair = true,
    preferTypeIndividual = true,
  } = options;

  // 1. タイプの組み合わせ画像を優先
  if (preferTypePair && userTypeCode && partnerTypeCode) {
    const pairImagePath = `/character-images/${userTypeCode}_${partnerTypeCode}.png`;
    // 実際のファイル存在チェックはブラウザ側で行う
    return pairImagePath;
  }

  // 2. 個別タイプ画像を優先
  if (preferTypeIndividual && userTypeCode) {
    const typeImagePath = `/character-images/${userTypeCode}.png`;
    return typeImagePath;
  }

  // 3. ランク画像をフォールバック
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
 * 全27タイプの画像パス一覧を取得
 * @returns タイプコードと画像パスの配列
 */
export function getAllTypeImagePaths(): { typeCode: PersonalityTypeCode; imagePath: string }[] {
  return ALL_27_TYPES.map((typeCode) => ({
    typeCode,
    imagePath: `/character-images/${typeCode}.png`,
  }));
}

/**
 * 画像が存在するかチェック（クライアント側）
 * @param imagePath 画像パス
 * @returns Promise<boolean>
 */
export async function checkImageExists(imagePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}
