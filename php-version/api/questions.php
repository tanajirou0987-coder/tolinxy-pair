<?php
/**
 * GET /api/questions.php
 * 質問データ取得API
 */

header('Content-Type: application/json; charset=utf-8');

$filePath = __DIR__ . '/../data/compatibility-54/questions.json';

if (file_exists($filePath)) {
    $json = file_get_contents($filePath);
    echo $json;
} else {
    http_response_code(404);
    echo json_encode(['error' => '質問データが見つかりません']);
}








