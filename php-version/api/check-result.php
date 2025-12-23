<?php
/**
 * GET /api/check-result?pair_code=xxx
 * 回答完了状況チェックAPI
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
    
    // ペアコードの存在確認
    $stmt = $pdo->prepare("SELECT id FROM pairs WHERE pair_code = ?");
    $stmt->execute([$pairCode]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'ペアコードが見つかりません']);
        exit;
    }
    
    // 各デバイスの回答数を取得
    $stmt = $pdo->prepare("
        SELECT device_id, COUNT(*) as answer_count
        FROM answers
        WHERE pair_code = ?
        GROUP BY device_id
    ");
    $stmt->execute([$pairCode]);
    $devices = $stmt->fetchAll();
    
    // デバイスIDのリストを取得
    $deviceIds = array_column($devices, 'device_id');
    $progress = [];
    foreach ($devices as $device) {
        $progress[$device['device_id']] = intval($device['answer_count']);
    }
    
    // 54問すべてに回答しているかチェック
    const TOTAL_QUESTIONS = 54;
    $completed = false;
    $allCompleted = true;
    
    foreach ($devices as $device) {
        if (intval($device['answer_count']) >= TOTAL_QUESTIONS) {
            $completed = true;
        } else {
            $allCompleted = false;
        }
    }
    
    // 2つのデバイスが存在し、両方とも54問回答済みの場合
    $readyForResult = count($deviceIds) === 2 && $allCompleted;
    
    echo json_encode([
        'completed' => $readyForResult,
        'ready_for_result' => $readyForResult,
        'progress' => $progress,
        'total_questions' => TOTAL_QUESTIONS,
        'device_count' => count($deviceIds)
    ]);
    
} catch (Exception $e) {
    error_log("check-result error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'チェックに失敗しました']);
}













