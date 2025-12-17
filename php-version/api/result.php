<?php
/**
 * GET /api/result?pair_code=xxx
 * 診断結果取得API
 */

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pairCode = $_GET['pair_code'] ?? '';
    
    if (empty($pairCode)) {
        http_response_code(400);
        echo json_encode(['error' => 'pair_code is required']);
        exit;
    }
    
    $pdo = getDbConnection();
    
    // 結果を取得
    $stmt = $pdo->prepare("
        SELECT * FROM results
        WHERE pair_code = ?
        ORDER BY created_at DESC
        LIMIT 1
    ");
    $stmt->execute([$pairCode]);
    $result = $stmt->fetch();
    
    if (!$result) {
        http_response_code(404);
        echo json_encode(['error' => '結果が見つかりません']);
        exit;
    }
    
    // summaryをJSONデコード
    $summary = json_decode($result['summary'], true);
    
    // compatibilityデータが存在しない場合は、rankから再計算
    $compatibility = $summary['compatibility'] ?? null;
    if (!$compatibility && isset($summary['user']) && isset($summary['partner'])) {
        require_once __DIR__ . '/../lib/calculate.php';
        $compatibility = calculateCompatibility($summary['user'], $summary['partner']);
    }
    
    // rankがsummaryに含まれている場合はそれを使用
    $rank = $result['rank'];
    if (isset($summary['rankInfo'])) {
        $rank = $summary['rankInfo']['rank'];
    }
    
    echo json_encode([
        'pair_code' => $result['pair_code'],
        'user_type' => $summary['user'] ?? null,
        'partner_type' => $summary['partner'] ?? null,
        'compatibility' => $compatibility,
        'rank' => $rank,
        'total_score' => intval($result['total_score']),
        'user_scores' => [
            'axis1' => intval($result['user_score1']),
            'axis2' => intval($result['user_score2']),
            'axis3' => intval($result['user_score3'])
        ],
        'partner_scores' => [
            'axis1' => intval($result['partner_score1']),
            'axis2' => intval($result['partner_score2']),
            'axis3' => intval($result['partner_score3'])
        ],
        'created_at' => $result['created_at']
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    error_log("result error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => '結果の取得に失敗しました']);
}

