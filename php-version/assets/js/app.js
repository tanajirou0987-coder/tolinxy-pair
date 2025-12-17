/**
 * MatchTune メインアプリケーション
 */

// デバイスIDの取得・生成
function getDeviceId() {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
}

const deviceId = getDeviceId();
if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.deviceId = deviceId;
}
// APIベースパス（config.jsから読み込む）
const API_BASE = typeof getApiBase !== 'undefined' ? getApiBase() : '/api';

// ペア作成
document.getElementById('createPairBtn')?.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE}/create-pair.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.pair_code) {
            const pairCode = data.pair_code;
            document.getElementById('pairCodeText').textContent = pairCode;
            
            // 参加URLを生成
            const joinUrl = `${window.location.origin}/join.php?pair=${pairCode}`;
            document.getElementById('joinUrl').textContent = joinUrl;
            
            // QRコード生成
            const qrElement = document.getElementById('qrcode');
            qrElement.innerHTML = '';
            new QRCode(qrElement, {
                text: joinUrl,
                width: 256,
                height: 256
            });
            
            // ペアコードをlocalStorageに保存
            localStorage.setItem('current_pair_code', pairCode);
            
            // UI表示切り替え
            document.getElementById('createPairBtn').closest('.card').classList.add('hidden');
            document.getElementById('pairCreated').classList.remove('hidden');
        }
    } catch (error) {
        console.error('ペア作成エラー:', error);
        alert('ペアの作成に失敗しました');
    }
});

// 診断開始
document.getElementById('startDiagnosisBtn')?.addEventListener('click', () => {
    const pairCode = localStorage.getItem('current_pair_code');
    if (pairCode) {
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
            window.location.replace(`diagnosis.php?pair=${pairCode}&role=user&_t=${timestamp}#top`);
        }, 300);
    }
});

// ペア参加
document.getElementById('joinPairBtn')?.addEventListener('click', async () => {
    const pairCode = document.getElementById('joinPairCode').value.trim().toUpperCase();
    
    if (pairCode.length !== 6) {
        alert('ペアコードは6文字です');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/join-pair.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pair_code: pairCode })
        });
        const data = await response.json();
        
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
            alert('ペアコードが見つかりません');
        }
    } catch (error) {
        console.error('参加エラー:', error);
        alert('参加に失敗しました');
    }
});

// Enterキーで参加
document.getElementById('joinPairCode')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('joinPairBtn').click();
    }
});
