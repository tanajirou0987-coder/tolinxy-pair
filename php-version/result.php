<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>診断結果 - MatchTune</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .card {
            background: white;
            border-radius: 24px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .result-header {
            text-align: center;
            margin-bottom: 32px;
        }
        .result-header h1 {
            font-size: 32px;
            margin-bottom: 16px;
            color: #2c3e50;
        }
        .score-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .percentile-large {
            font-size: 64px;
            font-weight: 900;
            color: #2c3e50;
            line-height: 1;
        }
        .score-small {
            font-size: 24px;
            color: #7f8c8d;
            margin-top: 8px;
        }
        .rank-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
        }
        .rank-ss { background: #ffd700; color: #000; }
        .rank-s { background: #c0c0c0; color: #000; }
        .rank-a { background: #cd7f32; color: #fff; }
        .rank-b { background: #4169e1; color: #fff; }
        .rank-c { background: #228b22; color: #fff; }
        .rank-d { background: #ffa500; color: #000; }
        .rank-e { background: #ff6347; color: #fff; }
        .rank-f { background: #8b0000; color: #fff; }
        .rank-g { background: #2f2f2f; color: #fff; }
        .rank-image {
            width: 100%;
            max-width: 600px;
            height: auto;
            border-radius: 16px;
            margin: 24px auto;
            display: block;
        }
        .type-card {
            background: #f8f9fa;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 16px;
        }
        .type-card h3 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #2c3e50;
        }
        .type-card p {
            color: #7f8c8d;
            line-height: 1.6;
        }
        .compatibility-message {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 16px;
            text-align: center;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-primary {
            background: #3498db;
            color: white;
        }
        .btn-primary:hover {
            background: #2980b9;
        }
        .btn-secondary {
            background: #95a5a6;
            color: white;
        }
        .btn-secondary:hover {
            background: #7f8c8d;
        }
        .result-actions {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 32px;
        }
        .share-section {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 2px solid #ecf0f1;
        }
        .share-section h3 {
            text-align: center;
            margin-bottom: 24px;
            color: #2c3e50;
        }
        .share-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .share-card {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            overflow-y: auto;
        }
        .share-card.active {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .share-card-content {
            background: white;
            border-radius: 24px;
            padding: 32px;
            max-width: 500px;
            width: 100%;
            position: relative;
        }
        .share-card-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        .share-image-preview {
            width: 100%;
            max-width: 320px;
            margin: 0 auto 24px;
            border-radius: 16px;
            overflow: hidden;
        }
        .share-image-preview img {
            width: 100%;
            height: auto;
        }
        .hidden-card {
            position: absolute;
            left: -9999px;
            top: 0;
            width: 1080px;
            height: 1920px;
        }
        @media (max-width: 768px) {
            .card {
                padding: 20px;
            }
            .percentile-large {
                font-size: 48px;
            }
            .score-small {
                font-size: 20px;
            }
            .result-actions {
                flex-direction: column;
            }
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="result-header">
                <h1>診断結果</h1>
                <div class="score-display">
                    <div class="percentile-large" id="percentileDisplay">読み込み中...</div>
                    <div class="score-small" id="scoreDisplay"></div>
                    <div class="rank-badge" id="rankBadge"></div>
                </div>
            </div>
            
            <img id="rankImage" class="rank-image" src="" alt="ランク画像" style="display: none;">
            
            <div class="type-card">
                <h3 id="userTypeName">読み込み中...</h3>
                <p id="userTypeDesc"></p>
            </div>
            
            <div class="type-card">
                <h3 id="partnerTypeName">読み込み中...</h3>
                <p id="partnerTypeDesc"></p>
            </div>
            
            <div class="compatibility-message" id="compatibilityMessage"></div>
            
            <div class="share-section">
                <h3>結果をシェアしよう</h3>
                <div class="share-buttons">
                    <button class="btn btn-primary" onclick="copyShareText()">URLをコピー</button>
                    <button class="btn btn-secondary" onclick="downloadShareImage()">画像をダウンロード</button>
                </div>
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary" onclick="window.location.href='index.php'">もう一度診断する</button>
                <button class="btn btn-secondary" onclick="window.location.href='index.php'">ホームに戻る</button>
            </div>
        </div>
    </div>
    
    <!-- 非表示の画像生成用カード -->
    <div id="downloadCard" class="hidden-card">
        <div style="width: 1080px; height: 1920px; background: #06030f; padding: 40px; display: flex; flex-direction: column; color: white;">
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 12px; letter-spacing: 0.35em; color: rgba(255,255,255,0.8);">MatchTune Type</p>
                <p style="font-size: 32px; font-weight: 600; margin: 8px 0;">MatchTune</p>
            </div>
            <div style="flex: 1.3; min-height: 0; border-radius: 28px; overflow: hidden; background: rgba(0,0,0,0.4); margin-bottom: 20px;">
                <img id="downloadRankImage" src="" alt="ランク画像" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div style="border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.4); padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span style="font-size: 10px; letter-spacing: 0.35em; color: rgba(255,255,255,0.8);">Love Score</span>
                    <span id="downloadPercentile" style="border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.15); padding: 8px 16px; font-size: 12px; font-weight: 600;"></span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <p id="downloadScore" style="font-size: 72px; font-weight: 900; line-height: 1; margin: 0;">0</p>
                        <p style="font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.7);">points</p>
                    </div>
                    <div style="text-align: right;">
                        <p id="downloadRank" style="font-size: 32px; font-weight: 900; margin: 0;"></p>
                        <p id="downloadTier" style="font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.9);"></p>
                        <p id="downloadRankName" style="font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8);"></p>
                    </div>
                </div>
            </div>
            <div style="border-radius: 20px; border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.3); padding: 16px; margin-bottom: 20px;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.7); margin: 0 0 8px 0;">Pair</p>
                <p id="downloadPair" style="font-size: 20px; font-weight: 600; margin: 0;"></p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.35em; color: rgba(255,255,255,0.9);">
                <span>matchtune.app</span>
                <span>tap to try</span>
            </div>
        </div>
    </div>
    
    <script src="assets/js/config.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const pairCode = urlParams.get('pair');
        const API_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'api';
        
        let resultData = null;
        
        if (!pairCode) {
            document.querySelector('.card').innerHTML = '<p>ペアコードが指定されていません</p>';
        } else {
            fetch(`${API_BASE}/result.php?pair_code=${pairCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.querySelector('.card').innerHTML = `<p>${data.error}</p>`;
                    } else {
                        resultData = data;
                        displayResult(data);
                    }
                })
                .catch(error => {
                    console.error('エラー:', error);
                    document.querySelector('.card').innerHTML = '<p>結果の取得に失敗しました</p>';
                });
        }
        
        function displayResult(data) {
            const user = data.user_type;
            const partner = data.partner_type;
            const compatibility = data.compatibility;
            
            // パーセンタイルとスコアを表示
            const percentileText = compatibility.percentileText || `上位${compatibility.percentile || 50}%`;
            document.getElementById('percentileDisplay').textContent = percentileText;
            document.getElementById('scoreDisplay').textContent = `(${compatibility.total || data.total_score}点)`;
            
            // ランクバッジ
            const rank = compatibility.rank || data.rank;
            const rankInfo = getRankInfo(compatibility.percentile || 50);
            document.getElementById('rankBadge').textContent = `${rankInfo.tier} ・ ${rankInfo.rankName}`;
            document.getElementById('rankBadge').className = `rank-badge rank-${rank.toLowerCase()}`;
            
            // ランク画像
            const rankImagePath = getRankImagePath(rank);
            if (rankImagePath) {
                const rankImg = document.getElementById('rankImage');
                rankImg.src = rankImagePath;
                rankImg.style.display = 'block';
            }
            
            // タイプ情報
            document.getElementById('userTypeName').textContent = user.name || 'あなたのタイプ';
            document.getElementById('userTypeDesc').textContent = user.description || '';
            
            document.getElementById('partnerTypeName').textContent = partner.name || 'パートナーのタイプ';
            document.getElementById('partnerTypeDesc').textContent = partner.description || '';
            
            // 相性メッセージ
            document.getElementById('compatibilityMessage').textContent = compatibility.message || '相性診断結果';
            
            // ダウンロード用カードの更新
            updateDownloadCard(data, compatibility, rankInfo, rankImagePath);
        }
        
        function getRankInfo(percentile) {
            if (percentile <= 1) return { rank: 'SS', rankName: 'ベストリア', tier: 'SSランク' };
            if (percentile <= 10) return { rank: 'S', rankName: 'リンクス', tier: 'Sランク' };
            if (percentile <= 20) return { rank: 'A', rankName: 'グットン', tier: 'Aランク' };
            if (percentile <= 30) return { rank: 'B', rankName: 'ライトム', tier: 'Bランク' };
            if (percentile <= 40) return { rank: 'C', rankName: 'フリカ', tier: 'Cランク' };
            if (percentile <= 50) return { rank: 'D', rankName: 'ラフネ', tier: 'Dランク' };
            if (percentile <= 70) return { rank: 'E', rankName: 'ミスタル', tier: 'Eランク' };
            if (percentile <= 85) return { rank: 'F', rankName: 'バグシー', tier: 'Fランク' };
            return { rank: 'G', rankName: 'ゼロナ', tier: 'Gランク' };
        }
        
        function getRankImagePath(rank) {
            const rankImages = {
                'SS': '/rank-images/bestria.jpg',
                'S': '/rank-images/lynx.jpg',
                'A': '/rank-images/goodton.jpg',
                'B': '/rank-images/lightm.jpg',
                'C': '/rank-images/frica.jpg',
                'D': '/rank-images/rafne.jpg',
                'E': '/rank-images/mistal.jpg',
                'F': '/rank-images/buggy.jpg',
                'G': '/rank-images/zerona.jpg',
            };
            return rankImages[rank] || rankImages['G'];
        }
        
        function updateDownloadCard(data, compatibility, rankInfo, rankImagePath) {
            const user = data.user_type;
            const partner = data.partner_type;
            
            document.getElementById('downloadScore').textContent = compatibility.total || data.total_score;
            document.getElementById('downloadPercentile').textContent = compatibility.percentileText || `上位${compatibility.percentile || 50}%`;
            document.getElementById('downloadRank').textContent = rankInfo.rank;
            document.getElementById('downloadTier').textContent = rankInfo.tier;
            document.getElementById('downloadRankName').textContent = rankInfo.rankName;
            document.getElementById('downloadPair').textContent = `${user.name || 'ユーザー'} × ${partner.name || 'パートナー'}`;
            
            if (rankImagePath) {
                const img = document.getElementById('downloadRankImage');
                img.src = rankImagePath;
            }
        }
        
        function copyShareText() {
            if (!resultData) {
                alert('結果データが読み込まれていません');
                return;
            }
            
            const user = resultData.user_type;
            const partner = resultData.partner_type;
            const compatibility = resultData.compatibility;
            const rankInfo = getRankInfo(compatibility.percentile || 50);
            
            const shareText = `【MatchTune診断】${user.name || 'ユーザー'} × ${partner.name || 'パートナー'} の相性：${compatibility.total || resultData.total_score}点 (${compatibility.percentileText || `上位${compatibility.percentile || 50}%`}) ${rankInfo.tier} ${rankInfo.rankName} 🎵`;
            const shareUrl = window.location.href;
            const fullText = `${shareText}\n${shareUrl}`;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(fullText).then(() => {
                    alert('URLをコピーして共有できるよ！');
                }).catch(() => {
                    fallbackCopy(fullText);
                });
            } else {
                fallbackCopy(fullText);
            }
        }
        
        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('URLをコピーして共有できるよ！');
            } catch (err) {
                alert('コピーに失敗しました。手動でコピーしてください。\n\n' + text);
            }
            document.body.removeChild(textarea);
        }
        
        async function downloadShareImage() {
            if (!resultData) {
                alert('結果データが読み込まれていません');
                return;
            }
            
            const downloadCard = document.getElementById('downloadCard');
            if (!downloadCard) {
                alert('画像生成に必要な要素が見つかりません');
                return;
            }
            
            try {
                // 画像の読み込みを待つ
                const img = document.getElementById('downloadRankImage');
                if (img && img.src) {
                    await new Promise((resolve, reject) => {
                        if (img.complete && img.naturalWidth > 0) {
                            resolve();
                        } else {
                            img.onload = () => resolve();
                            img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
                            setTimeout(() => reject(new Error('画像の読み込みがタイムアウトしました')), 10000);
                        }
                    });
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const canvas = await html2canvas(downloadCard, {
                    backgroundColor: '#06030f',
                    scale: 2,
                    width: 1080,
                    height: 1920,
                });
                
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `matchtune-${resultData.user_type.name || 'user'}-${resultData.partner_type.name || 'partner'}-${resultData.compatibility.rank || 'G'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                alert('画像をダウンロードしました！\n\nインスタグラムのストーリーズや投稿に使えます。');
            } catch (error) {
                console.error('Failed to export share card', error);
                alert(`画像の生成に失敗しました。\n\nエラー: ${error.message}\n\n画像が読み込まれるまで少し待ってから再度お試しください。`);
            }
        }
    </script>
</body>
</html>
