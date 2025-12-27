# トリンクシーのふたり診断

**「2人の音色、調べてみる？」**

科学的に性格を測定して、MBTIレベルの精度で相性を診断するアプリケーション。

## プロジェクト概要

- **アプリ名**: トリンクシーのふたり診断
- **キャッチコピー**: 「2人の音色、調べてみる？」
- **目的**: 科学的に性格を測定して、MBTIレベルの精度で相性を診断

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Vercel Postgres** (データベース)
- **Vercel** (ホスティング)

## デザイン方針

- **カラー**: ネイビー（#2C3E50）、ゴールド（#F39C12）、ホワイト
- **フォント**: LINE Seed JP（日本語）、Montserrat（英語）
- **スタイル**: シンプルでモダン、余白を多く
- **レスポンシブ対応**: スマホファースト

## 要件定義

詳細な要件定義は [REQUIREMENTS.md](./REQUIREMENTS.md) を参照してください。

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## 利用可能なコマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build

# 本番サーバーを起動
npm run start

# コードの品質チェック
npm run lint
```

## shadcn/ui コンポーネントの追加

```bash
# コンポーネントを追加する例
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## プロジェクト構造

```
match-tune/
├── src/
│   ├── app/          # App Router のページとレイアウト
│   ├── components/   # React コンポーネント
│   │   └── ui/       # shadcn/ui コンポーネント
│   └── lib/          # ユーティリティ関数
├── public/           # 静的ファイル
└── package.json
```

## デプロイ

### Vercelへのデプロイ手順

#### 方法1: GitHub経由（推奨）

1. **GitHubにリポジトリをプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/match-tune.git
   git push -u origin main
   ```

2. **Vercelでプロジェクトをインポート**
   - [Vercel](https://vercel.com)にアクセス
   - 「Add New...」→「Project」を選択
   - GitHubリポジトリを選択
   - プロジェクト設定を確認（自動検出される）
   - 「Deploy」をクリック

3. **自動デプロイ**
   - ビルドが完了すると自動的にデプロイされます
   - デプロイURLが表示されます

#### 方法2: Vercel CLI経由

1. **Vercel CLIをインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **デプロイ**
   ```bash
   vercel
   ```
   - 初回は設定を聞かれます（すべてEnterでOK）
   - 本番環境にデプロイする場合は `vercel --prod`

### 環境変数の設定

Vercelダッシュボードで環境変数を設定する場合：

1. プロジェクトの「Settings」→「Environment Variables」
2. 必要な環境変数を追加
3. 再デプロイ

### デプロイ後の確認事項

- [ ] ビルドが成功しているか確認
- [ ] 本番環境で動作確認
- [ ] カスタムドメインの設定（必要に応じて）
- [ ] 環境変数の設定確認

詳細は [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
