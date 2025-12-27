<?php
/**
 * Plugin Name: トリンクシー統合
 * Plugin URI: https://your-wordpress-site.com
 * Description: トリンクシーのふたり診断アプリをWordPressサイトに統合するプラグイン
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://your-site.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: trinksee
 */

// セキュリティチェック
if (!defined('ABSPATH')) {
    exit;
}

/**
 * トリンクシーのふたり診断アプリのURLを設定
 * VercelのデプロイURLに置き換えてください
 */
define('PAIRLY_LAB_APP_URL', 'https://your-app.vercel.app');

/**
 * ショートコード: [pairly_lab]
 * 
 * 使用例:
 * [pairly_lab]
 * [pairly_lab height="100vh"]
 * [pairly_lab url="https://custom-url.vercel.app"]
 */
function pairly_lab_iframe_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => PAIRLY_LAB_APP_URL,
        'height' => '100vh',
        'min_height' => '800px',
        'class' => 'trinksee-container',
    ), $atts);
    
    $url = esc_url($atts['url']);
    $height = esc_attr($atts['height']);
    $min_height = esc_attr($atts['min_height']);
    $class = esc_attr($atts['class']);
    
    ob_start();
    ?>
    <div class="<?php echo $class; ?>" style="width: 100%; max-width: 100%; height: <?php echo $height; ?>; min-height: <?php echo $min_height; ?>; position: relative; overflow: hidden;">
        <iframe 
            src="<?php echo $url; ?>" 
            style="width: 100%; height: 100%; border: none; display: block;"
            title="トリンクシーのふたり診断"
            allow="clipboard-read; clipboard-write"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('pairly_lab', 'pairly_lab_iframe_shortcode');

/**
 * スタイルシートを追加
 */
function pairly_lab_enqueue_styles() {
    wp_add_inline_style('wp-block-library', '
        .trinksee-container {
            width: 100%;
            max-width: 100%;
            height: 100vh;
            min-height: 800px;
            position: relative;
            overflow: hidden;
            margin: 0;
            padding: 0;
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
        
        /* タブレット対応 */
        @media (min-width: 769px) and (max-width: 1024px) {
            .trinksee-container {
                height: 100vh;
                min-height: 700px;
            }
        }
    ');
}
add_action('wp_enqueue_scripts', 'pairly_lab_enqueue_styles');

/**
 * プリロードとDNSプリフェッチを追加（パフォーマンス最適化）
 */
function pairly_lab_add_preconnect() {
    $app_url = PAIRLY_LAB_APP_URL;
    $parsed_url = parse_url($app_url);
    $domain = $parsed_url['scheme'] . '://' . $parsed_url['host'];
    
    echo '<link rel="preconnect" href="' . esc_url($domain) . '">' . "\n";
    echo '<link rel="dns-prefetch" href="' . esc_url($domain) . '">' . "\n";
}
add_action('wp_head', 'pairly_lab_add_preconnect', 1);

/**
 * 管理画面に設定ページを追加（オプション）
 */
function pairly_lab_add_admin_menu() {
    add_options_page(
        'トリンクシー設定',
        'トリンクシー',
        'manage_options',
        'trinksee-settings',
        'pairly_lab_settings_page'
    );
}
add_action('admin_menu', 'pairly_lab_add_admin_menu');

/**
 * 設定ページの内容
 */
function pairly_lab_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // 設定を保存
    if (isset($_POST['pairly_lab_save_settings'])) {
        check_admin_referer('pairly_lab_settings');
        update_option('pairly_lab_app_url', sanitize_text_field($_POST['pairly_lab_app_url']));
        echo '<div class="notice notice-success"><p>設定を保存しました。</p></div>';
    }
    
    $app_url = get_option('pairly_lab_app_url', PAIRLY_LAB_APP_URL);
    ?>
    <div class="wrap">
        <h1>トリンクシー設定</h1>
        <form method="post" action="">
            <?php wp_nonce_field('pairly_lab_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="pairly_lab_app_url">アプリURL</label>
                    </th>
                    <td>
                        <input 
                            type="url" 
                            id="pairly_lab_app_url" 
                            name="pairly_lab_app_url" 
                            value="<?php echo esc_attr($app_url); ?>" 
                            class="regular-text"
                            placeholder="https://your-app.vercel.app"
                        />
                        <p class="description">VercelでデプロイしたアプリのURLを入力してください。</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('設定を保存', 'primary', 'pairly_lab_save_settings'); ?>
        </form>
        
        <hr>
        
        <h2>使い方</h2>
        <p>以下のショートコードを使用して、投稿や固定ページにアプリを埋め込めます：</p>
        <code>[pairly_lab]</code>
        <p>オプション:</p>
        <ul>
            <li><code>[pairly_lab height="100vh"]</code> - 高さを指定</li>
            <li><code>[pairly_lab url="https://custom-url.vercel.app"]</code> - カスタムURLを指定</li>
        </ul>
    </div>
    <?php
}

/**
 * 設定からURLを取得する関数（設定ページを使用する場合）
 */
function pairly_lab_get_app_url() {
    return get_option('pairly_lab_app_url', PAIRLY_LAB_APP_URL);
}

