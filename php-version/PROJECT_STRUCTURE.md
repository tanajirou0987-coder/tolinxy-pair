# MatchTune PHP版 - プロジェクト構造

## 📁 ディレクトリ構造

```
php-version/
│
├── api/                          # APIエンドポイント
│   ├── create-pair.php          # POST: ペアコード生成
│   ├── join-pair.php            # POST: ペア参加確認
│   ├── save-answer.php          # POST: 回答保存
│   ├── check-result.php         # GET: 完了状況チェック
│   ├── generate-result.php      # POST: 結果生成
│   ├── result.php               # GET: 結果取得
│   └── questions.php            # GET: 質問データ取得
│
├── assets/                       # 静的ファイル
│   ├── css/
│   │   └── style.css            # スタイルシート
│   └── js/
│       ├── config.js            # 設定（APIパスなど）
│       └── app.js               # メインJavaScript
│
├── config/                       # 設定ファイル
│   ├── config.php               # アプリケーション設定
│   ├── database.php             # データベース接続（編集必要）
│   └── config.example.php       # 設定ファイルのサンプル
│
├── data/                         # データファイル
│   ├── compatibility-54/        # 54問診断データ
│   │   ├── questions.json       # 質問データ（54問）
│   │   ├── types.json           # タイプデータ（27タイプ）
│   │   └── compatibility.json   # 相性データ
│   ├── types.php                # タイプデータ読み込み関数
│   └── compatibility.php         # 相性データ読み込み関数
│
├── database/                     # データベース
│   └── schema.sql               # テーブル定義SQL
│
├── lib/                          # ライブラリ
│   └── calculate.php            # 診断ロジック（スコア計算、タイプ判定）
│
├── logs/                         # ログファイル
│   └── .gitkeep                 # Git管理用
│
├── index.php                     # トップページ（ペア作成・参加）
├── diagnosis.php                # 診断画面（54問回答）
├── join.php                      # 参加画面（QRコード読み取り後）
├── result.php                    # 結果表示画面
├── .htaccess                     # Apache設定
├── .gitignore                    # Git除外設定
├── README.md                     # プロジェクト説明
├── INSTALL.md                    # インストールガイド
└── PROJECT_STRUCTURE.md          # このファイル
```

## 🔄 データフロー

### 1. ペア作成フロー
```
index.php
  ↓ (create-pair.php)
pairs テーブルにレコード作成
  ↓
ペアコード + QRコード表示
  ↓
診断開始ボタン
  ↓
diagnosis.php?pair=XXX&role=user
```

### 2. ペア参加フロー
```
join.php?pair=XXX
  ↓ (join-pair.php)
ペアコード検証
  ↓
diagnosis.php?pair=XXX&role=partner
```

### 3. 診断フロー
```
diagnosis.php
  ↓ (questions.php)
質問データ読み込み
  ↓
回答選択
  ↓ (save-answer.php)
answers テーブルに保存
  ↓ (check-result.php)
3秒ごとに完了状況チェック
  ↓
両端末完了を検知
  ↓ (generate-result.php)
結果生成・results テーブルに保存
  ↓
result.php?pair=XXX
```

## 📊 データベーススキーマ

### pairs テーブル
- `id`: 主キー
- `pair_code`: ペアコード（6桁、ユニーク）
- `created_at`: 作成日時

### answers テーブル
- `id`: 主キー
- `pair_code`: ペアコード（外部キー）
- `device_id`: デバイスID（UUID）
- `question_id`: 質問ID（1-54）
- `answer_value`: 回答値（スコア）
- `updated_at`: 更新日時
- ユニーク制約: (pair_code, device_id, question_id)

### results テーブル
- `id`: 主キー
- `pair_code`: ペアコード
- `user_type`: ユーザータイプコード
- `partner_type`: パートナータイプコード
- `user_score1/2/3`: ユーザーの3軸スコア
- `partner_score1/2/3`: パートナーの3軸スコア
- `total_score`: 相性スコア
- `rank`: ランク（S/A/B/C/D）
- `summary`: 結果詳細（JSON）
- `created_at`: 作成日時

## 🔌 APIエンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/api/create-pair.php` | ペアコード生成 |
| POST | `/api/join-pair.php` | ペア参加確認 |
| POST | `/api/save-answer.php` | 回答保存 |
| GET | `/api/check-result.php` | 完了状況チェック |
| POST | `/api/generate-result.php` | 結果生成 |
| GET | `/api/result.php` | 結果取得 |
| GET | `/api/questions.php` | 質問データ取得 |

## 🎨 フロントエンド画面

1. **index.php** - トップページ
   - ペア作成ボタン
   - ペアコード表示
   - QRコード表示
   - ペア参加フォーム

2. **diagnosis.php** - 診断画面
   - 質問表示
   - 選択肢ボタン
   - 進捗バー
   - 自動同期（Polling）

3. **join.php** - 参加画面
   - ペアコード検証
   - 自動リダイレクト

4. **result.php** - 結果画面
   - 診断結果表示
   - タイプ情報
   - 相性スコア

## 🔐 セキュリティ対策

- SQLインジェクション: プリペアドステートメント使用
- XSS: 出力時のエスケープ（必要に応じて実装）
- CSRF: 必要に応じてトークン実装
- セッション管理: device_idをlocalStorageで管理

## 📝 注意事項

- PHP 7.4以上が必要
- MySQL 5.7以上が必要
- `logs/`ディレクトリは書き込み可能である必要がある
- JSONファイルはUTF-8エンコーディングである必要がある













