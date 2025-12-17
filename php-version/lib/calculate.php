<?php
/**
 * 診断ロジック（PHP版）
 * Next.js版のcalculate.tsを移植
 */

require_once __DIR__ . '/../data/types.php';
require_once __DIR__ . '/../data/compatibility.php';

/**
 * 回答配列から3軸のスコアを計算
 */
function calculateScores($answers, $totalQuestions = 54) {
    $axis1 = 0; // communication
    $axis2 = 0; // decision
    $axis3 = 0; // relationship
    
    if ($totalQuestions === 54) {
        // Q1-Q18: communication軸
        foreach ($answers as $answer) {
            if ($answer['question_id'] >= 1 && $answer['question_id'] <= 18) {
                $axis1 += intval($answer['answer_value']);
            }
            // Q19-Q36: decision軸
            elseif ($answer['question_id'] >= 19 && $answer['question_id'] <= 36) {
                $axis2 += intval($answer['answer_value']);
            }
            // Q37-Q54: relationship軸
            elseif ($answer['question_id'] >= 37 && $answer['question_id'] <= 54) {
                $axis3 += intval($answer['answer_value']);
            }
        }
    } else {
        // 18問の場合（将来の拡張用）
        foreach ($answers as $answer) {
            if ($answer['question_id'] >= 1 && $answer['question_id'] <= 6) {
                $axis1 += intval($answer['answer_value']);
            } elseif ($answer['question_id'] >= 7 && $answer['question_id'] <= 12) {
                $axis2 += intval($answer['answer_value']);
            } elseif ($answer['question_id'] >= 13 && $answer['question_id'] <= 18) {
                $axis3 += intval($answer['answer_value']);
            }
        }
    }
    
    return [
        'axis1' => $axis1,
        'axis2' => $axis2,
        'axis3' => $axis3
    ];
}

/**
 * スコアから特性を判定
 */
function determineTraitsFromScores($axis1, $axis2, $axis3, $totalQuestions = 54) {
    $threshold = $totalQuestions === 54 ? 9 : 3;
    
    $communication = $axis1 > $threshold ? '積極型' : ($axis1 < -$threshold ? '受容型' : 'バランス型');
    $decision = $axis2 > $threshold ? '論理型' : ($axis2 < -$threshold ? '感情型' : 'ハイブリッド型');
    $relationship = $axis3 > $threshold ? 'リード型' : ($axis3 < -$threshold ? '寄り添い型' : '対等型');
    
    return [
        'communication' => $communication,
        'decision' => $decision,
        'relationship' => $relationship
    ];
}

/**
 * 特性からタイプコードを生成
 */
function generateTypeCodeFromTraits($traits) {
    return $traits['communication'] . '_' . $traits['decision'] . '_' . $traits['relationship'];
}

/**
 * スコアからパーソナリティタイプを取得
 */
function getPersonalityType($axis1, $axis2, $axis3, $diagnosisType = '54') {
    $totalQuestions = $diagnosisType === '54' ? 54 : 18;
    $traits = determineTraitsFromScores($axis1, $axis2, $axis3, $totalQuestions);
    $typeCode = generateTypeCodeFromTraits($traits);
    
    // タイプデータから取得
    $typesData = getTypesData($diagnosisType);
    if (isset($typesData[$typeCode])) {
        return $typesData[$typeCode];
    }
    
    // フォールバック
    return [
        'type' => $typeCode,
        'name' => $traits['communication'] . '×' . $traits['decision'] . '×' . $traits['relationship'],
        'icon' => '🎵',
        'description' => 'あなたのパーソナリティタイプです',
        'traits' => $traits
    ];
}

/**
 * コミュニケーション軸の相性スコアを計算（補完性重視）
 */
function calculateCommunicationCompatibility($trait1, $trait2) {
    $pairs = [
        '積極型_受容型' => 100,
        '受容型_積極型' => 100,
        '積極型_バランス型' => 70,
        'バランス型_積極型' => 70,
        '受容型_バランス型' => 70,
        'バランス型_受容型' => 70,
        '積極型_積極型' => 50,
        '受容型_受容型' => 50,
        'バランス型_バランス型' => 80,
    ];
    
    $key = $trait1 . '_' . $trait2;
    return isset($pairs[$key]) ? $pairs[$key] : 50;
}

/**
 * 意思決定軸の相性スコアを計算（類似性重視）
 */
function calculateDecisionCompatibility($trait1, $trait2) {
    // 類似性重視：同じタイプ同士が良い
    if ($trait1 === $trait2) {
        return 100;
    }
    
    // ハイブリッド型は両方と相性が良い
    if ($trait1 === 'ハイブリッド型' || $trait2 === 'ハイブリッド型') {
        return 80;
    }
    
    // 論理型と感情型は相性が悪い
    if (($trait1 === '論理型' && $trait2 === '感情型') || 
        ($trait1 === '感情型' && $trait2 === '論理型')) {
        return 40;
    }
    
    return 60;
}

/**
 * 関係性軸の相性スコアを計算（補完性重視）
 */
function calculateRelationshipCompatibility($trait1, $trait2) {
    $pairs = [
        'リード型_寄り添い型' => 100,
        '寄り添い型_リード型' => 100,
        'リード型_対等型' => 70,
        '対等型_リード型' => 70,
        '寄り添い型_対等型' => 70,
        '対等型_寄り添い型' => 70,
        'リード型_リード型' => 50,
        '寄り添い型_寄り添い型' => 50,
        '対等型_対等型' => 80,
    ];
    
    $key = $trait1 . '_' . $trait2;
    return isset($pairs[$key]) ? $pairs[$key] : 50;
}

/**
 * 総合相性スコアを計算（27タイプ対応）
 * 要件: 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
 * 軸1・3: 補完性重視、軸2: 類似性重視
 */
function calculateCompatibilityScore($type1, $type2) {
    $axis1Score = calculateCommunicationCompatibility(
        $type1['traits']['communication'],
        $type2['traits']['communication']
    );
    
    $axis2Score = calculateDecisionCompatibility(
        $type1['traits']['decision'],
        $type2['traits']['decision']
    );
    
    $axis3Score = calculateRelationshipCompatibility(
        $type1['traits']['relationship'],
        $type2['traits']['relationship']
    );
    
    // 総合スコア = 0.3 × 軸1 + 0.4 × 軸2 + 0.3 × 軸3
    $rawScore = $axis1Score * 0.3 + $axis2Score * 0.4 + $axis3Score * 0.3;
    
    // 1%〜100%に正規化（元の範囲: 46〜100）
    $minRawScore = 46; // 最低スコア
    $maxRawScore = 100; // 最高スコア
    $rawRange = $maxRawScore - $minRawScore; // 54
    
    // 正規化: ((score - min) / range) × 99 + 1
    $normalizedScore = round((($rawScore - $minRawScore) / $rawRange) * 99 + 1);
    
    // 1〜100の範囲に制限
    return max(1, min(100, $normalizedScore));
}

/**
 * スコアから上位何%かを計算（729通りの組み合わせから）
 */
function calculatePercentileRank($score) {
    $distribution = [
        '91-100' => 12,  // 1.65%
        '81-90' => 76,   // 10.43%
        '71-80' => 67,   // 9.19%
        '61-70' => 128,  // 17.56%
        '51-60' => 184,  // 25.24%
        '41-50' => 100,  // 13.72%
        '31-40' => 34,   // 4.66%
        '21-30' => 80,   // 10.97%
        '11-20' => 40,   // 5.49%
        '1-10' => 8,     // 1.10%
    ];
    
    $total = 729;
    $countAbove = 0;
    
    if ($score >= 91) {
        $countAbove = 0;
    } elseif ($score >= 81) {
        $countAbove = $distribution['91-100'];
    } elseif ($score >= 71) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'];
    } elseif ($score >= 61) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'];
    } elseif ($score >= 51) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'];
    } elseif ($score >= 41) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'] + $distribution['51-60'];
    } elseif ($score >= 31) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'] + $distribution['51-60'] + $distribution['41-50'];
    } elseif ($score >= 21) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'] + $distribution['51-60'] + $distribution['41-50'] + $distribution['31-40'];
    } elseif ($score >= 11) {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'] + $distribution['51-60'] + $distribution['41-50'] + $distribution['31-40'] + $distribution['21-30'];
    } else {
        $countAbove = $distribution['91-100'] + $distribution['81-90'] + $distribution['71-80'] + $distribution['61-70'] + $distribution['51-60'] + $distribution['41-50'] + $distribution['31-40'] + $distribution['21-30'] + $distribution['11-20'];
    }
    
    // 上位%を計算
    $percentile = ($countAbove / $total) * 100;
    
    // 小数点以下を四捨五入して整数で返す
    return round($percentile);
}

/**
 * パーセンタイルからランクを決定
 */
function getCompatibilityRank($percentile) {
    if ($percentile <= 1) {
        return ['rank' => 'SS', 'rankName' => 'ベストリア', 'tier' => 'SSランク'];
    }
    if ($percentile <= 10) {
        return ['rank' => 'S', 'rankName' => 'リンクス', 'tier' => 'Sランク'];
    }
    if ($percentile <= 20) {
        return ['rank' => 'A', 'rankName' => 'グットン', 'tier' => 'Aランク'];
    }
    if ($percentile <= 30) {
        return ['rank' => 'B', 'rankName' => 'ライトム', 'tier' => 'Bランク'];
    }
    if ($percentile <= 40) {
        return ['rank' => 'C', 'rankName' => 'フリカ', 'tier' => 'Cランク'];
    }
    if ($percentile <= 50) {
        return ['rank' => 'D', 'rankName' => 'ラフネ', 'tier' => 'Dランク'];
    }
    if ($percentile <= 70) {
        return ['rank' => 'E', 'rankName' => 'ミスタル', 'tier' => 'Eランク'];
    }
    if ($percentile <= 85) {
        return ['rank' => 'F', 'rankName' => 'バグシー', 'tier' => 'Fランク'];
    }
    return ['rank' => 'G', 'rankName' => 'ゼロナ', 'tier' => 'Gランク'];
}

/**
 * ランクに応じた画像パスを返す
 */
function getRankImagePath($rank) {
    $rankImages = [
        'SS' => '/rank-images/bestria.jpg',
        'S' => '/rank-images/lynx.jpg',
        'A' => '/rank-images/goodton.jpg',
        'B' => '/rank-images/lightm.jpg',
        'C' => '/rank-images/frica.jpg',
        'D' => '/rank-images/rafne.jpg',
        'E' => '/rank-images/mistal.jpg',
        'F' => '/rank-images/buggy.jpg',
        'G' => '/rank-images/zerona.jpg',
    ];
    return isset($rankImages[$rank]) ? $rankImages[$rank] : $rankImages['G'];
}

/**
 * 上位%からメッセージを生成
 */
function generatePercentileMessage($percentile) {
    if ($percentile <= 1) return '上位1%に入るほどの';
    if ($percentile <= 3) return '上位3%に入るほどの';
    if ($percentile <= 5) return '上位5%に入るほどの';
    if ($percentile <= 10) return '上位10%に入るほどの';
    if ($percentile <= 20) return '上位20%に入るほどの';
    if ($percentile <= 30) return '上位30%に入るほどの';
    if ($percentile <= 50) return '上位50%に入るほどの';
    return "上位{$percentile}%の";
}

/**
 * 相性メッセージを生成
 */
function generateCompatibilityMessage($score) {
    if ($score >= 90) return '最高の相性！完璧な組み合わせ';
    if ($score >= 80) return 'とても良い相性！理想的な関係';
    if ($score >= 70) return '良い相性！互いを理解し合える';
    if ($score >= 60) return '普通の相性。お互いを尊重し合えば良い関係に';
    if ($score >= 50) return 'やや相性に課題あり。コミュニケーションが大切';
    return '相性に課題あり。お互いの違いを理解することが重要';
}

/**
 * 相性メッセージと上位%を含めたメッセージを生成
 */
function generateCompatibilityMessageWithPercentile($score) {
    $percentile = calculatePercentileRank($score);
    $roundedPercentile = round($percentile);
    $displayPercentile = $roundedPercentile;
    $percentileText = generatePercentileMessage($displayPercentile);
    $baseMessage = generateCompatibilityMessage($score);
    
    return [
        'message' => "{$percentileText}相性の良さ。{$baseMessage}",
        'percentile' => $displayPercentile,
        'percentileText' => "上位{$displayPercentile}%",
    ];
}

/**
 * 相性スコアを計算（互換性のため残す）
 */
function calculateCompatibility($userType, $partnerType) {
    // $userTypeと$partnerTypeが配列か文字列かを判定
    $userTypeArray = is_array($userType) ? $userType : null;
    $partnerTypeArray = is_array($partnerType) ? $partnerType : null;
    
    // 配列でない場合は、タイプコードからタイプ情報を取得
    if (!$userTypeArray) {
        $typesData = getTypesData('54');
        $userTypeArray = isset($typesData[$userType]) ? $typesData[$userType] : null;
    }
    if (!$partnerTypeArray) {
        $typesData = getTypesData('54');
        $partnerTypeArray = isset($typesData[$partnerType]) ? $typesData[$partnerType] : null;
    }
    
    // タイプ情報が取得できない場合はデフォルト値を返す
    if (!$userTypeArray || !$partnerTypeArray) {
        return [
            'total' => 50,
            'message' => '普通の相性',
            'detail' => 'お互いを尊重し合えば良い関係に',
            'percentile' => 50,
            'percentileText' => '上位50%',
        ];
    }
    
    // 新しい動的計算を使用
    $score = calculateCompatibilityScore($userTypeArray, $partnerTypeArray);
    $percentileInfo = generateCompatibilityMessageWithPercentile($score);
    
    // 互換性のため、古い形式も返す
    $compatibilityData = getCompatibilityData();
    $key = $userTypeArray['type'] . '_' . $partnerTypeArray['type'];
    $reverseKey = $partnerTypeArray['type'] . '_' . $userTypeArray['type'];
    
    $message = $percentileInfo['message'];
    $detail = '';
    
    if (isset($compatibilityData[$key])) {
        $detail = $compatibilityData[$key]['detail'] ?? '';
    } elseif (isset($compatibilityData[$reverseKey])) {
        $detail = $compatibilityData[$reverseKey]['detail'] ?? '';
    }
    
    return [
        'total' => $score,
        'message' => $message,
        'detail' => $detail,
        'percentile' => $percentileInfo['percentile'],
        'percentileText' => $percentileInfo['percentileText'],
    ];
}

