# WordPress統合 クイックスタートガイド

このガイドでは、**最短5分で**トリンクシーのふたり診断アプリをWordPressサイトに統合する方法を説明します。

## 🚀 最短手順（5分）

### ステップ1: Vercelにデプロイ（2分）

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Vercelでインポート**
   - [vercel.com](https://vercel.com) にアクセス
   - 「Add New...」→「Project」
   - GitHubリポジトリを選択
   - 「Deploy」をクリック

3. **デプロイURLをコピー**
   - 例: `https://match-tune-xxxxx.vercel.app`

### ステップ2: WordPressに埋め込む（3分）

#### 方法A: カスタムHTMLブロック（最も簡単）

1. WordPressダッシュボードにログイン
2. 「固定ページ」→「新規追加」
3. タイトルを入力（例：「相性診断」）
4. 「+」をクリック → 「カスタムHTML」を選択
5. 以下のコードを貼り付け（`YOUR_VERCEL_URL`を置き換え）：

```html
<div style="width: 100%; height: 100vh; min-height: 800px;">
  <iframe 
    src="YOUR_VERCEL_URL" 
    style="width: 100%; height: 100%; border: none;"
    title="トリンクシーのふたり診断"
    loading="lazy"
  ></iframe>
</div>
```

6. 「公開」をクリック

#### 方法B: ショートコードプラグイン（推奨）

1. **プラグインをインストール**
   - `docs/wordpress-plugin-example.php` をコピー
   - WordPressの `wp-content/plugins/` に `trinksee-integration` フォルダを作成
   - `trinksee-integration.php` として保存
   - WordPressダッシュボードでプラグインを有効化

2. **設定を更新**
   - 「設定」→「トリンクシー」
   - VercelのURLを入力
   - 「設定を保存」

3. **ショートコードを使用**
   - 投稿や固定ページで `[pairly_lab]` と入力
   - 公開

## ✅ 確認事項

- [ ] Vercelでアプリが正常にデプロイされている
- [ ] WordPressページでアプリが表示される
- [ ] モバイルで表示が正しい
- [ ] 診断機能が動作する

## 🔧 トラブルシューティング

### iframeが表示されない

**解決方法:**
1. `next.config.ts` の `X-Frame-Options` を確認
2. WordPressのセキュリティプラグインを確認

### モバイルで表示が崩れる

**解決方法:**
iframeの高さを `100vh` に設定：

```html
<div style="width: 100%; height: 100vh; min-height: 800px;">
```

## 📚 詳細な手順

より詳しい手順やカスタマイズ方法は、[WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) を参照してください。

---

**所要時間**: 約5分  
**難易度**: ⭐☆☆☆☆（初心者向け）

