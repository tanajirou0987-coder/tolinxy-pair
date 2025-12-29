<?php
/**
 * Plugin Name: Cocoon用 トリンクシー統合
 * Plugin URI: https://your-wordpress-site.com
 * Description: Cocoonテーマ専用。トリンクシーのふたり診断アプリをWordPressサイトに綺麗に統合するプラグイン
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://your-site.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cocoon-trinksee
 */

// セキュリティチェック
if (!defined('ABSPATH')) {
    exit;
}

/**
 * トリンクシーのふたり診断アプリのURLを設定
 * VercelのデプロイURLに置き換えてください
 */
define('TRINKSEE_APP_URL', 'https://app.tolynxy.com');

/**
 * ショートコード: [trinksee]
 * 
 * 使用例:
 * [trinksee]
 * [trinksee height="100vh"]
 * [trinksee url="https://custom-url.vercel.app"]
 */
function trinksee_iframe_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => TRINKSEE_APP_URL,
        'height' => '100vh',
        'min_height' => '800px',
    ), $atts);
    
    $url = esc_url($atts['url']);
    $height = esc_attr($atts['height']);
    $min_height = esc_attr($atts['min_height']);
    
    // Cocoonテーマ専用のスタイル
    $output = '<div class="trinksee-fullscreen-wrapper" style="width: 100vw; height: ' . $height . '; min-height: ' . $min_height . '; margin: 0; padding: 0; position: relative; left: 50%; transform: translateX(-50%); max-width: 100vw; overflow: hidden; box-sizing: border-box;">';
    $output .= '<iframe src="' . $url . '" style="width: 100%; height: 100%; border: none; display: block; margin: 0; padding: 0;" title="トリンクシーのふたり診断" allow="clipboard-read; clipboard-write" loading="lazy" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>';
    $output .= '</div>';
    
    return $output;
}
add_shortcode('trinksee', 'trinksee_iframe_shortcode');

/**
 * Cocoonテーマ専用のCSSを追加
 */
function trinksee_enqueue_cocoon_styles() {
    // Cocoonテーマの固定ページ専用CSS
    if (is_page()) {
        wp_add_inline_style('wp-block-library', '
            /* Cocoonテーマの固定ページの余白を完全に削除 */
            body.page .wrap,
            body.page .main-wrap,
            body.page .container,
            body.page .main-content,
            body.page .main,
            body.page .content,
            body.page .entry-content,
            body.page .post,
            body.page .article,
            body.page .post-main,
            body.page .content-main {
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
            }
            
            /* Cocoonのサイドバーを非表示 */
            body.page.has-shortcode-trinksee .sidebar,
            body.page.has-shortcode-trinksee .sidebar-left,
            body.page.has-shortcode-trinksee .sidebar-right {
                display: none !important;
            }
            
            /* Cocoonのメインコンテンツを全幅に */
            body.page.has-shortcode-trinksee .main-content {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            /* iframeコンテナ */
            .trinksee-fullscreen-wrapper {
                width: 100vw !important;
                height: 100vh !important;
                min-height: 800px !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                max-width: 100vw !important;
                overflow: hidden;
                box-sizing: border-box;
            }
            
            .trinksee-fullscreen-wrapper iframe {
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* モバイル対応 */
            @media (max-width: 768px) {
                .trinksee-fullscreen-wrapper {
                    height: 100vh;
                    min-height: 600px;
                }
            }
        ');
    }
}
add_action('wp_enqueue_scripts', 'trinksee_enqueue_cocoon_styles', 999);

/**
 * ショートコードが含まれるページにクラスを追加
 */
function trinksee_add_body_class($classes) {
    global $post;
    if (is_page() && isset($post->post_content) && has_shortcode($post->post_content, 'trinksee')) {
        $classes[] = 'has-shortcode-trinksee';
    }
    return $classes;
}
add_filter('body_class', 'trinksee_add_body_class');

/**
 * プリロードとDNSプリフェッチを追加（パフォーマンス最適化）
 */
function trinksee_add_preconnect() {
    $app_url = TRINKSEE_APP_URL;
    $parsed_url = parse_url($app_url);
    $domain = $parsed_url['scheme'] . '://' . $parsed_url['host'];
    
    echo '<link rel="preconnect" href="' . esc_url($domain) . '">' . "\n";
    echo '<link rel="dns-prefetch" href="' . esc_url($domain) . '">' . "\n";
}
add_action('wp_head', 'trinksee_add_preconnect', 1);

/**
 * 管理画面に設定ページを追加（オプション）
 */
function trinksee_add_admin_menu() {
    add_options_page(
        'トリンクシー設定',
        'トリンクシー',
        'manage_options',
        'trinksee-settings',
        'trinksee_settings_page'
    );
}
add_action('admin_menu', 'trinksee_add_admin_menu');

/**
 * 設定ページの内容
 */
function trinksee_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // 設定を保存
    if (isset($_POST['trinksee_save_settings'])) {
        check_admin_referer('trinksee_settings');
        update_option('trinksee_app_url', sanitize_text_field($_POST['trinksee_app_url']));
        echo '<div class="notice notice-success"><p>設定を保存しました。</p></div>';
    }
    
    $app_url = get_option('trinksee_app_url', TRINKSEE_APP_URL);
    ?>
    <div class="wrap">
        <h1>トリンクシー設定</h1>
        <form method="post" action="">
            <?php wp_nonce_field('trinksee_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="trinksee_app_url">アプリURL</label>
                    </th>
                    <td>
                        <input 
                            type="url" 
                            id="trinksee_app_url" 
                            name="trinksee_app_url" 
                            value="<?php echo esc_attr($app_url); ?>" 
                            class="regular-text"
                            placeholder="https://app.tolynxy.com"
                        />
                        <p class="description">VercelでデプロイしたアプリのURLを入力してください。</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('設定を保存', 'primary', 'trinksee_save_settings'); ?>
        </form>
        
        <hr>
        
        <h2>使い方</h2>
        <p>以下のショートコードを使用して、固定ページにアプリを埋め込めます：</p>
        <code>[trinksee]</code>
        <p>オプション:</p>
        <ul>
            <li><code>[trinksee height="100vh"]</code> - 高さを指定</li>
            <li><code>[trinksee url="https://custom-url.vercel.app"]</code> - カスタムURLを指定</li>
        </ul>
        
        <h3>Cocoonテーマでの使用例</h3>
        <ol>
            <li>「固定ページ」→「新規追加」</li>
            <li>タイトルを入力（例：「相性診断」）</li>
            <li>本文に <code>[trinksee]</code> と入力</li>
            <li>「公開」をクリック</li>
        </ol>
    </div>
    <?php
}

/**
 * 設定からURLを取得する関数
 */
function trinksee_get_app_url() {
    return get_option('trinksee_app_url', TRINKSEE_APP_URL);
}



