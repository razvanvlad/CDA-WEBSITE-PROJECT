<?php
# Database Configuration
define( 'DB_NAME', 'wp_cdanewwebsite' );
define( 'DB_USER', 'cdanewwebsite' );
define( 'DB_PASSWORD', '_NF1_2A1zMsV5Wh3hecZ' );
define( 'DB_HOST', '127.0.0.1:3306' );
define( 'DB_HOST_SLAVE', '127.0.0.1:3306' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         'l0OqX2PgPM-qnP~U.r6iD%r0hJ=*In%E7,56v$vSx6lvsgkeYZZEI_dwHi)_378k');
define('SECURE_AUTH_KEY',  '#WtAJqKAddV9qYNxLq0jSRaN1%afbJyDaTwPzY?Th&.=rwIN(BhBP?@xPUk(C,%D');
define('LOGGED_IN_KEY',    '&lVO6lanyRf@Jq2ZrRN*wS.!A$tnQkyiRCLdN@Sll8_H0@,T&?%7Iu#Ha6?1Sv8%');
define('NONCE_KEY',        'qU^~lLyqb)Rx869qKd~g@m$!N8d7QrOehXPu&V!~O299a?OSjmWm*@^k&Z%9NW!_');
define('AUTH_SALT',        ')ciN_,nmV)Mt3i8zaXeo=@d^wM-enLkdWBG_WxTA64lWf+Vyi6N4QX@)E6P(S(cX');
define('SECURE_AUTH_SALT', ',HS$*3oScFXoYW5(wTcH6NM~Bz%a50q@c.a%u%+9qKQ6OOVo)niQUKn$D)TJ$+7~');
define('LOGGED_IN_SALT',   'SLxedb),1+i+(iFSHBpXuvnbuAfbJEm@g,uVqp=^r0?SZMAvs-.P##t8QNK?V!Ck');
define('NONCE_SALT',       '?gc)wc~(cVhTq2@wz@Z!InSB2tDa0IY7vB%Q8O5zAhKeu5g4uStc=ApLqwf7y..g');


# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'cdanewwebsite' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'WPE_APIKEY', 'c6ed38ba9dd8a1be69063bb1bf74dd3671a4ce6b' );

define( 'WPE_CLUSTER_ID', '213931' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_SFTP_ENDPOINT', '35.197.248.197' );

define( 'WPE_LBMASTER_IP', '' );

define( 'WPE_CDN_DISABLE_ALLOWED', true );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'cdanewwebsite.wpengine.com', 1 => 'cdanewwebsite.wpenginepowered.com', );

$wpe_varnish_servers=array ( 0 => '127.0.0.1', );

$wpe_special_ips=array ( 0 => '35.242.145.120', 1 => 'pod-213931-utility.pod-213931.svc.cluster.local', );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( 'default' =>  array ( 0 => 'unix:///tmp/memcached.sock', ), );
define('WPLANG','');

# WP Engine ID


# WP Engine Settings






# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', __DIR__ . '/');
require_once(ABSPATH . 'wp-settings.php');

#  custom settings
define( 'ACF_PRO_LICENSE', 'b3JkZXJfaWQ9ODIxNDR8dHlwZT1kZXZlbG9wZXJ8ZGF0ZT0yMDE2LTA1LTIzIDEwOjQ5OjA0' );

# For production, turn off debugging
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);