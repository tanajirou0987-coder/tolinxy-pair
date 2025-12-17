<?php
/**
 * タイプデータ読み込み関数
 */

function getTypesData($diagnosisType = '54') {
    static $typesData = [];
    
    if (!isset($typesData[$diagnosisType])) {
        $filePath = __DIR__ . '/compatibility-54/types.json';
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            $decoded = json_decode($json, true);
            $typesData[$diagnosisType] = $decoded ?: [];
        } else {
            $typesData[$diagnosisType] = [];
        }
    }
    
    return $typesData[$diagnosisType] ?: [];
}

