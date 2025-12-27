# WordPressとVercel統合ガイド

このドキュメントでは、トリンクシーのふたり診断アプリをVercelにデプロイして、WordPressサイトに統合する方法を説明します。

## 📋 目次

1. [統合方法の選択](#統合方法の選択)
2. [Vercelへのデプロイ](#vercelへのデプロイ)
3. [WordPressへの統合方法](#wordpressへの統合方法)
4. [設定とカスタマイズ](#設定とカスタマイズ)
5. [トラブルシューティング](#トラブルシューティング)

---

## 統合方法の選択

WordPressサイトにNext.jsアプリを統合する方法は、主に以下の3つがあります。

### 方法1: iframeで埋め込む（最も簡単）

**メリット:**
- ✅ 最も簡単で迅速に実装できる
- ✅ WordPressとNext.jsアプリが完全に分離されている
- ✅ 互いに影響を与えない

**デメリット:**
- ❌ SEOにやや不利（検索エンジンがiframe内を完全にインデックスしない場合がある）
- ❌ モバイルでの表示がやや制限される場合がある

**おすすめ:** 初めて統合する場合、または迅速に実装したい場合

### 方法2: サブディレクトリでホスト（推奨）

**メリット:**
- ✅ SEOに有利（同じドメインでホスト）
- ✅ ユーザー体験が良い（シームレスな遷移）
- ✅ モバイル対応が完璧

**デメリット:**
- ❌ 設定がやや複雑
- ❌ WordPressとNext.jsのルーティング設定が必要

**おすすめ:** 本格的に運用する場合、SEOを重視する場合

### 方法3: サブドメインでホスト

**メリット:**
- ✅ WordPressと完全に分離
- ✅ 設定が比較的簡単
- ✅ スケーラビリティが高い

**デメリット:**
- ❌ サブドメインの設定が必要
- ❌ クロスドメインの設定が必要な場合がある

**おすすめ:** 大規模なサイト、または複数のアプリをホストする場合

---

## Vercelへのデプロイ

### ステップ1: GitHubにリポジトリをプッシュ

まず、プロジェクトをGitHubにプッシュします。

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# ファイルをステージング
git add .

# コミット
git commit -m "Initial commit for Vercel deployment"

# メインブランチに切り替え
git branch -M main

# GitHubリポジトリを追加（your-usernameとyour-repo-nameを置き換え）
git remote add origin https://github.com/your-username/trinksee-pair-diagnosis.git

# プッシュ
git push -u origin main
```

### ステップ2: Vercelでプロジェクトをインポート

1. **Vercelにアクセス**
   - [https://vercel.com](https://vercel.com) にアクセス
   - アカウントを作成（GitHubアカウントでログイン推奨）

2. **プロジェクトをインポート**
   - 「Add New...」→「Project」を選択
   - GitHubリポジトリを選択
   - プロジェクト設定を確認：
     - **Framework Preset**: Next.js（自動検出される）
     - **Root Directory**: `./`（プロジェクトルート）
     - **Build Command**: `npm run build`（自動検出）
     - **Output Directory**: `.next`（自動検出）
     - **Install Command**: `npm install`（自動検出）

3. **環境変数の設定（必要に応じて）**
   - 「Environment Variables」セクションで環境変数を追加
   - 現在のプロジェクトでは特別な環境変数は不要ですが、将来的に追加する場合はここで設定

4. **デプロイ**
   - 「Deploy」をクリック
   - ビルドが完了すると、デプロイURLが表示されます
   - 例: `https://trinksee-pair-diagnosis-xxxxx.vercel.app`

### ステップ3: カスタムドメインの設定（オプション）

独自ドメインを使用する場合：

1. **Vercelダッシュボードで設定**
   - プロジェクトの「Settings」→「Domains」
   - カスタムドメインを追加
   - DNS設定の指示に従う

2. **DNS設定**
   - ドメインのDNS設定で、Vercelが指定するCNAMEレコードを追加
   - 例: `app.yourdomain.com` → `cname.vercel-dns.com`

---

## WordPressへの統合方法

### 方法1: iframeで埋め込む

#### ステップ1: WordPressページまたは投稿を作成

1. WordPressダッシュボードにログイン
2. 「固定ページ」または「投稿」→「新規追加」
3. タイトルを入力（例：「相性診断」）

#### ステップ2: iframeコードを追加

**方法A: カスタムHTMLブロックを使用（推奨）**

1. ブロックエディタで「+」をクリック
2. 「カスタムHTML」ブロックを追加
3. 以下のコードを貼り付け：

```html
<div style="width: 100%; max-width: 100%; height: 100vh; min-height: 800px;">
  <iframe 
    src="https://your-app.vercel.app" 
    style="width: 100%; height: 100%; border: none;"
    title="トリンクシーのふたり診断"
    allow="clipboard-read; clipboard-write"
    loading="lazy"
  ></iframe>
</div>
```

**方法B: ショートコードを使用**

1. テーマの`functions.php`に以下を追加：

```php
function pairly_lab_iframe_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'https://your-app.vercel.app',
        'height' => '800px',
    ), $atts);
    
    return '<div style="width: 100%; max-width: 100%; height: ' . esc_attr($atts['height']) . '; min-height: 800px;">
        <iframe 
            src="' . esc_url($atts['url']) . '" 
            style="width: 100%; height: 100%; border: none;"
            title="トリンクシーのふたり診断"
            allow="clipboard-read; clipboard-write"
            loading="lazy"
        ></iframe>
    </div>';
}
add_shortcode('pairly_lab', 'pairly_lab_iframe_shortcode');
```

2. 投稿や固定ページで以下のショートコードを使用：

```
[pairly_lab url="https://your-app.vercel.app" height="100vh"]
```

#### ステップ3: レスポンシブ対応のCSS（オプション）

テーマの`style.css`またはカスタマイザーで、以下のCSSを追加：

```css
.trinksee-container {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    min-height: 800px;
    position: relative;
    overflow: hidden;
}

.trinksee-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

/* モバイル対応 */
@media (max-width: 768px) {
    .trinksee-container {
        height: 100vh;
        min-height: 600px;
    }
}
```

### 方法2: サブディレクトリでホスト

#### ステップ1: Vercelのリバースプロキシ設定

`vercel.json`ファイルを作成（プロジェクトルートに）：

```json
{
  "rewrites": [
    {
      "source": "/app/:path*",
      "destination": "/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### ステップ2: WordPressの`.htaccess`に設定を追加

WordPressの`.htaccess`ファイルに以下を追加：

```apache
# トリンクシーのふたり診断アプリのリバースプロキシ
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# /app/ で始まるリクエストをVercelにプロキシ
RewriteCond %{REQUEST_URI} ^/app/(.*)$
RewriteRule ^app/(.*)$ https://your-app.vercel.app/$1 [P,L]

# プロキシヘッダーを設定
ProxyPassReverse /app/ https://your-app.vercel.app/
</IfModule>
```

**注意:** `mod_proxy`と`mod_rewrite`が有効になっている必要があります。

#### ステップ3: WordPressでリンクを作成

WordPressのメニューや固定ページで、以下のようにリンクを作成：

- メニュー項目: `/app/` へのリンク
- 固定ページ: `/app/` へのリダイレクト

### 方法3: サブドメインでホスト

#### ステップ1: サブドメインの設定

1. **DNS設定**
   - ドメインのDNS設定で、サブドメインのCNAMEレコードを追加
   - 例: `app.yourdomain.com` → `cname.vercel-dns.com`

2. **Vercelでカスタムドメインを設定**
   - Vercelダッシュボードで、プロジェクトの「Settings」→「Domains」
   - `app.yourdomain.com` を追加
   - DNS設定が正しく反映されるまで待つ（数分〜数時間）

#### ステップ2: WordPressからリンク

WordPressのメニューや固定ページで、サブドメインへのリンクを作成：

```html
<a href="https://app.yourdomain.com" target="_blank" rel="noopener noreferrer">
  相性診断を始める
</a>
```

または、同じウィンドウで開く場合：

```html
<a href="https://app.yourdomain.com">
  相性診断を始める
</a>
```

---

## 設定とカスタマイズ

### CORS設定（必要に応じて）

WordPressとNext.jsアプリが異なるドメインでホストされる場合、CORS設定が必要な場合があります。

`next.config.ts`に以下を追加：

```typescript
const nextConfig: NextConfig = {
  // ... 既存の設定
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://your-wordpress-site.com', // WordPressサイトのURL
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};
```

### iframeのセキュリティ設定

WordPress側で、iframeのセキュリティを強化する場合：

```html
<iframe 
  src="https://your-app.vercel.app" 
  style="width: 100%; height: 100%; border: none;"
  title="Pairly Lab 相性診断"
  allow="clipboard-read; clipboard-write"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
  loading="lazy"
></iframe>
```

### パフォーマンス最適化

#### 1. 遅延読み込み

iframeに`loading="lazy"`属性を追加（上記の例を参照）

#### 2. プリロード（オプション）

WordPressの`header.php`またはテーマのカスタマイザーで：

```html
<link rel="preconnect" href="https://your-app.vercel.app">
<link rel="dns-prefetch" href="https://your-app.vercel.app">
```

---

## トラブルシューティング

### 問題1: iframeが表示されない

**原因:**
- X-Frame-Optionsヘッダーが設定されている
- Content Security Policy (CSP)がブロックしている

**解決方法:**

1. **Vercel側の設定を確認**
   - `next.config.ts`で、X-Frame-Optionsを確認
   - 必要に応じて削除または`SAMEORIGIN`に設定

2. **WordPress側の設定を確認**
   - セキュリティプラグインがiframeをブロックしていないか確認
   - CSP設定を確認

### 問題2: モバイルで表示が崩れる

**原因:**
- iframeのサイズ設定が不適切
- ビューポートの設定が不適切

**解決方法:**

1. **iframeのスタイルを調整**
   ```html
   <div style="width: 100%; max-width: 100%; height: 100vh; min-height: 800px; overflow: hidden;">
     <iframe 
       src="https://your-app.vercel.app" 
       style="width: 100%; height: 100%; border: none;"
       title="トリンクシーのふたり診断"
     ></iframe>
   </div>
   ```

2. **Next.jsアプリ側のビューポート設定を確認**
   - `src/app/layout.tsx`で、ビューポートメタタグが正しく設定されているか確認

### 問題3: セッションが保持されない

**原因:**
- クロスドメインでCookieが共有されていない
- セッションストレージがiframe内で正しく動作していない

**解決方法:**

1. **セッション管理を確認**
   - Next.jsアプリで、セッションストレージを使用している場合、iframe内でも動作するはずです
   - 問題が続く場合は、URLパラメータでセッションIDを渡す方法を検討

2. **Cookie設定を確認**
   - 同じドメインでホストする場合（サブディレクトリ）、Cookieは自動的に共有されます
   - 異なるドメインの場合、明示的な設定が必要な場合があります

### 問題4: ビルドエラーが発生する

**原因:**
- 依存関係の問題
- 環境変数の不足
- TypeScriptのエラー

**解決方法:**

1. **ローカルでビルドを確認**
   ```bash
   npm run build
   ```

2. **Vercelのビルドログを確認**
   - Vercelダッシュボードで、ビルドログを確認
   - エラーメッセージに従って修正

3. **環境変数を確認**
   - Vercelダッシュボードで、環境変数が正しく設定されているか確認

---

## 次のステップ

統合が完了したら、以下を確認してください：

- [ ] Vercelでアプリが正常にデプロイされている
- [ ] WordPressサイトでアプリが正しく表示される
- [ ] モバイルデバイスで表示が正しい
- [ ] 診断機能が正常に動作する
- [ ] セッション管理が正しく動作する
- [ ] SEO設定（必要に応じて）

---

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [WordPress Codex](https://codex.wordpress.org/)
- [iframe Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)

---

**最終更新日**: 2024年12月

