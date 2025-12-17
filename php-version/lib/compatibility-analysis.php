<?php
/**
 * 詳細な相性分析機能（PHP版）
 * Next.js版のcompatibility-analysis.tsを移植
 */

require_once __DIR__ . '/calculate.php';

/**
 * 価値観一致度を計算
 */
function calculateValuesAlignment($type1, $type2) {
    $decisionMatch = $type1['traits']['decision'] === $type2['traits']['decision'];
    $relationshipMatch = $type1['traits']['relationship'] === $type2['traits']['relationship'];
    
    $score = 60; // ベーススコア
    
    if ($decisionMatch) $score += 25;
    if ($relationshipMatch) $score += 15;
    
    // ハイブリッド型を含む場合は柔軟性がある
    if ($type1['traits']['decision'] === 'ハイブリッド型' || $type2['traits']['decision'] === 'ハイブリッド型') {
        $score += 10;
    }
    
    $score = min(100, max(0, $score));
    
    $innerMotivation1 = $type1['innerMotivation'] ?? '';
    $innerMotivation2 = $type2['innerMotivation'] ?? '';
    
    if ($score >= 85) {
        $description = '2人の価値観は非常に近く、物事の判断基準が似ています。';
        if ($innerMotivation1 && $innerMotivation2) {
            $example = "{$type1['name']}は「{$innerMotivation1}」、{$type2['name']}は「{$innerMotivation2}」という価値観を持っています。この2つの価値観は自然と調和し、将来の計画や時間の使い方についても意見が一致することが多いでしょう。";
        } else {
            $example = '例えば、お互いが同じように時間の使い方を大切にしたり、将来の計画について自然と意見が一致することが多いでしょう。';
        }
    } elseif ($score >= 70) {
        $description = '基本的な価値観は共有できており、柔軟に調整し合えます。';
        if ($innerMotivation1 && $innerMotivation2) {
            $example = "{$type1['name']}は「{$innerMotivation1}」、{$type2['name']}は「{$innerMotivation2}」という価値観を持っています。異なる部分もありますが、お互いの判断を尊重し合える関係です。";
        } else {
            $example = '例えば、一方が論理的に考え、もう一方が感情を大切にする場合でも、お互いの判断を尊重し合える関係です。';
        }
    } else {
        $description = '価値観に違いはありますが、お互いを理解しようとする姿勢が大切です。';
        if ($innerMotivation1 && $innerMotivation2) {
            $example = "{$type1['name']}は「{$innerMotivation1}」、{$type2['name']}は「{$innerMotivation2}」という価値観を持っています。違いを理解し、お互いのスタイルを認め合うことが重要です。";
        } else {
            $example = '例えば、一方が計画を立てることを好み、もう一方が臨機応変を好む場合、お互いのスタイルを認め合うことが重要です。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * 感情表現の相性を計算
 */
function calculateEmotionalExpression($type1, $type2) {
    $decision1 = $type1['traits']['decision'];
    $decision2 = $type2['traits']['decision'];
    
    $score = 50;
    
    // 感情型同士は感情表現が豊か
    if ($decision1 === '感情型' && $decision2 === '感情型') {
        $score = 90;
    } elseif ($decision1 === '感情型' || $decision2 === '感情型') {
        // 一方が感情型、もう一方がハイブリッド型
        if ($decision1 === 'ハイブリッド型' || $decision2 === 'ハイブリッド型') {
            $score = 75;
        } else {
            // 感情型と論理型
            $score = 45;
        }
    } elseif ($decision1 === 'ハイブリッド型' && $decision2 === 'ハイブリッド型') {
        $score = 80;
    } elseif ($decision1 === '論理型' && $decision2 === '論理型') {
        $score = 70; // 論理型同士は感情表現は控えめだが理解し合える
    }
    
    $romanceTendency1 = $type1['romanceTendency'] ?? '';
    $romanceTendency2 = $type2['romanceTendency'] ?? '';
    
    if ($score >= 80) {
        $description = '2人とも感情を素直に表現でき、お互いの気持ちを理解し合えます。';
        if ($romanceTendency1 && $romanceTendency2) {
            $example = "{$type1['name']}は「{$romanceTendency1}」、{$type2['name']}は「{$romanceTendency2}」という恋愛傾向があります。2人とも感情を素直に表現できるため、嬉しい時は一緒に喜び、悲しい時は寄り添い合える関係です。";
        } else {
            $example = '例えば、嬉しい時は一緒に喜び、悲しい時は寄り添い合える関係です。感情の波を共有できるでしょう。';
        }
    } elseif ($score >= 60) {
        $description = '感情表現のスタイルに違いはありますが、お互いを理解しようと努められます。';
        if ($romanceTendency1 && $romanceTendency2) {
            $example = "{$type1['name']}は「{$romanceTendency1}」、{$type2['name']}は「{$romanceTendency2}」という恋愛傾向があります。表現方法は異なりますが、お互いの愛情は確実に伝わります。";
        } else {
            $example = '例えば、一方が感情を言葉で表現し、もう一方が行動で示す場合でも、愛情は伝わります。';
        }
    } else {
        $description = '感情表現の方法が異なりますが、お互いのスタイルを尊重することが大切です。';
        if ($romanceTendency1 && $romanceTendency2) {
            $example = "{$type1['name']}は「{$romanceTendency1}」、{$type2['name']}は「{$romanceTendency2}」という恋愛傾向があります。表現方法の違いを理解し、お互いのスタイルを尊重し合いましょう。";
        } else {
            $example = '例えば、一方が感情を素直に表現する一方で、もう一方が控えめな場合、表現方法の違いを理解し合いましょう。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * コミュニケーションスタイルを計算
 */
function calculateCommunicationStyle($type1, $type2) {
    $comm1 = $type1['traits']['communication'];
    $comm2 = $type2['traits']['communication'];
    
    $score = 60;
    
    // 補完性重視：積極型と受容型が良い
    if (($comm1 === '積極型' && $comm2 === '受容型') || ($comm1 === '受容型' && $comm2 === '積極型')) {
        $score = 95;
    } elseif ($comm1 === 'バランス型' && $comm2 === 'バランス型') {
        $score = 85;
    } elseif ($comm1 === $comm2) {
        $score = $comm1 === 'バランス型' ? 80 : 55;
    } else {
        // バランス型と他
        $score = 70;
    }
    
    $dailyActions1 = $type1['dailyActions'] ?? '';
    $dailyActions2 = $type2['dailyActions'] ?? '';
    
    if ($score >= 85) {
        $description = 'コミュニケーションのスタイルが絶妙に補い合い、会話が自然に流れます。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。一方が話題を提供し、もう一方が深く聞いてくれる関係で、会話が途切れることなく、お互いが心地よく話せます。";
        } else {
            $example = '例えば、一方が話題を提供し、もう一方が深く聞いてくれる関係。会話が途切れることなく、お互いが心地よく話せます。';
        }
    } elseif ($score >= 70) {
        $description = 'コミュニケーションスタイルに違いはありますが、お互いのペースを尊重できます。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。お互いのペースを理解し、尊重し合いましょう。";
        } else {
            $example = '例えば、一方が積極的に話す一方で、もう一方がじっくり考える時間が必要な場合、お互いのペースを理解し合いましょう。';
        }
    } else {
        $description = 'コミュニケーションの取り方に違いがあるため、お互いのスタイルを理解することが重要です。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。2人とも積極的に話す場合、お互いの話を聞く時間を作ることが大切です。";
        } else {
            $example = '例えば、2人とも積極的に話す場合、会話が重なりやすいかもしれません。お互いの話を聞く時間を作ることが大切です。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * ストレス対応を計算
 */
function calculateStressResponse($type1, $type2) {
    $comm1 = $type1['traits']['communication'];
    $comm2 = $type2['traits']['communication'];
    $rel1 = $type1['traits']['relationship'];
    $rel2 = $type2['traits']['relationship'];
    
    $score = 60;
    
    // 関係性が補完的だとストレス対応が良い
    if (($rel1 === 'リード型' && $rel2 === '寄り添い型') || ($rel1 === '寄り添い型' && $rel2 === 'リード型')) {
        $score += 25;
    } elseif ($rel1 === $rel2 && $rel1 === '対等型') {
        $score += 20;
    }
    
    // コミュニケーションが補完的だとサポートし合える
    if (($comm1 === '積極型' && $comm2 === '受容型') || ($comm1 === '受容型' && $comm2 === '積極型')) {
        $score += 15;
    }
    
    $score = min(100, max(0, $score));
    
    $personality1 = $type1['personality'] ?? '';
    $personality2 = $type2['personality'] ?? '';
    
    if ($score >= 85) {
        $description = 'ストレスを感じた時、お互いが自然にサポートし合える関係です。';
        if ($personality1 && $personality2) {
            $example = "{$type1['name']}は「{$personality1}」、{$type2['name']}は「{$personality2}」という性格です。一方がストレスで落ち込んでいる時、もう一方が適切に支え、逆の時も同様に助け合えます。";
        } else {
            $example = '例えば、一方がストレスで落ち込んでいる時、もう一方が適切に支え、逆の時も同様に助け合えます。';
        }
    } elseif ($score >= 70) {
        $description = 'ストレス対応の方法が異なりますが、お互いを理解しようと努められます。';
        if ($personality1 && $personality2) {
            $example = "{$type1['name']}は「{$personality1}」、{$type2['name']}は「{$personality2}」という性格です。ストレス対応の方法が異なりますが、お互いのニーズを尊重し合いましょう。";
        } else {
            $example = '例えば、一方が1人で過ごす時間を必要とし、もう一方が話を聞いてほしい場合、お互いのニーズを尊重し合いましょう。';
        }
    } else {
        $description = 'ストレス対応のスタイルが異なるため、お互いの方法を理解することが大切です。';
        if ($personality1 && $personality2) {
            $example = "{$type1['name']}は「{$personality1}」、{$type2['name']}は「{$personality2}」という性格です。2人とも同じようにストレスに対応する場合、お互いが疲れている時は距離を置くことも必要かもしれません。";
        } else {
            $example = '例えば、2人とも同じようにストレスに対応する場合、お互いが疲れている時は距離を置くことも必要かもしれません。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * 生活リズムを計算
 */
function calculateLifestyleRhythm($type1, $type2) {
    $comm1 = $type1['traits']['communication'];
    $comm2 = $type2['traits']['communication'];
    $rel1 = $type1['traits']['relationship'];
    $rel2 = $type2['traits']['relationship'];
    
    $score = 65;
    
    // 関係性が対等型だと生活リズムが合いやすい
    if ($rel1 === '対等型' && $rel2 === '対等型') {
        $score = 85;
    } elseif ($rel1 === '対等型' || $rel2 === '対等型') {
        $score = 75;
    }
    
    // コミュニケーションがバランス型だと調整しやすい
    if ($comm1 === 'バランス型' || $comm2 === 'バランス型') {
        $score += 10;
    }
    
    $score = min(100, max(0, $score));
    
    $dailyActions1 = $type1['dailyActions'] ?? '';
    $dailyActions2 = $type2['dailyActions'] ?? '';
    
    if ($score >= 80) {
        $description = '生活リズムが自然と合い、無理なく一緒に過ごせます。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。朝型と夜型の違いがあっても、お互いの生活パターンを尊重し、自然に調整し合えます。";
        } else {
            $example = '例えば、朝型と夜型の違いがあっても、お互いの生活パターンを尊重し、自然に調整し合えます。';
        }
    } elseif ($score >= 65) {
        $description = '生活リズムに違いはありますが、お互いに調整できます。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。お互いの時間を尊重し、一緒に過ごす時間と1人の時間のバランスを取りましょう。";
        } else {
            $example = '例えば、一方が早起きで活動的、もう一方が夜型でゆっくり過ごす場合、お互いの時間を尊重し合いましょう。';
        }
    } else {
        $description = '生活リズムの違いを理解し、お互いのペースを大切にすることが重要です。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。生活パターンが大きく異なる場合、一緒に過ごす時間と1人の時間のバランスを取ることが大切です。";
        } else {
            $example = '例えば、生活パターンが大きく異なる場合、一緒に過ごす時間と1人の時間のバランスを取ることが大切です。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * 愛情表現を計算
 */
function calculateLoveExpression($type1, $type2) {
    $rel1 = $type1['traits']['relationship'];
    $rel2 = $type2['traits']['relationship'];
    $dec1 = $type1['traits']['decision'];
    $dec2 = $type2['traits']['decision'];
    
    $score = 60;
    
    // 関係性が補完的だと愛情表現が豊か
    if (($rel1 === 'リード型' && $rel2 === '寄り添い型') || ($rel1 === '寄り添い型' && $rel2 === 'リード型')) {
        $score = 90;
    } elseif ($rel1 === $rel2 && $rel1 === '対等型') {
        $score = 80;
    }
    
    // 感情型が含まれると愛情表現が豊か
    if ($dec1 === '感情型' || $dec2 === '感情型') {
        $score += 10;
    }
    
    $score = min(100, max(0, $score));
    
    $romanceTendency1 = $type1['romanceTendency'] ?? '';
    $romanceTendency2 = $type2['romanceTendency'] ?? '';
    $dailyActions1 = $type1['dailyActions'] ?? '';
    $dailyActions2 = $type2['dailyActions'] ?? '';
    
    if ($score >= 85) {
        $description = '愛情表現の方法が絶妙に補い合い、お互いの愛情を感じ合えます。';
        if ($romanceTendency1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$romanceTendency1}」、{$type2['name']}は「{$dailyActions2}」という特徴があります。一方が積極的に愛情を表現し、もう一方がそれを深く受け止める関係で、お互いの愛情が自然に伝わります。";
        } else {
            $example = '例えば、一方が積極的に愛情を表現し、もう一方がそれを深く受け止める関係。お互いの愛情が自然に伝わります。';
        }
    } elseif ($score >= 70) {
        $description = '愛情表現のスタイルに違いはありますが、お互いの方法を理解できます。';
        if ($dailyActions1 && $dailyActions2) {
            $example = "{$type1['name']}は「{$dailyActions1}」、{$type2['name']}は「{$dailyActions2}」という行動パターンがあります。一方が言葉で愛情を表現し、もう一方が行動で示す場合でも、愛情は確実に伝わります。";
        } else {
            $example = '例えば、一方が言葉で愛情を表現し、もう一方が行動で示す場合でも、愛情は確実に伝わります。';
        }
    } else {
        $description = '愛情表現の方法が異なりますが、お互いのスタイルを尊重することが大切です。';
        if ($romanceTendency1 && $romanceTendency2) {
            $example = "{$type1['name']}は「{$romanceTendency1}」、{$type2['name']}は「{$romanceTendency2}」という恋愛傾向があります。愛情表現の頻度や方法が異なる場合、お互いがどのように愛情を感じるかを話し合うことが重要です。";
        } else {
            $example = '例えば、愛情表現の頻度や方法が異なる場合、お互いがどのように愛情を感じるかを話し合うことが重要です。';
        }
    }
    
    return ['score' => $score, 'description' => $description, 'example' => $example];
}

/**
 * 総合スコアに基づいて各項目のスコアを調整
 */
function adjustScoresByTotalScore($baseScore, $totalScore) {
    $baseReference = 70; // 基準スコア
    $adjustmentFactor = $totalScore / $baseReference;
    
    // 調整後のスコアを計算
    $adjustedScore = round($baseScore * $adjustmentFactor);
    
    // 高スコアの場合の制限
    if ($totalScore > 70) {
        $maxAllowed = min(100, $baseScore + ($totalScore - 70) * 0.5);
        $adjustedScore = min($maxAllowed, $adjustedScore);
    } else {
        // 低スコアの場合：比例して低くする
        $adjustedScore = max(20, $adjustedScore);
    }
    
    // 最終的な制限：最低20点、最高100点
    $adjustedScore = min(100, max(20, $adjustedScore));
    
    return $adjustedScore;
}

/**
 * 強みを抽出
 */
function extractStrengths($type1, $type2, $analysis) {
    $strengths = [];
    
    $pushStrength = function($text) use (&$strengths) {
        if (!in_array($text, $strengths)) {
            $strengths[] = $text;
        }
    };
    
    // コミュニケーションが補完的
    if (($type1['traits']['communication'] === '積極型' && $type2['traits']['communication'] === '受容型') ||
        ($type1['traits']['communication'] === '受容型' && $type2['traits']['communication'] === '積極型')) {
        $extrovert = $type1['traits']['communication'] === '積極型' ? $type1 : $type2;
        $introvert = $extrovert === $type1 ? $type2 : $type1;
        $pushStrength("{$extrovert['name']}が空気を温めて{$introvert['name']}が落ち着きを添えるコンビで、話題のテンポが気持ちよく循環します。");
    }
    
    // 関係性が補完的
    if (($type1['traits']['relationship'] === 'リード型' && $type2['traits']['relationship'] === '寄り添い型') ||
        ($type1['traits']['relationship'] === '寄り添い型' && $type2['traits']['relationship'] === 'リード型')) {
        $romance1 = $type1['romanceTendency'] ?? $type1['description'] ?? '';
        $romance2 = $type2['romanceTendency'] ?? $type2['description'] ?? '';
        $pushStrength("{$type1['name']}の「{$romance1}」と{$type2['name']}の「{$romance2}」が役割ピタリ。頼る・支えるの呼吸が自然に揃うカップルです。");
    }
    
    // 意思決定が同じ
    if ($type1['traits']['decision'] === $type2['traits']['decision']) {
        $motivation1 = $type1['innerMotivation'] ?? '価値観';
        $motivation2 = $type2['innerMotivation'] ?? '価値観';
        $pushStrength("{$type1['name']}の「{$motivation1}」と{$type2['name']}の「{$motivation2}」がシンクロしていて、友達以上に相棒感覚で動けるコンビです。");
    }
    
    // 高スコアの項目を強みとして追加
    if ($analysis['communicationStyle'] >= 85) {
        $daily1 = $type1['dailyActions'] ?? 'テンポ';
        $daily2 = $type2['dailyActions'] ?? 'テンポ';
        $pushStrength("{$type1['name']}の「{$daily1}」と{$type2['name']}の「{$daily2}」がぴったり合って、長電話でも飽きずに語り合えるコンビ。");
    }
    if ($analysis['loveExpression'] >= 85) {
        $romance1 = $type1['romanceTendency'] ?? '愛情表現';
        $romance2 = $type2['romanceTendency'] ?? '愛情表現';
        $pushStrength("{$type1['name']}の「{$romance1}」と{$type2['name']}の「{$romance2}」が響き合って、リアクションが毎回可愛いって思える関係。");
    }
    if ($analysis['stressResponse'] >= 85) {
        $personality1 = $type1['personality'] ?? '性格';
        $personality2 = $type2['personality'] ?? '性格';
        $pushStrength("{$type1['name']}の「{$personality1}」と{$type2['name']}の「{$personality2}」が支え合うので、疲れたときこそ一緒にいるのが落ち着く。");
    }
    
    $axisAverage = (
        $analysis['valuesAlignment'] +
        $analysis['emotionalExpression'] +
        $analysis['communicationStyle'] +
        $analysis['stressResponse'] +
        $analysis['lifestyleRhythm'] +
        $analysis['loveExpression']
    ) / 6;
    
    $desiredStrengthCount = $axisAverage >= 85 ? 4 : ($axisAverage >= 75 ? 3 : ($axisAverage >= 60 ? 2 : 1));
    
    $axisLabels = [
        'valuesAlignment' => '価値観シンクロ',
        'emotionalExpression' => '感情共有',
        'communicationStyle' => '会話テンポ',
        'stressResponse' => 'ケア感度',
        'lifestyleRhythm' => '生活リズム',
        'loveExpression' => '愛情表現',
    ];
    
    $axisCandidates = [
        ['key' => 'valuesAlignment', 'score' => $analysis['valuesAlignment'], 'text' => $axisLabels['valuesAlignment'] . '：' . $analysis['valuesAlignmentDetail']['description']],
        ['key' => 'emotionalExpression', 'score' => $analysis['emotionalExpression'], 'text' => $axisLabels['emotionalExpression'] . '：' . $analysis['emotionalExpressionDetail']['description']],
        ['key' => 'communicationStyle', 'score' => $analysis['communicationStyle'], 'text' => $axisLabels['communicationStyle'] . '：' . $analysis['communicationStyleDetail']['description']],
        ['key' => 'stressResponse', 'score' => $analysis['stressResponse'], 'text' => $axisLabels['stressResponse'] . '：' . $analysis['stressResponseDetail']['description']],
        ['key' => 'lifestyleRhythm', 'score' => $analysis['lifestyleRhythm'], 'text' => $axisLabels['lifestyleRhythm'] . '：' . $analysis['lifestyleRhythmDetail']['description']],
        ['key' => 'loveExpression', 'score' => $analysis['loveExpression'], 'text' => $axisLabels['loveExpression'] . '：' . $analysis['loveExpressionDetail']['description']],
    ];
    
    usort($axisCandidates, function($a, $b) {
        return $b['score'] - $a['score'];
    });
    
    foreach ($axisCandidates as $candidate) {
        if (count($strengths) >= $desiredStrengthCount) break;
        if ($candidate['score'] < 55) continue;
        if (array_filter($strengths, function($s) use ($axisLabels, $candidate) {
            return strpos($s, $axisLabels[$candidate['key']]) !== false;
        })) continue;
        $pushStrength($candidate['text']);
    }
    
    return count($strengths) > 0 ? $strengths : ['お互いを理解しようとする姿勢がある'];
}

/**
 * 診断結果をもとにチャレンジ提案を生成
 */
function generateChallenges($type1, $type2, $analysis) {
    $challenges = [];
    
    $addChallenge = function($title, $description) use (&$challenges) {
        $challenges[] = ['title' => $title, 'description' => $description];
    };
    
    // コミュニケーションが似すぎている場合
    if ($type1['traits']['communication'] === $type2['traits']['communication'] &&
        $type1['traits']['communication'] !== 'バランス型') {
        $style = $type1['traits']['communication'];
        $title = "交互に話す5分セッション（{$style}同士）";
        $daily1 = $type1['dailyActions'] ?? '';
        $daily2 = $type2['dailyActions'] ?? '';
        $description = ($daily1 && $daily2) ?
            "{$type1['name']}は「{$daily1}」、{$type2['name']}は「{$daily2}」タイプで、会話のペースが似ています。5分ずつ交代で「話し役・聞き役」になる時間を作って、お互いの話を最後まで聞くチャレンジをしてみよう。" :
            "会話のテンポが似ている2人だからこそ、5分ごとに話し役と聞き役を交代してみるチャレンジを。互いの話を丁寧に聞くことで理解度が一気に深まります。";
        $addChallenge($title, $description);
    }
    
    // 意思決定が正反対
    if (($type1['traits']['decision'] === '論理型' && $type2['traits']['decision'] === '感情型') ||
        ($type1['traits']['decision'] === '感情型' && $type2['traits']['decision'] === '論理型')) {
        $logicType = $type1['traits']['decision'] === '論理型' ? $type1 : $type2;
        $emotionType = $type1['traits']['decision'] === '感情型' ? $type1 : $type2;
        $title = '理由と気持ちをセットで共有するDAY';
        $motivation1 = $logicType['innerMotivation'] ?? '';
        $motivation2 = $emotionType['innerMotivation'] ?? '';
        $description = ($motivation1 && $motivation2) ?
            "{$logicType['name']}は「{$motivation1}」視点、{$emotionType['name']}は「{$motivation2}」視点で考える傾向があります。週1回、1つのテーマについて「まず感情」、「次に理由」を順番に話す練習をして、判断基準の違いを楽しく擦り合わせてみよう。" :
            "論理派と感情派のペアなので、週1回「テーマを決めて感情→理由の順で話す」チャレンジを。順番を決めることで、お互いの判断基準を噛みしめながら共有できます。";
        $addChallenge($title, $description);
    }
    
    // 関係性が同じ極端なタイプ
    if ($type1['traits']['relationship'] === $type2['traits']['relationship'] &&
        $type1['traits']['relationship'] !== '対等型') {
        $style = $type1['traits']['relationship'];
        $title = "役割チェンジウィーク（{$style}コンビ）";
        $romance1 = $type1['romanceTendency'] ?? '';
        $romance2 = $type2['romanceTendency'] ?? '';
        $description = ($romance1 && $romance2) ?
            "{$type1['name']}は「{$romance1}」、{$type2['name']}は「{$romance2}」で同じ役割に偏りがち。1週間ごとに「リードする側」と「委ねる側」を入れ替えて、違う立場の気持ちを体験してみよう。" :
            "似た役割スタイルの2人なので、週替わりでリード役とサポート役を入れ替えるチャレンジを設定。違う立場を経験すると、相手の大変さやありがたさが体感できます。";
        $addChallenge($title, $description);
    }
    
    // 感情表現スコアが低い
    if ($analysis['emotionalExpression'] < 60) {
        $title = "感情表現{$analysis['emotionalExpression']}点→気持ちログ交換";
        $romance1 = $type1['romanceTendency'] ?? '';
        $romance2 = $type2['romanceTendency'] ?? '';
        $description = ($romance1 && $romance2) ?
            "今回は感情表現スコアが{$analysis['emotionalExpression']}点。{$type1['name']}の「{$romance1}」と{$type2['name']}の「{$romance2}」の違いを楽しみつつ、毎晩寝る前に「今日嬉しかったこと」「不安だったこと」を文章かボイスで送り合うチャレンジを1週間続けてみよう。" :
            "感情表現スコアが{$analysis['emotionalExpression']}点だったので、1日1つ「今日の感情」を送り合う習慣を試してみて。結果を見返すと、お互いの感じ方の癖が把握できます。";
        $addChallenge($title, $description);
    }
    
    // 生活リズムスコアが低い
    if ($analysis['lifestyleRhythm'] < 65) {
        $title = "生活リズム{$analysis['lifestyleRhythm']}点→時間割シェア";
        $daily1 = $type1['dailyActions'] ?? '';
        $daily2 = $type2['dailyActions'] ?? '';
        $description = ($daily1 && $daily2) ?
            "{$type1['name']}は「{$daily1}」、{$type2['name']}は「{$daily2}」という動き方。Googleカレンダーやメモアプリで「集中タイム」「オフの時間」を共有し、週末に「一緒に過ごしたい時間」を予約するチャレンジをしてみよう。" :
            "生活リズムスコアが{$analysis['lifestyleRhythm']}点だったので、毎週日曜に「来週一緒に過ごせそうな時間」を30分だけすり合わせるチャレンジを設定。習慣化するとズレが小さくなります。";
        $addChallenge($title, $description);
    }
    
    if (count($challenges) === 0) {
        $addChallenge('ウィークリーチェックイン', '今週の嬉しかったこと・直してほしいことを5分ずつ話す時間をつくって、お互いの変化に気づけるようにしよう。');
    }
    
    return $challenges;
}

/**
 * 改善のヒントを生成
 */
function generateImprovementTips($type1, $type2, $analysis) {
    $tips = [];
    
    $pushTip = function($title, $description) use (&$tips) {
        if (count($tips) < 3) {
            $tips[] = ['title' => $title, 'description' => $description];
        }
    };
    
    $describeCommunication = function($type) {
        return "{$type['name']}は{$type['traits']['communication']}タイプ";
    };
    $describeDecision = function($type) {
        return "{$type['name']}は{$type['traits']['decision']}で物事を判断";
    };
    $describeRelation = function($type) {
        return "{$type['name']}は{$type['traits']['relationship']}ポジション";
    };
    
    if ($analysis['communicationStyle'] < 85) {
        $detail = "今回のコミュニケーションスコアは{$analysis['communicationStyle']}点。{$analysis['communicationStyleDetail']['description']}" . $describeCommunication($type1) . "と" . $describeCommunication($type2) . "という組み合わせは、盛り上がりたいテンポと一旦様子を見たいテンポが交錯しやすい。";
        $action = "週2回だけでも『3分話す→3分聞く』を交代で3セット行い、話す側は脱線せずに伝え切る練習、聞く側は合図を返しながら最後まで聴き切る練習をしてみて。セッション後に「どのタイミングで割り込まれたくなるか」「どう相槌されると安心するか」をメモに残すと、2人の理想ペースが数字で共有できる。";
        $practical = "録音はLINEやInstagramのDMで送れるから、バイトや授業の帰り道でも続けやすいし、後から聞き返せば"ここで笑ってほしい"のツボ合わせにもつながる。";
        $pushTip("{$type1['name']}×{$type2['name']}の会話テンポ調整", $detail . $action . $practical);
    }
    
    if ($analysis['emotionalExpression'] < 85) {
        $romance = ($type1['romanceTendency'] ?? '') && ($type2['romanceTendency'] ?? '') ?
            "{$type1['name']}は「{$type1['romanceTendency']}」、{$type2['name']}は「{$type2['romanceTendency']}」。" : '';
        $action = "寝る前に『今日テンション上がったこと』『引っかかったこと』『ありがとう』を1行ずつ送り合い、翌週まとめて読み返して"同じ出来事でも感じ方が違う"瞬間を言語化してみよう。ログを見返すと「この単語を使うと伝わりやすい」「この質問の仕方が刺さる」といった相手専用の攻略法が見え始めます。";
        $practical = "感情表現スコアは{$analysis['emotionalExpression']}点。文章だけでなく写真や絵文字、ミーム画像を混ぜて"ストーリー裏アカ"感覚で残すと長続きするし、溜まったログは記念日ポストのネタにも転用できる。";
        $pushTip('感情ログミーティング', $analysis['emotionalExpressionDetail']['description'] . $romance . $action . $practical);
    }
    
    if ($analysis['valuesAlignment'] < 80) {
        $action = "日曜夜に「来週大事にしたいこと」「譲れないこと」「後回しでOKなこと」を各3つ書き出して交換し、被りやズレを声に出して確認してみて。優先順位を数字（1〜3）で付け合うと、『今週は◯◯を最優先に動いてる』と共有しやすく、衝突前に"共通の指針"へ立ち返れる。";
        $practical = "価値観スコアは{$analysis['valuesAlignment']}点なので、Notionボードや共有メモを「やる」「今週は保留」の2列で管理し、リンクや画像も貼っておくと遊びや旅行の企画も"ふたりのルール"に沿って即決できる。";
        $pushTip('価値観メモの週次シェア', $analysis['valuesAlignmentDetail']['description'] . $analysis['valuesAlignmentDetail']['example'] . $action . $practical);
    }
    
    if ($analysis['lifestyleRhythm'] < 75) {
        $rhythm = ($type1['dailyActions'] ?? '') && ($type2['dailyActions'] ?? '') ?
            "{$type1['name']}は「{$type1['dailyActions']}」、{$type2['name']}は「{$type2['dailyActions']}」。" : '';
        $action = "GoogleカレンダーやNotionで『集中タイム』『完全オフ』『ふたり時間』『移動中』を色分けし、週の初めに重ね合わせてから予定を決めるルールを作ろう。色の重なり具合を見ながら「この時間ならテンション合いそう」「ここは一人時間優先しよう」と事前に話せるので、誘われた瞬間に断る罪悪感も薄れる。";
        $practical = "生活リズムスコアは{$analysis['lifestyleRhythm']}点。TimeTreeなどカップル向けアプリで「サプライズ枠」をタグ化し、空き時間が一致したら即ピン留め→リンクまで貼っておけば、忙しい週でもプチデートのチャンスを逃さない。";
        $pushTip('生活リズムの見える化', $analysis['lifestyleRhythmDetail']['description'] . $rhythm . $action . $practical);
    }
    
    if ($analysis['stressResponse'] < 80) {
        $action = "お互いの"疲れサイン"を3つずつ書き出し、『サインを見つけたら30分の休憩＋労りメッセージ＋好きな差し入れ1つ』を提供するルールを先に作ろう。事前に「サインが出たら遠慮せず頼ってOK」と合意しておくと、どちらかが限界を超える前に安心してブレーキを踏めます。";
        $practical = "ストレス対応スコアは{$analysis['stressResponse']}点。Google Keepにサインリストを固定し、見つけた側がUberEatsやスタバeGiftを即送れるようお気に入り登録しておくと、ケアがワンテンポ早くなる。";
        $pushTip('ストレス早期アラート', $analysis['stressResponseDetail']['description'] . $action . $practical);
    }
    
    if ($analysis['loveExpression'] < 80) {
        $action = "互いに"もらって嬉しかった行動"を5つずつ書き出し、翌週はそれを交換して実践する『愛情サンプル週間』を設けてみて。相手の好反応を観察しながら自分の定番をアップデートできるし、『思ってた以上にこの表現が刺さるんだ』という発見がそのまま2人の新しい文化になる。";
        $practical = "愛情表現スコアは{$analysis['loveExpression']}点。スプレッドシートで「行動」「相手のリアクション」「次回のアレンジ案」を記録して"LOVE LANGUAGE図鑑"を作り、気に入った内容はスクショしてSNSの下書きに保存しておけば記念日サプライズのネタ帳にもなる。";
        $pushTip('愛情サンプルの共有', $analysis['loveExpressionDetail']['description'] . $action . $practical);
    }
    
    if ($type1['traits']['decision'] !== $type2['traits']['decision']) {
        $action = "テーマを話し始める前に『今は感情で話すターン？論理で整理するターン？』と一言添えてから議論に入るだけで、求められているリアクションが揃いやすくなる。感情モードのときは"相槌と共感"を先に、論理モードのときは"前提整理と選択肢提示"を意識しよう。";
        $pushTip('意思決定モード宣言', $describeDecision($type1) . "、" . $describeDecision($type2) . "ため議論の土台がズレやすい。" . $action);
    }
    
    if ($type1['traits']['relationship'] !== $type2['traits']['relationship']) {
        $action = "予定を決めるたびに『今回はどっちがリードする？』を即答で決め、リード役は最終判断まで責任を持ち、サポート役は必ず2案のリアルな意見を出す"交互リード"ルールを導入しよう。役割を先に宣言するだけで、気付かぬうちに同じ側ばかり負担する状況を防げます。";
        $pushTip('リード役の先出し', $describeRelation($type1) . "、" . $describeRelation($type2) . "なので暗黙のまま役割が偏りがち。" . $action);
    }
    
    if (count($tips) === 0 && count($analysis['strengths']) > 0) {
        $cleanedStrength = preg_replace('/（[^）]*）/u', '', $analysis['strengths'][0]);
        $pushTip('強みの定例化', "{$cleanedStrength}という強みが出ているので、その状況を週1でわざと再現し、得意なリズムをキープした状態で課題に取り組める"ホームグラウンド"を作ろう。");
    }
    
    if (count($tips) === 0) {
        $pushTip('ウィークリーチェックイン', '毎週15分、嬉しかったことと改善してほしいことを交互に1つずつ出し合い、すれ違いが溜まる前に微調整できる時間を確保しよう。');
    }
    
    return $tips;
}

/**
 * 会話のきっかけを生成
 */
function generateConversationStarters($type1, $type2, $analysis) {
    $starters = [];
    
    $romance1 = $type1['romanceTendency'] ?? '';
    $romance2 = $type2['romanceTendency'] ?? '';
    $romanceQuestion = ($romance1 && $romance2) ?
        "診断で{$type1['name']}は「{$romance1}」、{$type2['name']}は「{$romance2}」って出てたし、お互いどんな甘え方や声かけがいちばん嬉しいか今日決めてみない？" :
        "診断結果を見ながら、お互いにされて嬉しい甘やかし方を具体的に3つ出し合ってみない？";
    $starters[] = $romanceQuestion;
    
    $daily1 = $type1['dailyActions'] ?? '';
    $daily2 = $type2['dailyActions'] ?? '';
    $dailyQuestion = ($daily1 && $daily2) ?
        "日常モードでは{$type1['name']}が「{$daily1}」、{$type2['name']}が「{$daily2}」って書かれてたし、今週どの時間帯なら一緒に動けそうかざっくり合わせてみようよ？" :
        "今週の生活リズムをざっくり共有して、連絡しやすい時間と完全オフの時間を先に宣言し合わない？";
    $starters[] = $dailyQuestion;
    
    $axisInfo = [
        ['key' => 'valuesAlignment', 'label' => '価値観シンクロ度', 'score' => $analysis['valuesAlignment'], 'detail' => $analysis['valuesAlignmentDetail']['description']],
        ['key' => 'emotionalExpression', 'label' => '感情共有モード', 'score' => $analysis['emotionalExpression'], 'detail' => $analysis['emotionalExpressionDetail']['description']],
        ['key' => 'communicationStyle', 'label' => '会話テンポ', 'score' => $analysis['communicationStyle'], 'detail' => $analysis['communicationStyleDetail']['description']],
        ['key' => 'stressResponse', 'label' => 'ストレス察知力', 'score' => $analysis['stressResponse'], 'detail' => $analysis['stressResponseDetail']['description']],
        ['key' => 'lifestyleRhythm', 'label' => '生活リズムシンクロ', 'score' => $analysis['lifestyleRhythm'], 'detail' => $analysis['lifestyleRhythmDetail']['description']],
        ['key' => 'loveExpression', 'label' => '愛情表現バランス', 'score' => $analysis['loveExpression'], 'detail' => $analysis['loveExpressionDetail']['description']],
    ];
    
    usort($axisInfo, function($a, $b) {
        return $b['score'] - $a['score'];
    });
    
    $topAxis = $axisInfo[0];
    $growthAxis = null;
    foreach ($axisInfo as $index => $axis) {
        if ($index > 0 && $axis['key'] !== $topAxis['key']) {
            $growthAxis = $axis;
            break;
        }
    }
    if (!$growthAxis) {
        $growthAxis = $axisInfo[count($axisInfo) - 1];
    }
    
    $axisQuestionTemplates = [
        'valuesAlignment' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "って診断に書かれてたし、" : "";
                return "診断で「{$label}{$score}点」って出てたし、{$snippet}今週の予定を決める前に一番大事にしたいことって何か言い合ってみない？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」ってまだ伸びしろあるみたいだから、譲れないマイルールと「ここは合わせられるよ」ってポイントを1つずつ出してみない？";
            },
        ],
        'emotionalExpression' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "ってコメントもあったし、" : "";
                return "診断では「{$label}{$score}点」って褒められてたし、{$snippet}最近テンション上がった出来事ってどう伝えたら一緒にもっと盛り上がれそう？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」って結果だったから、嬉しいときとモヤっとしたとき、それぞれどんな合図やスタンプなら受け止めやすい？";
            },
        ],
        'communicationStyle' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "って書かれてたし、" : "";
                return "診断で「{$label}{$score}点」って出てたし、{$snippet}今いちばんじっくり語りたいテーマって何？時間決めて話してみよ？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」って少し課題ありみたいだから、どんなタイミングで会話が途切れがちか共有して、途中で割り込みOKの合図決めない？";
            },
        ],
        'stressResponse' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "って言われてたし、" : "";
                return "診断だと「{$label}{$score}点」ってサポート力が高いらしいし、{$snippet}最近どんなケアをしてもらえたら助かった？同じやり方もう一回やってみない？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」ってまだ上げられそうだから、私が疲れてるときのサインってどんなふうに見えてる？気づいたらどう接してほしい？";
            },
        ],
        'lifestyleRhythm' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "って診断にあったし、" : "";
                return "診断では「{$label}{$score}点」って安定してるらしいし、{$snippet}土日や夜の空いた時間、どの枠を「ふたり時間」にするかゆるっと決めてみる？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」って今は様子見らしいから、平日どの時間なら一番連絡返しやすいかスケジュール共有してみない？";
            },
        ],
        'loveExpression' => [
            'strength' => function($label, $score, $detail) {
                $snippet = $detail ? preg_replace('/[。．.]+$/u', '', $detail) . "って褒められてたし、" : "";
                return "診断で「{$label}{$score}点」って出てたし、{$snippet}最近もらって刺さった愛情表現、次はどうアップデートしてみたい？";
            },
            'growth' => function($label, $score) {
                return "「{$label}{$score}点」って結果だったから、どんなリアクションが返ってくると「ちゃんと伝わった」って安心できる？具体例教えて？";
            },
        ],
    ];
    
    if ($topAxis) {
        $template = $axisQuestionTemplates[$topAxis['key']];
        $starters[] = $template['strength']($topAxis['label'], round($topAxis['score']), $topAxis['detail']);
    }
    
    if ($growthAxis) {
        $template = $axisQuestionTemplates[$growthAxis['key']];
        $starters[] = $template['growth']($growthAxis['label'], round($growthAxis['score']));
    }
    
    return $starters;
}

/**
 * 未来へのメッセージを生成
 */
function generateFutureMessage($type1, $type2, $totalScore) {
    if ($totalScore >= 85) {
        return "2人の相性は素晴らしいものです。{$type1['name']}と{$type2['name']}の組み合わせは、お互いを高め合い、支え合える関係を築けるでしょう。違いを楽しみながら、一緒に成長していける未来が待っています。";
    } elseif ($totalScore >= 70) {
        return "{$type1['name']}と{$type2['name']}の2人は、お互いを理解し、尊重し合うことで、素晴らしい関係を築けます。違いは個性であり、それを活かすことで、より深い絆を育んでいけるでしょう。";
    } else {
        return "2人のタイプは異なりますが、それはお互いを補い合えるということでもあります。{$type1['name']}と{$type2['name']}の組み合わせは、理解と努力によって、かけがえのない関係を築けるでしょう。お互いを大切にしながら、一緒に歩んでいきましょう。";
    }
}

/**
 * 詳細な相性分析を実行
 */
function analyzeDetailedCompatibility($type1, $type2, $totalScore) {
    $valuesAlignmentDetail = calculateValuesAlignment($type1, $type2);
    $emotionalExpressionDetail = calculateEmotionalExpression($type1, $type2);
    $communicationStyleDetail = calculateCommunicationStyle($type1, $type2);
    $stressResponseDetail = calculateStressResponse($type1, $type2);
    $lifestyleRhythmDetail = calculateLifestyleRhythm($type1, $type2);
    $loveExpressionDetail = calculateLoveExpression($type1, $type2);
    
    // 総合スコアに基づいて各項目のスコアを調整
    $adjustedValuesAlignment = adjustScoresByTotalScore($valuesAlignmentDetail['score'], $totalScore);
    $adjustedEmotionalExpression = adjustScoresByTotalScore($emotionalExpressionDetail['score'], $totalScore);
    $adjustedCommunicationStyle = adjustScoresByTotalScore($communicationStyleDetail['score'], $totalScore);
    $adjustedStressResponse = adjustScoresByTotalScore($stressResponseDetail['score'], $totalScore);
    $adjustedLifestyleRhythm = adjustScoresByTotalScore($lifestyleRhythmDetail['score'], $totalScore);
    $adjustedLoveExpression = adjustScoresByTotalScore($loveExpressionDetail['score'], $totalScore);
    
    // 調整後のスコアで詳細情報も更新
    $adjustedValuesAlignmentDetail = array_merge($valuesAlignmentDetail, ['score' => $adjustedValuesAlignment]);
    $adjustedEmotionalExpressionDetail = array_merge($emotionalExpressionDetail, ['score' => $adjustedEmotionalExpression]);
    $adjustedCommunicationStyleDetail = array_merge($communicationStyleDetail, ['score' => $adjustedCommunicationStyle]);
    $adjustedStressResponseDetail = array_merge($stressResponseDetail, ['score' => $adjustedStressResponse]);
    $adjustedLifestyleRhythmDetail = array_merge($lifestyleRhythmDetail, ['score' => $adjustedLifestyleRhythm]);
    $adjustedLoveExpressionDetail = array_merge($loveExpressionDetail, ['score' => $adjustedLoveExpression]);
    
    $analysis = [
        'valuesAlignment' => $adjustedValuesAlignment,
        'emotionalExpression' => $adjustedEmotionalExpression,
        'communicationStyle' => $adjustedCommunicationStyle,
        'stressResponse' => $adjustedStressResponse,
        'lifestyleRhythm' => $adjustedLifestyleRhythm,
        'loveExpression' => $adjustedLoveExpression,
        'valuesAlignmentDetail' => $adjustedValuesAlignmentDetail,
        'emotionalExpressionDetail' => $adjustedEmotionalExpressionDetail,
        'communicationStyleDetail' => $adjustedCommunicationStyleDetail,
        'stressResponseDetail' => $adjustedStressResponseDetail,
        'lifestyleRhythmDetail' => $adjustedLifestyleRhythmDetail,
        'loveExpressionDetail' => $adjustedLoveExpressionDetail,
        'strengths' => [],
        'challenges' => [],
        'improvementTips' => [],
        'conversationStarters' => [],
        'futureMessage' => '',
    ];
    
    $analysis['strengths'] = extractStrengths($type1, $type2, $analysis);
    $analysis['challenges'] = generateChallenges($type1, $type2, $analysis);
    $analysis['improvementTips'] = generateImprovementTips($type1, $type2, $analysis);
    $analysis['conversationStarters'] = generateConversationStarters($type1, $type2, $analysis);
    $analysis['futureMessage'] = generateFutureMessage($type1, $type2, $totalScore);
    
    return $analysis;
}

