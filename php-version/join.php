<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ペアに参加 - MatchTune</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>MatchTune</h1>
        </header>
        
        <main>
            <div class="card">
                <h2>ペアに参加</h2>
                <p id="statusText">ペアコードを確認中...</p>
                <div id="loadingSpinner" class="loading-spinner"></div>
            </div>
        </main>
    </div>
    
    <script src="assets/js/config.js"></script>
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const pairCode = urlParams.get('pair');
        const API_BASE = typeof getApiBase !== 'undefined' ? getApiBase() : '/api';
        
        if (!pairCode) {
            document.getElementById('statusText').textContent = 'ペアコードが指定されていません';
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 2000);
        } else {
            // ペアコードの検証
            fetch(`${API_BASE}/join-pair.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pair_code: pairCode })
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    localStorage.setItem('current_pair_code', pairCode);
                    // トップにスクロールしてから遷移（確実に実行・複数回）
                    (function() {
                        window.scrollTo(0, 0);
                        window.scroll(0, 0);
                        if (document.documentElement) {
                            document.documentElement.scrollTop = 0;
                        }
                        if (document.body) {
                            document.body.scrollTop = 0;
                        }
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                            window.scroll(0, 0);
                        }, 50);
                    })();
                    // 少し待ってから遷移（スクロール位置が確実にリセットされる）
                    setTimeout(() => {
                        // 遷移前に再度スクロール
                        window.scrollTo(0, 0);
                        window.scroll(0, 0);
                        const timestamp = Date.now();
                        // モバイル対応：URLに#topを追加してから遷移
                        // location.replaceで履歴をクリアして遷移（スクロール位置がリセットされる）
                        window.location.replace(`diagnosis.php?pair=${pairCode}&role=partner&_t=${timestamp}#top`);
                    }, 300);
                } else {
                    document.getElementById('statusText').textContent = '無効なペアコードです';
                    document.getElementById('loadingSpinner').classList.add('hidden');
                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('エラー:', error);
                document.getElementById('statusText').textContent = 'エラーが発生しました';
                document.getElementById('loadingSpinner').classList.add('hidden');
            });
        }
    </script>
</body>
</html>

