<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MatchTune - 相性診断</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>MatchTune</h1>
            <p class="subtitle">2人の相性を診断</p>
        </header>
        
        <main>
            <div class="card">
                <h2>診断を始める</h2>
                <p>ペアコードを生成して、2人で同時に診断を進められます。</p>
                <button id="createPairBtn" class="btn btn-primary">ペアを作成する</button>
            </div>
            
            <div id="pairCreated" class="card hidden">
                <h2>ペアコード</h2>
                <div class="pair-code-display">
                    <span id="pairCodeText" class="pair-code"></span>
                </div>
                <p>このコードを相手に共有してください</p>
                <div id="qrcode"></div>
                <p class="join-url">参加URL: <span id="joinUrl"></span></p>
                <button id="startDiagnosisBtn" class="btn btn-primary">診断を始める</button>
            </div>
            
            <div class="card">
                <h2>ペアに参加する</h2>
                <p>ペアコードを入力して参加</p>
                <input type="text" id="joinPairCode" placeholder="ペアコードを入力" maxlength="6" class="input">
                <button id="joinPairBtn" class="btn btn-secondary">参加する</button>
            </div>
        </main>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
    <script src="assets/js/config.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>

