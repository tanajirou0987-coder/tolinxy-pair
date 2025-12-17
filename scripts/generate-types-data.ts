/**
 * 27タイプのデータを生成するスクリプト
 */

import { writeFileSync } from "fs";
import { join } from "path";

// 3軸の特性
const communicationTraits = ["積極型", "バランス型", "受容型"] as const;
const decisionTraits = ["論理型", "ハイブリッド型", "感情型"] as const;
const relationshipTraits = ["リード型", "対等型", "寄り添い型"] as const;

// タイプ名を生成
function generateTypeName(typeCode: string): string {
  const [comm, dec, rel] = typeCode.split("_");
  return `${comm}×${dec}×${rel}`;
}

// 説明文を生成
function generateDescription(typeCode: string): string {
  const [comm, dec, rel] = typeCode.split("_");
  
  let description = "";
  
  if (comm === "積極型") {
    description += "明るく積極的で、";
  } else if (comm === "受容型") {
    description += "穏やかで控えめ、";
  } else {
    description += "バランス感覚に優れ、";
  }

  if (dec === "論理型") {
    description += "論理的に判断し、";
  } else if (dec === "感情型") {
    description += "感情を大切にし、";
  } else {
    description += "柔軟に判断し、";
  }

  if (rel === "リード型") {
    description += "リーダーシップを発揮する";
  } else if (rel === "寄り添い型") {
    description += "相手に寄り添う";
  } else {
    description += "対等な関係を築く";
  }

  return description;
}

// アイコンを決定（簡易版）
function generateIcon(typeCode: string): string {
  // 特性の組み合わせからアイコンを決定
  const [comm, dec, rel] = typeCode.split("_");
  
  // 積極型 + 感情型 + リード型 → 🎹
  if (comm === "積極型" && dec === "感情型" && rel === "リード型") return "🎹";
  // 受容型 + 論理型 + 寄り添い型 → 🎻
  if (comm === "受容型" && dec === "論理型" && rel === "寄り添い型") return "🎻";
  // 積極型 + 論理型 + リード型 → 🥁
  if (comm === "積極型" && dec === "論理型" && rel === "リード型") return "🥁";
  // 積極型 + ハイブリッド型 + リード型 → 🎸
  if (comm === "積極型" && dec === "ハイブリッド型" && rel === "リード型") return "🎸";
  // 受容型 + 感情型 + 寄り添い型 → 🎺
  if (comm === "受容型" && dec === "感情型" && rel === "寄り添い型") return "🎺";
  // 受容型 + ハイブリッド型 + 寄り添い型 → 🎤
  if (comm === "受容型" && dec === "ハイブリッド型" && rel === "寄り添い型") return "🎤";
  // 積極型 + 論理型 + 対等型 → 🎷
  if (comm === "積極型" && dec === "論理型" && rel === "対等型") return "🎷";
  // 受容型 + 論理型 + 対等型 → 🎼
  if (comm === "受容型" && dec === "論理型" && rel === "対等型") return "🎼";
  
  // デフォルト
  return "🎵";
}

// 27タイプを生成
interface TypeData {
  type: string;
  name: string;
  icon: string;
  description: string;
  traits: {
    communication: string;
    decision: string;
    relationship: string;
  };
}

function generateAllTypes() {
  const types: Record<string, TypeData> = {};

  for (const comm of communicationTraits) {
    for (const dec of decisionTraits) {
      for (const rel of relationshipTraits) {
        const typeCode = `${comm}_${dec}_${rel}`;
        
        types[typeCode] = {
          type: typeCode,
          name: generateTypeName(typeCode),
          icon: generateIcon(typeCode),
          description: generateDescription(typeCode),
          traits: {
            communication: comm,
            decision: dec,
            relationship: rel,
          },
        };
      }
    }
  }

  return types;
}

// メイン処理
const typesData = generateAllTypes();
const outputPath = join(process.cwd(), "data/diagnoses/compatibility-18/types.json");

writeFileSync(outputPath, JSON.stringify(typesData, null, 2), "utf-8");

console.log(`✅ 27タイプのデータを生成しました: ${outputPath}`);
console.log(`   総タイプ数: ${Object.keys(typesData).length}`);



