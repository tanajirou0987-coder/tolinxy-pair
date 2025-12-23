-- MatchTune 相性診断アプリ データベーススキーマ
-- Xserver MySQL用

-- ペア情報テーブル
CREATE TABLE IF NOT EXISTS pairs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pair_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pair_code (pair_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 回答データテーブル
CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pair_code VARCHAR(10) NOT NULL,
  device_id VARCHAR(64) NOT NULL,
  question_id INT NOT NULL,
  answer_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_answer (pair_code, device_id, question_id),
  INDEX idx_pair_device (pair_code, device_id),
  INDEX idx_pair_code (pair_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 診断結果テーブル
CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pair_code VARCHAR(10) NOT NULL,
  user_type VARCHAR(100),
  partner_type VARCHAR(100),
  user_score1 INT,
  user_score2 INT,
  user_score3 INT,
  partner_score1 INT,
  partner_score2 INT,
  partner_score3 INT,
  total_score INT,
  rank VARCHAR(10),
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pair_code (pair_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












