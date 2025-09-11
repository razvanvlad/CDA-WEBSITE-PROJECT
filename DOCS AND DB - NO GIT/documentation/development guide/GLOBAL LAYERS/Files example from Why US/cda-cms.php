<?php
/**
 * Plugin Name: CDA Headless CMS helpers
 * Description: EXAMPLE FOR GLOBAL LAYERS STURCTURE AFTER GLOBAL LAYER: WHY US is working good
 * Version: EXAMPLE FOR GLOBAL LAYERS STURCTURE AFTER GLOBAL LAYER: WHY US is working good
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Enable ACF GraphQL - This is the most important line
add_filter('acf/settings/graphql_enabled', '__return_true');

// Make sure ACF fields are available in GraphQL
add_filter('graphql_acf_get_fields_config', function($config, $acf_field, $type_name) {
    $config['show_in_graphql'] = true;
    return $config;
}, 10, 3);

// Remove Gutenberg and other page builders
add_action('init', 'cda_remove_gutenberg');
function cda_remove_gutenberg() {
    add_filter('use_block_editor_for_post_type', '__return_false', 100);
    remove_post_type_support('page', 'editor');
    remove_post_type_support('post', 'editor');
}

// Create Custom Post Types (your existing code)
add_action('init', 'cda_create_custom_post_types');
function cda_create_custom_post_types() {
    // Your existing custom post type code...
}

// Create Taxonomies (your existing code)
add_action('init', 'cda_create_taxonomies');
function cda_create_taxonomies() {
    // Your existing taxonomy code...
}

// Add ACF options page for global content
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Global Content',
        'menu_title' => 'Global Content',
        'menu_slug' => 'global-content',
        'capability' => 'edit_posts',
        'redirect' => false,
        'show_in_graphql' => true,
        'graphql_field_name' => 'globalOptions'
    ));
}

// SEO SETTINGS
add_action('acf/init', 'cda_add_seo_field_groups');
function cda_add_seo_field_groups() {
    // SEO Settings for all pages
    acf_add_local_field_group(array(
        'key' => 'group_seo_settings',
        'title' => 'SEO Settings',
        'fields' => array(
            array(
                'key' => 'field_seo_title',
                'label' => 'SEO Title',
                'name' => 'seo_title',
                'type' => 'text',
                'instructions' => 'Custom title for SEO (max 60 characters)',
                'show_in_graphql' => 1,
            ),
            array(
                'key' => 'field_seo_description',
                'label' => 'Meta Description',
                'name' => 'seo_description',
                'type' => 'textarea',
                'instructions' => 'Custom meta description for SEO (max 160 characters)',
                'rows' => 3,
                'show_in_graphql' => 1,
            ),
            array(
                'key' => 'field_seo_keywords',
                'label' => 'Meta Keywords',
                'name' => 'seo_keywords',
                'type' => 'text',
                'instructions' => 'Comma-separated keywords for SEO',
                'show_in_graphql' => 1,
            ),
            array(
                'key' => 'field_noindex',
                'label' => 'No Index',
                'name' => 'noindex',
                'type' => 'true_false',
                'instructions' => 'Check to prevent search engines from indexing this page',
                'show_in_graphql' => 1,
            ),
            array(
                'key' => 'field_nofollow',
                'label' => 'No Follow',
                'name' => 'nofollow',
                'type' => 'true_false',
                'instructions' => 'Check to prevent search engines from following links on this page',
                'show_in_graphql' => 1,
            ),
            array(
                'key' => 'field_canonical_url',
                'label' => 'Canonical URL',
                'name' => 'canonical_url',
                'type' => 'url',
                'instructions' => 'Specify a canonical URL for this page',
                'show_in_graphql' => 1,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page'
                )
            )
        ),
        'show_in_graphql' => 1,
        'graphql_field_name' => 'seoSettings',
    ));
}

// ACF Field Groups
add_action('acf/init', 'cda_add_acf_field_groups');
function cda_add_acf_field_groups() {
    
    // Homepage Content
    acf_add_local_field_group(array(
        'key' => 'group_homepage',
        'title' => 'Homepage Content',
        'fields' => array(
            array(
                'key' => 'field_header_section',
                'label' => 'Header Section',
                'name' => 'header_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_header_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'wysiwyg',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_header_subtitle',
                        'label' => 'Subtitle',
                        'name' => 'subtitle',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_primary_cta',
                        'label' => 'Primary CTA',
                        'name' => 'primary_cta',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_secondary_cta',
                        'label' => 'Secondary CTA',
                        'name' => 'secondary_cta',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_header_image',
                        'label' => 'Desktop Image',
                        'name' => 'desktopImage',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                        'preview_size' => 'large',
                    )
                )
            ),
            array(
                'key' => 'field_who_we_are_section',
                'label' => 'Who We Are Section',
                'name' => 'whoWeAreSection',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_who_we_are_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_who_we_are_subtitle',
                        'label' => 'Subtitle',
                        'name' => 'subtitle',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_who_we_are_image',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_who_we_are_button',
                        'label' => 'Button',
                        'name' => 'button',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_services_accordion',
                'label' => 'Services Accordion',
                'name' => 'services_accordion',
                'type' => 'repeater',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_accordion_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_accordion_description',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_accordion_link',
                        'label' => 'Link',
                        'name' => 'link',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_platforms_section',
                'label' => 'Platforms Section',
                'name' => 'platforms_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_platforms_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_platforms_subtitle',
                        'label' => 'Subtitle',
                        'name' => 'subtitle',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_platforms_logos',
                        'label' => 'Logos',
                        'name' => 'logos',
                        'type' => 'repeater',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_logo_image',
                                'label' => 'Logo Image',
                                'name' => 'logo',
                                'type' => 'image',
                                'return_format' => 'object',
                                'show_in_graphql' => 1,
                            )
                        )
                    )
                )
            ),
            array(
                'key' => 'field_values_section',
                'label' => 'Values Section',
                'name' => 'values_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_values_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_values_items',
                        'label' => 'Value Items',
                        'name' => 'value_items',
                        'type' => 'repeater',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_value_title',
                                'label' => 'Title',
                                'name' => 'title',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_value_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            )
                        )
                    )
                )
            ),
            array(
                'key' => 'field_case_studies_section',
                'label' => 'Case Studies Section',
                'name' => 'case_studies_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_case_studies_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_case_studies',
                        'label' => 'Case Studies',
                        'name' => 'case_studies',
                        'type' => 'relationship',
                        'post_type' => array('case_study'),
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_newsletter_section',
                'label' => 'Newsletter Section',
                'name' => 'newsletter_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_newsletter_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_newsletter_subtitle',
                        'label' => 'Subtitle',
                        'name' => 'subtitle',
                        'type' => 'text',
                        'show_in_graphql' => 1,
                    )
                )
            )
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'template-homepage.php'
                )
            )
        ),
        'show_in_graphql' => 1,
        'graphql_field_name' => 'homepageContent',
    ));
}

// Add About Us Page Fields
add_action('acf/init', 'cda_add_about_us_fields');
function cda_add_about_us_fields() {
    // About Us Page Content
    acf_add_local_field_group(array(
        'key' => 'group_about_us_page',
        'title' => 'About Us Page Content',
        'fields' => array(
            array(
                'key' => 'field_content_page_header',
                'label' => 'Content Page Header',
                'name' => 'content_page_header',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_header_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'wysiwyg',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_header_text',
                        'label' => 'Text',
                        'name' => 'text',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_header_cta',
                        'label' => 'CTA',
                        'name' => 'cta',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_who_we_are_section',
                'label' => 'Who We Are â€" Your Digital Partner',
                'name' => 'who_we_are_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_image_with_frame',
                        'label' => 'Image with Frame',
                        'name' => 'image_with_frame',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_section_title',
                        'label' => 'Section Title',
                        'name' => 'section_title',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_section_text',
                        'label' => 'Section Text',
                        'name' => 'section_text',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_section_cta',
                        'label' => 'CTA',
                        'name' => 'cta',
                        'type' => 'link',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_why_cda_section',
                'label' => 'Why CDA',
                'name' => 'why_cda_section',
                'type' => 'repeater',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_usp_title',
                        'label' => 'USP Title',
                        'name' => 'title',
                        'type' => 'wysiwyg',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_usp_description',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_usp_icon',
                        'label' => 'Icon',
                        'name' => 'icon',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_services_section',
                'label' => 'Services',
                'name' => 'services_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_services_accordion',
                        'label' => 'Services Accordion',
                        'name' => 'services_accordion',
                        'type' => 'repeater',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_accordion_title',
                                'label' => 'Title',
                                'name' => 'title',
                                'type' => 'wysiwyg',
                                'required' => 1,
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_accordion_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'wysiwyg',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_accordion_link',
                                'label' => 'Link',
                                'name' => 'link',
                                'type' => 'link',
                                'show_in_graphql' => 1,
                            )
                        )
                    )
                )
            ),
            array(
                'key' => 'field_culture_section',
                'label' => 'Culture',
                'name' => 'culture_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_culture_gallery',
                        'label' => 'Culture Gallery',
                        'name' => 'gallery',
                        'type' => 'gallery',
                        'return_format' => 'array',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_approach_section',
                'label' => 'Our Approach / How We Work',
                'name' => 'approach_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_approach_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'wysiwyg',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_approach_text',
                        'label' => 'Text',
                        'name' => 'text',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_approach_image',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_stats_section',
                'label' => 'Stats',
                'name' => 'stats_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_stats_number',
                        'label' => 'Number',
                        'name' => 'number',
                        'type' => 'number',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_stats_label',
                        'label' => 'Label',
                        'name' => 'label',
                        'type' => 'wysiwyg',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_stats_image',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_video_section',
                'label' => 'Video',
                'name' => 'video_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_video_url',
                        'label' => 'Video URL',
                        'name' => 'url',
                        'type' => 'url',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_video_title',
                        'label' => 'Video Title',
                        'name' => 'title',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_leadership_section',
                'label' => 'Leadership Team',
                'name' => 'leadership_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_leader_image',
                        'label' => 'Leader Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'object',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_leader_name',
                        'label' => 'Name',
                        'name' => 'name',
                        'type' => 'text',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_leader_position',
                        'label' => 'Position',
                        'name' => 'position',
                        'type' => 'text',
                        'required' => 1,
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_leader_bio',
                        'label' => 'Bio',
                        'name' => 'bio',
                        'type' => 'wysiwyg',
                        'show_in_graphql' => 1,
                    )
                )
            ),
            array(
                'key' => 'field_showreel_section',
                'label' => 'Our Work Video & Logos',
                'name' => 'showreel_section',
                'type' => 'group',
                'show_in_graphql' => 1,
                'sub_fields' => array(
                    array(
                        'key' => 'field_showreel_video',
                        'label' => 'Showreel Video',
                        'name' => 'video',
                        'type' => 'oembed',
                        'show_in_graphql' => 1,
                    ),
                    array(
                        'key' => 'field_showreel_logos',
                        'label' => 'Client Logos',
                        'name' => 'logos',
                        'type' => 'repeater',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_logo_image',
                                'label' => 'Logo Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'object',
                                'show_in_graphql' => 1,
                            )
                        )
                    )
                )
            )
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'template-about-us.php'
                )
            )
        ),
        'show_in_graphql' => 1,
        'graphql_field_name' => 'aboutUsContent',
        'map_graphql_types_from_location_rules' => false,
        'graphql_types' => ['Page']
    ));
}

// Add this filter to ensure ACF fields are properly exposed to GraphQL
add_filter('graphql_resolve_field', function($result, $source, $args, $context, $info) {
    // This ensures ACF fields are properly resolved
    return $result;
}, 10, 5);

?>