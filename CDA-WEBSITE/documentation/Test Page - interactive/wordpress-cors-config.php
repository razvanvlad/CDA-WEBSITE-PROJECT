<?php
/**
 * Add this to your WordPress theme's functions.php or as a mu-plugin
 * File location: /wp-content/themes/your-theme/functions.php
 * OR: /wp-content/mu-plugins/cors-config.php
 */

// Allow CORS for GraphQL requests during development
add_action('graphql_init', function() {
    // Only allow in development - remove or modify for production
    if (wp_get_environment_type() === 'local' || wp_get_environment_type() === 'development') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
    }
});

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
        exit(0);
    }
});

// Alternative: Specific origins only (more secure for production)
add_filter('graphql_response_headers_to_send', function($headers) {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://staging.cda.group',
        'https://cda.group'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    return $headers;
});
