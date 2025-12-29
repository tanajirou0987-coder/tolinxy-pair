# MatchTune PHP版 - インストールガイド

## 📦 必要なファイル

Xserverにアップロードする前に、以下のファイルが揃っているか確認してください：

```
php-version/
├── api/                    ✅
├── assets/                 ✅
├── config/                 ✅（database.phpを編集）
├── data/                   ✅（JSONファイルを配置）
├── database/               ✅（schema.sqlを実行）
├── lib/                    ✅
├── logs/                   ✅（作成が必要）
├── index.php               ✅
├── diagnosis.php           ✅
├── join.php                ✅
├── result.php              ✅
└── .htaccess               ✅
```

## 🔧 セットアップ手順

### ステップ1: データベースの作成

1. Xserverのコントロールパネルにログイン
2. 「データベース」→「MySQLデータベース作成」
3. データベース名、ユーザー名、パスワードを設定
4. phpMyAdminにアクセス
5. `database/schema.sql`の内容を実行

### ステップ2: 設定ファイルの編集

`config/database.php`を開き、以下を編集：

```php
define('DB_HOST', 'localhost');
define('DB_NAME', '実際のデータベース名');
define('DB_USER', '実際のユーザー名');
define('DB_PASS', '実際のパスワード');
```

### ステップ3: ファイルのアップロード

FTPまたはSSHで以下のディレクトリにアップロード：

```
public_html/matchtune/  (または任意のディレクトリ)
```

### ステップ4: パーミッション設定

SSHまたはFTPクライアントで：

```bash
chmod 755 logs/
```

### ステップ5: 動作確認

ブラウザで `https://yourdomain.com/matchtune/index.php` にアクセス

## ✅ チェックリスト

- [ ] データベースが作成されている
- [ ] schema.sqlが実行されている
- [ ] database.phpの設定が正しい
- [ ] すべてのファイルがアップロードされている
- [ ] logs/ディレクトリが存在し、書き込み可能
- [ ] data/compatibility-54/内のJSONファイルが存在する
- [ ] .htaccessファイルが存在する

## 🐛 よくある問題

### 「データベース接続に失敗しました」
→ `config/database.php`の設定を確認

### 「質問データが見つかりません」
→ `data/compatibility-54/questions.json`が存在するか確認

### 「ペアコードの作成に失敗しました」
→ データベースの`pairs`テーブルが作成されているか確認

### QRコードが表示されない
→ インターネット接続を確認（CDNを使用）

## 📞 サポート

エラーが発生した場合、`logs/error.log`を確認してください。



















