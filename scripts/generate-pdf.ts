import puppeteer from 'puppeteer';
import { join } from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第7回課題</title>
    <style>
        @page {
            margin: 1.5cm;
        }
        body {
            font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #000;
        }
        .date {
            text-align: right;
            margin-bottom: 0.5em;
        }
        .title {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin: 1em 0;
        }
        .info {
            text-align: right;
            margin-bottom: 0.3em;
        }
        .content {
            margin-top: 1em;
            white-space: pre-wrap;
            font-size: 10pt;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="date">2025.11.17</div>
    
    <div class="title">第7回課題</div>
    
    <div class="info">経営学部キャリアマネジメント学科</div>
    <div class="info">2310190099</div>
    <div class="info">黒木 凜</div>
    
    <div class="content">1. グルテンフリーきのこの山、たけのこの里



なぜなら、小学校の時とかアレルギーで1人だけ同じものが食べられない子とかがいたので、そういう子が食べれるお菓子って少ないと思ったから。

2. 発散技法と収束技法を分けて行う理由は 思考の質を高めるために、目的が正反対だから です。

発散技法は「できるだけ多く・自由にアイデアを出す」段階で、批判や評価をすると発想が止まってしまいます。

収束技法は「出たアイデアを選び、絞り込む」段階で、冷静な評価が必要になります。

つまり、

発散中に評価すると創造性が下がる

収束中に自由発想をすると決めきれない

ため、アイデアを"広げる時間"と"選ぶ時間"を分けて、どちらも最大限の効果を出すために分離する必要があるのです。</div>
</body>
</html>`;

async function generatePDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfPath = join(process.cwd(), '第7回課題.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '1.5cm',
            right: '1.5cm',
            bottom: '1.5cm',
            left: '1.5cm'
        }
    });
    
    await browser.close();
    console.log(`PDFが生成されました: ${pdfPath}`);
}

generatePDF().catch(console.error);
