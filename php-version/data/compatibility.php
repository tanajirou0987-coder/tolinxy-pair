<?php
/**
 * 相性データ読み込み関数
 */

function getCompatibilityData() {
    static $compatibilityData = null;
    
    if ($compatibilityData === null) {
        $filePath = __DIR__ . '/compatibility-54/compatibility.json';
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            $decoded = json_decode($json, true);
            $compatibilityData = $decoded ?: [];
        } else {
            $compatibilityData = [];
        }
    }
    
    return $compatibilityData ?: [];
}

