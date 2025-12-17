<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>診断中 - MatchTune</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        html {
            scroll-behavior: auto !important;
            overflow-x: hidden;
        }
        body {
            overflow-x: hidden;
            position: relative;
        }
        @media (max-width: 768px) {
            html {
                scroll-behavior: auto !important;
            }
            body {
                overflow-x: hidden;
            }
        }
    </style>
    <script>
        // ページ読み込み前にスクロール位置をリセット（最優先・即座に実行・モバイル対応）
        (function() {
            try {
                if (window.history && window.history.scrollRestoration) {
                    window.history.scrollRestoration = 'manual';
                }
                // URLハッシュを削除（#topなどが残っている場合）
                if (window.location.hash) {
                    window.history.replaceState(null, null, window.location.pathname + window.location.search);
                }
                // 即座にスクロール位置をリセット（複数回実行）
                if (typeof window.scrollTo === 'function') {
                    window.scrollTo(0, 0);
                }
                if (typeof window.scroll === 'function') {
                    window.scroll(0, 0);
                }
                // DOMが存在する場合のみ実行
                if (document.documentElement) {
                    document.documentElement.scrollTop = 0;
                    document.documentElement.scrollLeft = 0;
                }
                if (document.body) {
                    document.body.scrollTop = 0;
                    document.body.scrollLeft = 0;
                }
                // 少し待ってから再度実行
                setTimeout(function() {
                    if (typeof window.scrollTo === 'function') {
                        window.scrollTo(0, 0);
                    }
                    if (document.documentElement) {
                        document.documentElement.scrollTop = 0;
                    }
                    if (document.body) {
                        document.body.scrollTop = 0;
                    }
                }, 10);
            } catch(e) {}
        })();
    </script>
</head>
<body id="top" style="scroll-margin-top: 0; margin-top: 0; padding-top: 0;">
    <div class="container">
        <header>
            <h1>MatchTune 診断</h1>
            <div class="progress-bar">
                <div id="progressFill" class="progress-fill"></div>
            </div>
            <p id="progressText" class="progress-text">0 / 54</p>
        </header>
        
        <main>
            <div id="questionCard" class="card">
                <h2 id="questionText"></h2>
                <div id="optionsContainer" class="options-container"></div>
            </div>
            
            <div id="waitingCard" class="card hidden">
                <h2>回答を待っています</h2>
                <p>相手の回答が完了するまでお待ちください...</p>
                <div class="loading-spinner"></div>
            </div>
        </main>
    </div>
    
    <script src="assets/js/config.js"></script>
    <script>
        // スクロール位置を確実にトップに戻す関数（スマホ対応強化版）
        function scrollToTop() {
            // すべての方法でスクロール
            window.scrollTo(0, 0);
            window.scroll(0, 0);
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
                document.documentElement.scrollLeft = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
                document.body.scrollLeft = 0;
            }
            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }
            // 強制的にスクロール
            const scrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop > 0) {
                window.scrollTo(0, 0);
                window.scroll(0, 0);
            }
        }
        
        // 履歴のスクロール復元を無効化
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        // URLからハッシュを削除（#topなどが残っている場合）
        if (window.location.hash) {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
        
        // モバイルブラウザ対応：body要素に直接スタイルを適用
        if (document.body) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                if (document.body) {
                    document.body.style.overflow = '';
                }
            }, 100);
        }
        
        // 即座にスクロール（複数回実行）
        scrollToTop();
        setTimeout(scrollToTop, 0);
        setTimeout(scrollToTop, 10);
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 100);
        
        // requestAnimationFrameで確実に実行
        requestAnimationFrame(() => {
            scrollToTop();
            requestAnimationFrame(() => {
                scrollToTop();
                requestAnimationFrame(() => {
                    scrollToTop();
                });
            });
        });
        
        // ページ読み込み時に確実にトップにスクロール（複数回実行・モバイル対応）
        document.addEventListener('DOMContentLoaded', () => {
            // URLハッシュを削除
            if (window.location.hash === '#top') {
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
            }
            scrollToTop();
            setTimeout(scrollToTop, 0);
            setTimeout(scrollToTop, 50);
            setTimeout(scrollToTop, 100);
            setTimeout(scrollToTop, 200);
            setTimeout(scrollToTop, 500);
            setTimeout(scrollToTop, 1000);
        });
        window.addEventListener('load', () => {
            // URLハッシュを削除
            if (window.location.hash === '#top') {
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
            }
            scrollToTop();
            setTimeout(scrollToTop, 0);
            setTimeout(scrollToTop, 50);
            setTimeout(scrollToTop, 100);
            setTimeout(scrollToTop, 200);
            setTimeout(scrollToTop, 500);
            setTimeout(scrollToTop, 1000);
        });
        
        // ページが表示された時にも実行
        window.addEventListener('pageshow', (event) => {
            // URLハッシュを削除
            if (window.location.hash === '#top') {
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
            }
            scrollToTop();
            setTimeout(scrollToTop, 0);
            setTimeout(scrollToTop, 50);
            setTimeout(scrollToTop, 100);
            if (event.persisted) {
                setTimeout(scrollToTop, 200);
                setTimeout(scrollToTop, 500);
            }
        });
        
        // フォーカス時にもスクロール
        window.addEventListener('focus', scrollToTop);
        
        // URLパラメータから取得
        const urlParams = new URLSearchParams(window.location.search);
        const pairCode = urlParams.get('pair');
        const role = urlParams.get('role') || 'user';
        const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
        
        // APIベースパス
        const API_BASE = typeof getApiBase !== 'undefined' ? getApiBase() : '/api';
        let currentQuestion = 1;
        const TOTAL_QUESTIONS = 54;
        let questions = [];
        let answers = {};
        
        // 質問データを読み込む
        async function loadQuestions() {
            try {
                // 読み込み前に確実にトップにスクロール
                scrollToTop();
                const response = await fetch(`${API_BASE}/questions.php`);
                const data = await response.json();
                questions = data;
                // 質問を読み込む前に再度確実にトップにスクロール
                scrollToTop();
                setTimeout(() => {
                    scrollToTop();
                    loadQuestion(1);
                }, 150);
            } catch (error) {
                console.error('質問の読み込みエラー:', error);
                alert('質問の読み込みに失敗しました');
            }
        }
        
        // 質問を表示
        function loadQuestion(qId) {
            const question = questions.find(q => q.id === qId);
            if (!question) {
                checkCompletion();
                return;
            }
            
            // まず確実にトップにスクロール（複数回実行）
            scrollToTop();
            requestAnimationFrame(() => {
                scrollToTop();
            });
            
            document.getElementById('questionText').textContent = question.text;
            const container = document.getElementById('optionsContainer');
            container.innerHTML = '';
            
            question.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option.label;
                btn.onclick = () => selectAnswer(qId, option.score);
                container.appendChild(btn);
            });
            
            updateProgress();
            
            // 複数回トップにスクロール（確実にするため）
            requestAnimationFrame(() => {
                scrollToTop();
                setTimeout(scrollToTop, 50);
                setTimeout(scrollToTop, 100);
                setTimeout(scrollToTop, 200);
                setTimeout(scrollToTop, 400);
            });
        }
        
        // 回答を選択
        async function selectAnswer(qId, score) {
            answers[qId] = score;
            
            try {
                await fetch(`${API_BASE}/save-answer.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pair_code: pairCode,
                        device_id: deviceId,
                        question_id: qId,
                        answer_value: score
                    })
                });
                
                if (qId < TOTAL_QUESTIONS) {
                    loadQuestion(qId + 1);
                } else {
                    // 全問回答完了
                    await markComplete();
                    checkCompletion();
                }
            } catch (error) {
                console.error('回答保存エラー:', error);
                alert('回答の保存に失敗しました');
            }
        }
        
        // 完了をマーク
        async function markComplete() {
            // 完了フラグを送信（check-resultで自動判定されるため、ここでは不要）
        }
        
        // 完了状況をチェック
        async function checkCompletion() {
            document.getElementById('questionCard').classList.add('hidden');
            document.getElementById('waitingCard').classList.remove('hidden');
            
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE}/check-result.php?pair_code=${pairCode}`);
                    const data = await response.json();
                    
                    if (data.ready_for_result) {
                        clearInterval(interval);
                        // 結果生成
                        await generateResult();
                        // 結果ページへ遷移
                        window.location.href = `result.php?pair=${pairCode}`;
                    }
                } catch (error) {
                    console.error('チェックエラー:', error);
                }
            }, 3000);
        }
        
        // 結果生成
        async function generateResult() {
            try {
                await fetch(`${API_BASE}/generate-result.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pair_code: pairCode })
                });
            } catch (error) {
                console.error('結果生成エラー:', error);
            }
        }
        
        // 進捗更新
        function updateProgress() {
            const answered = Object.keys(answers).length;
            const percent = (answered / TOTAL_QUESTIONS) * 100;
            document.getElementById('progressFill').style.width = percent + '%';
            document.getElementById('progressText').textContent = `${answered} / ${TOTAL_QUESTIONS}`;
        }
        
        // 初期化
        loadQuestions();
        
        // 定期的にトップにスクロール（念のため、スマホ対応・モバイル強化）
        let scrollCheckCount = 0;
        let scrollCheckInterval = setInterval(() => {
            scrollCheckCount++;
            const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop > 0) {
                scrollToTop();
                // モバイルブラウザでは、より積極的にスクロール
                if (scrollTop > 10) {
                    // 強制的にbody要素のスクロール位置をリセット
                    if (document.body) {
                        document.body.scrollTop = 0;
                    }
                    if (document.documentElement) {
                        document.documentElement.scrollTop = 0;
                    }
                }
            }
            // 15秒間チェック（モバイルでも確実に）
            if (scrollCheckCount >= 300) { // 50ms * 300 = 15秒
                clearInterval(scrollCheckInterval);
            }
        }, 50);
    </script>
</body>
</html>
