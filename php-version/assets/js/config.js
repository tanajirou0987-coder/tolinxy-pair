/**
 * アプリケーション設定
 */

// APIベースパスを自動検出
function getApiBase() {
    const path = window.location.pathname;
    // /matchtune/ が含まれている場合はサブディレクトリとして扱う
    if (path.includes('/matchtune/')) {
        const match = path.match(/^(.+?\/matchtune\/)/);
        return match ? match[1] + 'api' : '/matchtune/api';
    }
    // ルートディレクトリの場合
    return '/api';
}

const API_BASE = getApiBase();

if (typeof window !== "undefined") {
    window.__MATCH_TUNE_API_BASE = API_BASE;
}















