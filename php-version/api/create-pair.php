<?php
/**
 * POST /api/create-pair
 * ペアコード生成API
 */

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // ランダム6桁のペアコード生成
    function generatePairCode() {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0, O, I, 1を除外
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }
        return $code;
    }
    
    // ユニークなペアコードを生成
    $pairCode = generatePairCode();
    $maxAttempts = 10;
    $attempts = 0;
    
    while ($attempts < $maxAttempts) {
        $stmt = $pdo->prepare("SELECT id FROM pairs WHERE pair_code = ?");
        $stmt->execute([$pairCode]);
        
        if (!$stmt->fetch()) {
            // ペアコードが存在しない場合、作成
            $stmt = $pdo->prepare("INSERT INTO pairs (pair_code) VALUES (?)");
            $stmt->execute([$pairCode]);
            
            echo json_encode([
                'pair_code' => $pairCode,
                'created_at' => date('Y-m-d H:i:s')
            ]);
            exit;
        }
        
        $pairCode = generatePairCode();
        $attempts++;
    }
    
    throw new Exception('ペアコードの生成に失敗しました');
    
} catch (Exception $e) {
    error_log("create-pair error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'ペアコードの作成に失敗しました']);
}








