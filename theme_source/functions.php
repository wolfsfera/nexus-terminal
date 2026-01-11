<?php
/**
 * Wolfsfera Nexus functions and definitions
 */

if ( ! defined( '_S_VERSION' ) ) {
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Enqueue scripts and styles.
 */
function wolfsfera_scripts() {
    // Google Fonts: Outfit
    wp_enqueue_style( 'wolfsfera-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap', array(), null );
	wp_enqueue_style( 'wolfsfera-style', get_stylesheet_uri(), array(), _S_VERSION );
}
add_action( 'wp_enqueue_scripts', 'wolfsfera_scripts' );

/**
 * Register Custom Post Type: Afiliados
 * Para gestionar Exchanges, Wallets y Herramientas de forma centralizada.
 */
function wolfsfera_register_affiliates_cpt() {
    $labels = array(
        'name'                  => _x( 'Afiliados', 'Post Type General Name', 'wolfsfera' ),
        'singular_name'         => _x( 'Afiliado', 'Post Type Singular Name', 'wolfsfera' ),
        'menu_name'             => __( 'Afiliados (Partners)', 'wolfsfera' ),
        'all_items'             => __( 'Todos los Afiliados', 'wolfsfera' ),
        'add_new_item'          => __( 'Añadir Nuevo Partner', 'wolfsfera' ),
        'edit_item'             => __( 'Editar Partner', 'wolfsfera' ),
    );
    $args = array(
        'label'                 => __( 'Afiliado', 'wolfsfera' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-money', // Icono de dinero
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
    );
    register_post_type( 'affiliate', $args );
}
add_action( 'init', 'wolfsfera_register_affiliates_cpt', 0 );

/**
 * Theme Support
 */
function wolfsfera_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
}
add_action( 'after_setup_theme', 'wolfsfera_setup' );
