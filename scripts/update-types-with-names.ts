/**
 * 27タイプに名前を当てはめるスクリプト
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// 27タイプの名前データ
const typeNames: Record<string, {
  typeName: string;
  icon: string;
  catch: string;
  oneLiner: string;
}> = {
  "AAA": {
    "typeName": "ブレインマエストロ",
    "icon": "🎹",
    "catch": "突き進む知性派",
    "oneLiner": "論理と思考力でみんなを引っ張る司令塔"
  },
  "AAB": {
    "typeName": "バランスコンダクター",
    "icon": "🎼",
    "catch": "調整力のリーダー",
    "oneLiner": "行動力に論理と協調性をプラスした万能型"
  },
  "AAC": {
    "typeName": "エナジーコンパニオン",
    "icon": "🎸",
    "catch": "熱血の共感ファイター",
    "oneLiner": "積極共感型リーダーでみんなを乗せるムードメーカー"
  },
  "ABA": {
    "typeName": "スマートイニシエーター",
    "icon": "🥁",
    "catch": "高速実行派",
    "oneLiner": "柔軟な思考と論理で効率的にまとめるタイプ"
  },
  "ABB": {
    "typeName": "クリエイティブシェアラー",
    "icon": "🎺",
    "catch": "発想共有名人",
    "oneLiner": "新しいことが大好きでみんなと分かち合うHUB"
  },
  "ABC": {
    "typeName": "ファンラボサポーター",
    "icon": "🎷",
    "catch": "居心地の魔術師",
    "oneLiner": "空気を読みながら楽しさをサポートする名脇役"
  },
  "ACA": {
    "typeName": "スパークアイデアラー",
    "icon": "🪕",
    "catch": "熱中発想型",
    "oneLiner": "感情に素直な行動力でみんなに元気を届ける"
  },
  "ACB": {
    "typeName": "ダイナミックシンパサイザー",
    "icon": "🎶",
    "catch": "感情を伝える共振型",
    "oneLiner": "周囲を明るく包み込む共感リーダー"
  },
  "ACC": {
    "typeName": "ラブリードメーカー",
    "icon": "🎤",
    "catch": "愛されリーダー",
    "oneLiner": "共感力×行動力=愛されて頼られるトップ"
  },
  "BAA": {
    "typeName": "センターアナリスト",
    "icon": "🎧",
    "catch": "仲間想いの知性派",
    "oneLiner": "論理と中立でみんなの真ん中に立つまとめ役"
  },
  "BAB": {
    "typeName": "バランスアドバイザー",
    "icon": "🎻",
    "catch": "万能カウンセラー",
    "oneLiner": "何でも相談できる冷静かつ柔軟な橋渡し役"
  },
  "BAC": {
    "typeName": "メディエータースター",
    "icon": "🪈",
    "catch": "共感＋理性の調停者",
    "oneLiner": "衝突を防ぎ、思いやりの視点でまとめるタイプ"
  },
  "BBA": {
    "typeName": "フローコオペレーター",
    "icon": "🪄",
    "catch": "気配り推進派",
    "oneLiner": "その場の空気や流れをコントロールする達人"
  },
  "BBB": {
    "typeName": "ユニゾンアーティスト",
    "icon": "☁️",
    "catch": "心地よい調和の達人",
    "oneLiner": "全員が心地よいミディアムテンポのバランサー"
  },
  "BBC": {
    "typeName": "ケアリングハーモナイザー",
    "icon": "🎺",
    "catch": "平和ファシリテーター",
    "oneLiner": "誰にも優しく調和を保つぶれない「場の主」"
  },
  "BCA": {
    "typeName": "グルーヴィーアクティベーター",
    "icon": "🎻",
    "catch": "気分屋の起爆剤",
    "oneLiner": "感情の起伏も楽しんでエネルギーに変える人"
  },
  "BCB": {
    "typeName": "ジェントルインスパイア",
    "icon": "🔔",
    "catch": "柔軟発想サポーター",
    "oneLiner": "ちょうどいい距離感と発想で場を活気づける"
  },
  "BCC": {
    "typeName": "コンフォーターチューナー",
    "icon": "🎤",
    "catch": "癒しの調整役",
    "oneLiner": "みんなの心のチューニングを行うヒーラー"
  },
  "CAA": {
    "typeName": "シンキングサポーター",
    "icon": "🧠",
    "catch": "じっくり論理協力型",
    "oneLiner": "冷静分析で縁の下を支える思慮深い味方"
  },
  "CAB": {
    "typeName": "ネゴシエーターマスター",
    "icon": "📯",
    "catch": "控えめな調整屋",
    "oneLiner": "必要なときに意見を伝える縁の下役"
  },
  "CAC": {
    "typeName": "ドリームカームメーカー",
    "icon": "🎻",
    "catch": "穏やか癒しリーダー",
    "oneLiner": "共感と控えめリーダーシップの静かな魅力"
  },
  "CBA": {
    "typeName": "シンパシーバランスター",
    "icon": "🎵",
    "catch": "慎重な調整役",
    "oneLiner": "内向的だがお互いの思いを人一倍汲んで合わせる"
  },
  "CBB": {
    "typeName": "ピュアハートパートナー",
    "icon": "🌿",
    "catch": "無垢な優しさの象徴",
    "oneLiner": "誰にでも公平で純粋なサポーター"
  },
  "CBC": {
    "typeName": "ホスピタリティガイド",
    "icon": "🌙",
    "catch": "癒し専門案内人",
    "oneLiner": "気配り上手な完全裏方型"
  },
  "CCA": {
    "typeName": "シャイリードメーカー",
    "icon": "🥁",
    "catch": "控えめ新星リーダー",
    "oneLiner": "はにかみながらも要所でリードする"
  },
  "CCB": {
    "typeName": "ミスティックサポーター",
    "icon": "🌌",
    "catch": "不思議包容力",
    "oneLiner": "理解不能なほどに懐が深い癒し系"
  },
  "CCC": {
    "typeName": "サイレントハーモナイザー",
    "icon": "🛏️",
    "catch": "究極の静寂ナビゲーター",
    "oneLiner": "無口だが根底で全体を支える超安定型"
  }
};

// タイプコードのマッピング
// A = 積極型, B = バランス型, C = 受容型 (コミュニケーション)
// A = 論理型, B = ハイブリッド型, C = 感情型 (意思決定)
// A = リード型, B = 対等型, C = 寄り添い型 (関係性)
function convertTypeCode(code: string): string {
  const [comm, dec, rel] = code.split("");
  
  const commMap: Record<string, string> = {
    "A": "積極型",
    "B": "バランス型",
    "C": "受容型"
  };
  
  const decMap: Record<string, string> = {
    "A": "論理型",
    "B": "ハイブリッド型",
    "C": "感情型"
  };
  
  const relMap: Record<string, string> = {
    "A": "リード型",
    "B": "対等型",
    "C": "寄り添い型"
  };
  
  return `${commMap[comm]}_${decMap[dec]}_${relMap[rel]}`;
}

// 既存のtypes.jsonを読み込む
const types18Path = join(process.cwd(), "data/diagnoses/compatibility-18/types.json");
const types54Path = join(process.cwd(), "data/diagnoses/compatibility-54/types.json");

const types18 = JSON.parse(readFileSync(types18Path, "utf-8"));
const types54 = JSON.parse(readFileSync(types54Path, "utf-8"));

// 各タイプコードに名前を当てはめる
for (const [code, nameData] of Object.entries(typeNames)) {
  const typeCode = convertTypeCode(code);
  
  if (types18[typeCode]) {
    types18[typeCode] = {
      ...types18[typeCode],
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description: nameData.oneLiner,
      catch: nameData.catch,
    };
  } else {
    // 新規作成
    const [comm, dec, rel] = typeCode.split("_");
    types18[typeCode] = {
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description: nameData.oneLiner,
      catch: nameData.catch,
      traits: {
        communication: comm as "積極型" | "バランス型" | "受容型",
        decision: dec as "論理型" | "ハイブリッド型" | "感情型",
        relationship: rel as "リード型" | "対等型" | "寄り添い型",
      },
    };
  }
  
  // 54問用も同じデータで更新
  if (types54[typeCode]) {
    types54[typeCode] = {
      ...types54[typeCode],
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description: nameData.oneLiner,
      catch: nameData.catch,
    };
  } else {
    const [comm, dec, rel] = typeCode.split("_");
    types54[typeCode] = {
      type: typeCode,
      name: nameData.typeName,
      icon: nameData.icon,
      description: nameData.oneLiner,
      catch: nameData.catch,
      traits: {
        communication: comm as "積極型" | "バランス型" | "受容型",
        decision: dec as "論理型" | "ハイブリッド型" | "感情型",
        relationship: rel as "リード型" | "対等型" | "寄り添い型",
      },
    };
  }
}

// ファイルに保存
writeFileSync(types18Path, JSON.stringify(types18, null, 2), "utf-8");
writeFileSync(types54Path, JSON.stringify(types54, null, 2), "utf-8");

console.log(`✅ 27タイプの名前を更新しました`);
console.log(`   - ${types18Path}`);
console.log(`   - ${types54Path}`);
console.log(`   総タイプ数: ${Object.keys(types18).length}`);

