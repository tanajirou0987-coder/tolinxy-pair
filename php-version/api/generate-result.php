<?php
/**
 * POST /api/generate-result
 * 診断結果生成API
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../lib/calculate.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $pairCode = $input['pair_code'] ?? '';
    
    if (empty($pairCode)) {
        http_response_code(400);
        echo json_encode(['error' => 'pair_code is required']);
        exit;
    }
    
    $pdo = getDbConnection();
    
    // ペアコードの存在確認
    $stmt = $pdo->prepare("SELECT id FROM pairs WHERE pair_code = ?");
    $stmt->execute([$pairCode]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'ペアコードが見つかりません']);
        exit;
    }
    
    // 既に結果が生成されているかチェック
    $stmt = $pdo->prepare("SELECT id FROM results WHERE pair_code = ?");
    $stmt->execute([$pairCode]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => '結果は既に生成されています']);
        exit;
    }
    
    // 両端末の回答を取得
    $stmt = $pdo->prepare("
        SELECT device_id, question_id, answer_value
        FROM answers
        WHERE pair_code = ?
        ORDER BY device_id, question_id
    ");
    $stmt->execute([$pairCode]);
    $allAnswers = $stmt->fetchAll();
    
    // デバイスごとに回答を分ける
    $deviceAnswers = [];
    foreach ($allAnswers as $answer) {
        $deviceId = $answer['device_id'];
        if (!isset($deviceAnswers[$deviceId])) {
            $deviceAnswers[$deviceId] = [];
        }
        $deviceAnswers[$deviceId][] = [
            'question_id' => intval($answer['question_id']),
            'answer_value' => $answer['answer_value']
        ];
    }
    
    if (count($deviceAnswers) !== 2) {
        http_response_code(400);
        echo json_encode(['error' => '2つのデバイスの回答が必要です']);
        exit;
    }
    
    $deviceIds = array_keys($deviceAnswers);
    $userAnswers = $deviceAnswers[$deviceIds[0]];
    $partnerAnswers = $deviceAnswers[$deviceIds[1]];
    
    // スコア計算
    $userScores = calculateScores($userAnswers, 54);
    $partnerScores = calculateScores($partnerAnswers, 54);
    
    // タイプ判定
    $userType = getPersonalityType($userScores['axis1'], $userScores['axis2'], $userScores['axis3'], '54');
    $partnerType = getPersonalityType($partnerScores['axis1'], $partnerScores['axis2'], $partnerScores['axis3'], '54');
    
    // 相性計算（動的計算を使用）
    $score = calculateCompatibilityScore($userType, $partnerType);
    $percentileInfo = generateCompatibilityMessageWithPercentile($score);
    $rankInfo = getCompatibilityRank($percentileInfo['percentile']);
    
    // 互換性のため、古い形式も保持
    $compatibility = [
        'total' => $score,
        'message' => $percentileInfo['message'],
        'percentile' => $percentileInfo['percentile'],
        'percentileText' => $percentileInfo['percentileText'],
        'rank' => $rankInfo['rank'],
        'rankName' => $rankInfo['rankName'],
        'tier' => $rankInfo['tier'],
    ];
    
    $rank = $rankInfo['rank'];
    
    // 結果をDBに保存
    $stmt = $pdo->prepare("
        INSERT INTO results (
            pair_code, user_type, partner_type,
            user_score1, user_score2, user_score3,
            partner_score1, partner_score2, partner_score3,
            total_score, rank, summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $summary = json_encode([
        'user' => $userType,
        'partner' => $partnerType,
        'compatibility' => $compatibility,
        'rankInfo' => $rankInfo,
        'percentileInfo' => $percentileInfo
    ], JSON_UNESCAPED_UNICODE);
    
    $stmt->execute([
        $pairCode,
        $userType['type'],
        $partnerType['type'],
        $userScores['axis1'],
        $userScores['axis2'],
        $userScores['axis3'],
        $partnerScores['axis1'],
        $partnerScores['axis2'],
        $partnerScores['axis3'],
        $compatibility['total'],
        $rank,
        $summary
    ]);
    
    echo json_encode([
        'success' => true,
        'pair_code' => $pairCode,
        'result' => [
            'user_type' => $userType,
            'partner_type' => $partnerType,
            'compatibility' => $compatibility,
            'rank' => $rank
        ]
    ]);
    
} catch (Exception $e) {
    error_log("generate-result error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => '結果の生成に失敗しました']);
}

