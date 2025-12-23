<?php
/**
 * POST /api/save-answer
 * 回答保存API
 */

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $pairCode = $input['pair_code'] ?? '';
    $deviceId = $input['device_id'] ?? '';
    $questionId = intval($input['question_id'] ?? 0);
    $answerValue = $input['answer_value'] ?? '';
    
    // バリデーション
    if (empty($pairCode) || empty($deviceId) || $questionId <= 0 || empty($answerValue)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid parameters']);
        exit;
    }
    
    // ペアコードの存在確認
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT id FROM pairs WHERE pair_code = ?");
    $stmt->execute([$pairCode]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'ペアコードが見つかりません']);
        exit;
    }
    
    // 回答を保存（INSERT ... ON DUPLICATE KEY UPDATE）
    $stmt = $pdo->prepare("
        INSERT INTO answers (pair_code, device_id, question_id, answer_value)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            answer_value = VALUES(answer_value),
            updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$pairCode, $deviceId, $questionId, $answerValue]);
    
    echo json_encode([
        'success' => true,
        'pair_code' => $pairCode,
        'device_id' => $deviceId,
        'question_id' => $questionId,
        'answer_value' => $answerValue
    ]);
    
} catch (Exception $e) {
    error_log("save-answer error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => '回答の保存に失敗しました']);
}












