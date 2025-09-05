<?php
/**
 * UNIFIED SERVICE TEMPLATE IMPLEMENTATION
 * Replace all service-specific field groups with one consolidated structure
 */

// ==========================================
// STEP 1: REMOVE OLD SERVICE TEMPLATE FILES
// ==========================================

/*
Delete these redundant template files:
- template-ai-content.php
- template-b2b-lead-generation.php  
- template-booking-systems.php
- template-digital-marketing.php
- template-ecommerce-main.php
- template-outsourced-cmo.php
- template-software-development.php

Replace with: template-service-detail.php (created below)
*/

// ==========================================
// STEP 2: CREATE UNIFIED SERVICE TEMPLATE
// ==========================================

/*
File: template-service-detail.php
<?php
/*
Template Name: Service Detail Page
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

get_header(); ?>

<div class="service-detail-page">
    <?php while (have_posts()) : the_post(); ?>
        
        <div class="page-content">
            <h1><?php the_title(); ?></h1>
            
            <?php 
            // For headless setup, this template serves as a targeting mechanism for ACF
            // The actual rendering will be handled by the frontend (Next.js)
            
            if (function_exists('get_field')) {
                $service_content = get_field('service_detail_content');
                
                if ($service_content) {
                    // Display a simple preview for backend users
                    echo '<div class="acf-preview">';
                    echo '<p><strong>Service Type:</strong> ' . (get_field('service_type') ?: 'Not specified') . '</p>';
                    echo '<p><strong>ACF Data Available:</strong> This page has unified Service Detail fields configured.</p>';
                    echo '<p><em>Note: Full content rendering handled by headless frontend.</em></p>';
                    echo '</div>';
                }
            }
            
            the_content(); 
            ?>
        </div>
        
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>
*/

// ==========================================
// STEP 3: ADD TO FUNCTIONS.PHP
// ==========================================

// Add this code to your theme's functions.php file

/**
 * UNIFIED SERVICE DETAIL FIELD GROUP
 * Handles all 7 service types with conditional logic
 */
add_action('acf/init', 'create_unified_service_template');
function create_unified_service_template() {
    
    // Main Service Detail Field Group
    acf_add_local_field_group(array(
        'key' => 'group_unified_service_detail',
        'title' => 'Service Detail Content',
        'fields' => array(
            
            // SERVICE TYPE SELECTOR
            array(
                'key' => 'field_service_type',
                'label' => 'Service Type',
                'name' => 'service_type',
                'type' => 'select',
                'instructions' => 'Select the type of service this page represents',
                'required' => 1,
                'choices' => array(
                    'ecommerce' => 'eCommerce Website Development',
                    'b2b-lead-generation' => 'B2B Lead Generation',
                    'software-development' => 'Software Development',
                    'booking-systems' => 'Booking Systems',
                    'digital-marketing' => 'Digital Marketing',
                    'outsourced-cmo' => 'Outsourced CMO',
                    'ai' => 'AI Content & Solutions',
                ),
                'default_value' => 'ecommerce',
                'allow_null' => 0,
                'return_format' => 'value',
                'show_in_graphql' => 1,
                'graphql_field_name' => 'serviceType',
            ),
            
            // UNIFIED SERVICE CONTENT GROUP
            array(
                'key' => 'field_service_detail_content',
                'label' => 'Service Detail Content',
                'name' => 'service_detail_content',
                'type' => 'group',
                'layout' => 'block',
                'show_in_graphql' => 1,
                'graphql_field_name' => 'serviceDetailContent',
                'sub_fields' => array(
                    
                    // HERO SECTION
                    array(
                        'key' => 'field_service_hero',
                        'label' => 'Hero Section',
                        'name' => 'hero_section',
                        'type' => 'group',
                        'layout' => 'block',
                        'show_in_graphql' => 1,
                        'graphql_field_name' => 'heroSection',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_service_hero_title',
                                'label' => 'Service Title',
                                'name' => 'title',
                                'type' => 'text',
                                'instructions' => 'Main service headline',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_service_hero_description',
                                'label' => 'Service Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'instructions' => 'Brief description of the service',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_service_hero_icon',
                                'label' => 'Service Icon',
                                'name' => 'icon',
                                'type' => 'image',
                                'instructions' => 'Icon or illustration representing this service',
                                'return_format' => 'array',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                    
                    // KEY STATISTICS
                    array(
                        'key' => 'field_service_statistics',
                        'label' => 'Key Statistics',
                        'name' => 'statistics',
                        'type' => 'repeater',
                        'instructions' => 'Add key metrics and statistics for this service',
                        'min' => 0,
                        'max' => 4,
                        'layout' => 'table',
                        'button_label' => 'Add Statistic',
                        'show_in_graphql' => 1,
                        'graphql_field_name' => 'statistics',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_stat_number',
                                'label' => 'Number',
                                'name' => 'number',
                                'type' => 'text',
                                'instructions' => 'e.g., "250%", "£5M", "50+"',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_stat_label',
                                'label' => 'Label',
                                'name' => 'label',
                                'type' => 'text',
                                'instructions' => 'e.g., "Increase in ROI", "Revenue Generated"',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_stat_metric_type',
                                'label' => 'Metric Type',
                                'name' => 'metric_type',
                                'type' => 'text',
                                'instructions' => 'e.g., "ROI", "Revenue", "Clients"',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                    
                    // SERVICE PROCESS/HOW WE WORK
                    array(
                        'key' => 'field_service_process',
                        'label' => 'Our Process',
                        'name' => 'process',
                        'type' => 'group',
                        'layout' => 'block',
                        'show_in_graphql' => 1,
                        'graphql_field_name' => 'process',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_process_heading',
                                'label' => 'Process Section Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'How We Work',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_process_steps',
                                'label' => 'Process Steps',
                                'name' => 'steps',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 6,
                                'layout' => 'block',
                                'button_label' => 'Add Process Step',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_step_title',
                                        'label' => 'Step Title',
                                        'name' => 'title',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_step_description',
                                        'label' => 'Step Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_step_image',
                                        'label' => 'Step Image',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                        ),
                    ),
                    
                    // SERVICE BENEFITS/FEATURES
                    array(
                        'key' => 'field_service_benefits',
                        'label' => 'Key Benefits',
                        'name' => 'benefits',
                        'type' => 'repeater',
                        'instructions' => 'List the main benefits of this service',
                        'min' => 0,
                        'max' => 6,
                        'layout' => 'table',
                        'button_label' => 'Add Benefit',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_benefit_title',
                                'label' => 'Benefit Title',
                                'name' => 'title',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_benefit_description',
                                'label' => 'Benefit Description',
                                'name' => 'description',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_benefit_icon',
                                'label' => 'Benefit Icon',
                                'name' => 'icon',
                                'type' => 'image',
                                'return_format' => 'array',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                    
                    // CASE STUDIES SECTION
                    array(
                        'key' => 'field_service_case_studies',
                        'label' => 'Featured Case Studies',
                        'name' => 'case_studies',
                        'type' => 'group',
                        'layout' => 'block',
                        'show_in_graphql' => 1,
                        'graphql_field_name' => 'caseStudies',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_case_studies_heading',
                                'label' => 'Case Studies Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Success Stories',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_featured_case_studies',
                                'label' => 'Select Case Studies',
                                'name' => 'featured_studies',
                                'type' => 'post_object',
                                'instructions' => 'Choose case studies to feature for this service',
                                'post_type' => array('case_studies'),
                                'multiple' => 1,
                                'max' => 3,
                                'return_format' => 'object',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                    
                    // SERVICE-SPECIFIC CONTENT
                    array(
                        'key' => 'field_service_specific_content',
                        'label' => 'Service-Specific Content',
                        'name' => 'specific_content',
                        'type' => 'group',
                        'layout' => 'block',
                        'instructions' => 'Additional content sections specific to this service type',
                        'show_in_graphql' => 1,
                        'graphql_field_name' => 'specificContent',
                        'sub_fields' => array(
                            
                            // ECOMMERCE SPECIFIC FIELDS
                            array(
                                'key' => 'field_ecommerce_features',
                                'label' => 'eCommerce Features',
                                'name' => 'ecommerce_features',
                                'type' => 'repeater',
                                'instructions' => 'Specific eCommerce platform features and capabilities',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'ecommerce',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add Feature',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_ecom_feature_name',
                                        'label' => 'Feature Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_ecom_feature_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                            
                            // B2B LEAD GENERATION SPECIFIC
                            array(
                                'key' => 'field_b2b_channels',
                                'label' => 'Lead Generation Channels',
                                'name' => 'b2b_channels',
                                'type' => 'repeater',
                                'instructions' => 'Different channels and methods for B2B lead generation',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'b2b-lead-generation',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add Channel',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_b2b_channel_name',
                                        'label' => 'Channel Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_b2b_channel_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                            
                            // SOFTWARE DEVELOPMENT SPECIFIC
                            array(
                                'key' => 'field_software_technologies',
                                'label' => 'Technologies Used',
                                'name' => 'software_technologies',
                                'type' => 'post_object',
                                'instructions' => 'Select technologies used for software development',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'software-development',
                                        ),
                                    ),
                                ),
                                'post_type' => array('technologies'),
                                'multiple' => 1,
                                'return_format' => 'object',
                                'show_in_graphql' => 1,
                            ),
                            
                            // AI SPECIFIC FIELDS
                            array(
                                'key' => 'field_ai_capabilities',
                                'label' => 'AI Capabilities',
                                'name' => 'ai_capabilities',
                                'type' => 'repeater',
                                'instructions' => 'Specific AI and automation capabilities offered',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'ai',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add AI Capability',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_ai_capability_name',
                                        'label' => 'Capability Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_ai_capability_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                            
                            // DIGITAL MARKETING SPECIFIC
                            array(
                                'key' => 'field_marketing_services',
                                'label' => 'Marketing Services',
                                'name' => 'marketing_services',
                                'type' => 'repeater',
                                'instructions' => 'Specific digital marketing services offered',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'digital-marketing',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add Marketing Service',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_marketing_service_name',
                                        'label' => 'Service Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_marketing_service_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                            
                            // BOOKING SYSTEMS SPECIFIC
                            array(
                                'key' => 'field_booking_features',
                                'label' => 'Booking System Features',
                                'name' => 'booking_features',
                                'type' => 'repeater',
                                'instructions' => 'Key features of booking and reservation systems',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'booking-systems',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add Feature',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_booking_feature_name',
                                        'label' => 'Feature Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_booking_feature_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                            
                            // OUTSOURCED CMO SPECIFIC
                            array(
                                'key' => 'field_cmo_deliverables',
                                'label' => 'CMO Service Deliverables',
                                'name' => 'cmo_deliverables',
                                'type' => 'repeater',
                                'instructions' => 'Key deliverables for outsourced CMO services',
                                'conditional_logic' => array(
                                    array(
                                        array(
                                            'field' => 'field_service_type',
                                            'operator' => '==',
                                            'value' => 'outsourced-cmo',
                                        ),
                                    ),
                                ),
                                'layout' => 'table',
                                'button_label' => 'Add Deliverable',
                                'show_in_graphql' => 1,
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_cmo_deliverable_name',
                                        'label' => 'Deliverable Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                    array(
                                        'key' => 'field_cmo_deliverable_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                        'show_in_graphql' => 1,
                                    ),
                                ),
                            ),
                        ),
                    ),
                    
                    // TESTIMONIALS SECTION
                    array(
                        'key' => 'field_service_testimonials',
                        'label' => 'Client Testimonials',
                        'name' => 'testimonials',
                        'type' => 'repeater',
                        'instructions' => 'Add client testimonials specific to this service',
                        'min' => 0,
                        'max' => 3,
                        'layout' => 'block',
                        'button_label' => 'Add Testimonial',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_testimonial_quote',
                                'label' => 'Quote',
                                'name' => 'quote',
                                'type' => 'textarea',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_testimonial_client_name',
                                'label' => 'Client Name',
                                'name' => 'client_name',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_testimonial_client_company',
                                'label' => 'Client Company',
                                'name' => 'client_company',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_testimonial_client_photo',
                                'label' => 'Client Photo',
                                'name' => 'client_photo',
                                'type' => 'image',
                                'return_format' => 'array',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                    
                    // FAQ SECTION
                    array(
                        'key' => 'field_service_faq',
                        'label' => 'Frequently Asked Questions',
                        'name' => 'faq',
                        'type' => 'repeater',
                        'instructions' => 'Add FAQs specific to this service',
                        'min' => 0,
                        'layout' => 'block',
                        'button_label' => 'Add FAQ',
                        'show_in_graphql' => 1,
                        'sub_fields' => array(
                            array(
                                'key' => 'field_faq_question',
                                'label' => 'Question',
                                'name' => 'question',
                                'type' => 'text',
                                'show_in_graphql' => 1,
                            ),
                            array(
                                'key' => 'field_faq_answer',
                                'label' => 'Answer',
                                'name' => 'answer',
                                'type' => 'textarea',
                                'show_in_graphql' => 1,
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'template-service-detail.php',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'Unified service template that handles all 7 service types with conditional fields',
        'show_in_graphql' => 1,
        'graphql_field_name' => 'serviceDetailFields',
    ));
}

// ==========================================
// STEP 4: SAMPLE GRAPHQL QUERIES
// ==========================================

/*
# Get all service pages with their type
query GetAllServices {
  pages(where: {hasMetaQuery: {key: "service_type", compareKey: EXISTS}}) {
    nodes {
      title
      slug
      serviceDetailFields {
        serviceType
        serviceDetailContent {
          heroSection {
            title
            description
            icon {
              node {
                sourceUrl
                altText
              }
            }
          }
          statistics {
            number
            label
            metricType
          }
          process {
            heading
            steps {
              title
              description
              image {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
          benefits {
            title
            description
            icon {
              node {
                sourceUrl
                altText
              }
            }
          }
          caseStudies {
            heading
            featuredStudies {
              ... on CaseStudy {
                title
                caseStudyFields {
                  clientName
                  results
                }
              }
            }
          }
          testimonials {
            quote
            clientName
            clientCompany
            clientPhoto {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
}

# Get specific service by type
query GetEcommerceService {
  pages(where: {hasMetaQuery: {key: "service_type", value: "ecommerce"}}) {
    nodes {
      title
      serviceDetailFields {
        serviceType
        serviceDetailContent {
          specificContent {
            ecommerceFeatures {
              name
              description
            }
          }
        }
      }
    }
  }
}

# Get B2B Lead Generation service
query GetB2BService {
  pages(where: {hasMetaQuery: {key: "service_type", value: "b2b-lead-generation"}}) {
    nodes {
      title
      serviceDetailFields {
        serviceDetailContent {
          specificContent {
            b2bChannels {
              name
              description
            }
          }
        }
      }
    }
  }
}
*/

// ==========================================
// STEP 5: MIGRATION INSTRUCTIONS
// ==========================================

/*
MIGRATION STEPS:

1. BACKUP YOUR DATABASE before making any changes

2. Add the unified field group code to functions.php

3. Create the new template file: template-service-detail.php

4. For each existing service page:
   - Edit the page in WordPress admin
   - Change page template from specific template to "Service Detail Page"
   - Set the Service Type field to the appropriate value
   - Migrate existing content to the unified structure

5. Delete the old template files:
   rm template-ai-content.php
   rm template-b2b-lead-generation.php  
   rm template-booking-systems.php
   rm template-digital-marketing.php
   rm template-ecommerce-main.php
   rm template-outsourced-cmo.php
   rm template-software-development.php

6. Test each service page to ensure content displays correctly

7. Update your GraphQL queries in the frontend to use the new structure

BENEFITS OF THIS APPROACH:
- Single source of truth for all service pages
- Easier maintenance and updates
- Consistent structure across all services
- Conditional fields for service-specific content
- Better GraphQL organization
- Simplified content management for editors
*/

?>