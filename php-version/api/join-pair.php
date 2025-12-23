<?php
/**
 * POST /api/join-pair
 * ペア参加確認API
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
    
    if (empty($pairCode)) {
        http_response_code(400);
        echo json_encode(['error' => 'pair_code is required']);
        exit;
    }
    
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("SELECT id, created_at FROM pairs WHERE pair_code = ?");
    $stmt->execute([$pairCode]);
    $pair = $stmt->fetch();
    
    if ($pair) {
        echo json_encode([
            'valid' => true,
            'pair_code' => $pairCode,
            'created_at' => $pair['created_at']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'valid' => false,
            'error' => 'ペアコードが見つかりません'
        ]);
    }
    
} catch (Exception $e) {
    error_log("join-pair error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'サーバーエラーが発生しました']);
}












