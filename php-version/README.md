# MatchTune PHP版 - セットアップガイド

## 📋 概要

Next.js版から移行したPHP + MySQL構成の相性診断アプリです。
Xserver上で動作するように設計されています。

## 🗂 ディレクトリ構造

```
php-version/
├── api/                    # APIエンドポイント
│   ├── create-pair.php     # ペアコード生成
│   ├── join-pair.php       # ペア参加確認
│   ├── save-answer.php     # 回答保存
│   ├── check-result.php    # 完了状況チェック
│   ├── generate-result.php # 結果生成
│   └── result.php          # 結果取得
├── assets/                 # 静的ファイル
│   ├── css/
│   │   └── style.css       # スタイルシート
│   └── js/
│       └── app.js          # メインJS
├── config/                 # 設定ファイル
│   ├── config.php          # アプリ設定
│   └── database.php        # DB接続設定
├── data/                   # データファイル
│   └── compatibility-54/   # 54問診断データ
│       ├── questions.json  # 質問データ
│       ├── types.json      # タイプデータ
│       └── compatibility.json # 相性データ
├── database/              # データベース
│   └── schema.sql          # テーブル定義
├── lib/                    # ライブラリ
│   └── calculate.php       # 診断ロジック
├── logs/                   # ログファイル（作成が必要）
├── index.php               # トップページ
├── diagnosis.php           # 診断画面
├── join.php                # 参加画面
├── result.php              # 結果画面
├── .htaccess               # Apache設定
└── README.md               # このファイル
```

## 🚀 セットアップ手順

### 1. データベースの作成

XserverのコントロールパネルからMySQLデータベースを作成し、`schema.sql`を実行してください。

```sql
-- phpMyAdminまたはコマンドラインで実行
SOURCE database/schema.sql;
```

### 2. データベース接続情報の設定

`config/database.php`を編集して、Xserverのデータベース情報を設定してください。

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');  // Xserverのデータベース名
define('DB_USER', 'your_database_user');   // Xserverのデータベースユーザー名
define('DB_PASS', 'your_database_password'); // Xserverのデータベースパスワード
```

### 3. ファイルのアップロード

すべてのファイルをXserverの公開ディレクトリ（通常は`public_html`）にアップロードしてください。

```
public_html/
  └── matchtune/  (または任意のディレクトリ名)
      └── (php-version内のすべてのファイル)
```

### 4. パーミッションの設定

`logs/`ディレクトリに書き込み権限を付与してください。

```bash
chmod 755 logs/
```

### 5. データファイルの配置

`data/compatibility-54/`ディレクトリに以下のJSONファイルを配置してください：
- `questions.json` - 質問データ
- `types.json` - タイプデータ
- `compatibility.json` - 相性データ

（Next.js版の`data/diagnoses/compatibility-54/`からコピー）

## 🔧 APIエンドポイント

### POST /api/create-pair
ペアコードを生成します。

**レスポンス:**
```json
{
  "pair_code": "A7F3K2",
  "created_at": "2024-01-01 12:00:00"
}
```

### POST /api/join-pair
ペアコードの有効性を確認します。

**リクエスト:**
```json
{
  "pair_code": "A7F3K2"
}
```

**レスポンス:**
```json
{
  "valid": true,
  "pair_code": "A7F3K2",
  "created_at": "2024-01-01 12:00:00"
}
```

### POST /api/save-answer
回答を保存します。

**リクエスト:**
```json
{
  "pair_code": "A7F3K2",
  "device_id": "xxxx-uuid",
  "question_id": 3,
  "answer_value": "2"
}
```

### GET /api/check-result?pair_code=xxx
回答完了状況をチェックします。

**レスポンス:**
```json
{
  "completed": false,
  "ready_for_result": false,
  "progress": {
    "device-id-1": 5,
    "device-id-2": 4
  },
  "total_questions": 54,
  "device_count": 2
}
```

### POST /api/generate-result
診断結果を生成します。

**リクエスト:**
```json
{
  "pair_code": "A7F3K2"
}
```

### GET /api/result?pair_code=xxx
診断結果を取得します。

## 📱 使用方法

1. **ペア作成（端末A）**
   - `index.php`にアクセス
   - 「ペアを作成する」をクリック
   - 表示されたペアコードとQRコードを相手に共有

2. **ペア参加（端末B）**
   - QRコードを読み取るか、ペアコードを入力
   - 自動的に診断画面に遷移

3. **診断**
   - 両端末で54問の質問に回答
   - 回答は自動的に保存・同期されます

4. **結果表示**
   - 両端末の回答が完了すると自動的に結果ページに遷移

## 🔒 セキュリティ

- SQLインジェクション対策：プリペアドステートメントを使用
- XSS対策：出力時のエスケープ処理
- CSRF対策：必要に応じてトークン実装を検討

## ✅ 実装済み機能

- ✅ ペアコード生成（ランダム6桁）
- ✅ QRコード生成（参加URLをエンコード）
- ✅ ペア参加（端末Bがペアコード or QR を読み取って同期する）
- ✅ 端末識別（localStorage に保存する device_id）
- ✅ 回答保存API（pair_code, device_id, question_id, answer_value）
- ✅ 回答同期（2〜3秒のPollingで /check-result を実行）
- ✅ 両端末の回答完了後に結果を自動生成（PHP側でロジック実行）
- ✅ 結果画面の表示（スコア・タイプ・ランク・パーセンタイル）
- ✅ パーセンタイル計算（上位何%か）
- ✅ ランク計算（SS/S/A/B/C/D/E/F/G）
- ✅ ランク画像表示
- ✅ シェア機能（URLコピー、画像ダウンロード）

## 📝 注意事項

- PHP 7.4以上が必要です
- `logs/`ディレクトリは自動生成されないため、手動で作成してください
- データベース接続情報は必ずXserverの設定に合わせて変更してください
- QRコード生成には外部CDN（qrcodejs）を使用しています
- 画像生成には外部CDN（html2canvas）を使用しています
- `rank-images/`フォルダにランク画像を配置する必要があります

## ⚠️ 未実装機能（オプション）

以下の機能は未実装ですが、基本的な診断機能は動作します：
- 詳細分析機能（6項目の詳細分析、改善のヒント、コミュニケーションのヒント）
- 18問診断対応（現在は54問診断のみ）

## 🐛 トラブルシューティング

### データベース接続エラー
- `config/database.php`の接続情報を確認
- Xserverのデータベースが作成されているか確認

### ファイルが見つからないエラー
- ファイルパスが正しいか確認
- `data/compatibility-54/`内のJSONファイルが存在するか確認

### 権限エラー
- `logs/`ディレクトリの書き込み権限を確認

## 📞 サポート

問題が発生した場合は、エラーログ（`logs/error.log`）を確認してください。

