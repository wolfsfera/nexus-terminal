<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <div id="page" class="site">
        <header id="masthead" class="site-header">
            <div class="container header-container">
                <!-- 1. Logo (Left) -->
                <div class="site-branding">
                    <a href="<?php echo esc_url(home_url('/')); ?>" rel="home" class="logo-link">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/wolf-hero.jpg"
                            alt="Wolfsfera" class="site-logo">
                    </a>
                </div>

                <!-- 2. Navigation (Center) -->
                <nav id="site-navigation" class="main-navigation">
                    <ul class="nav-menu">
                        <li><a href="#ecosistema">Ecosistema</a></li>
                        <li><a href="#partners">Top Partners</a></li>
                        <li><a href="#academy">Academia</a></li>
                    </ul>
                </nav>

                <!-- 3. Actions (Right) -->
                <div class="header-actions">
                    <a href="https://wolfshop.wolfsfera.com" class="btn-shop">
                        <span class="shop-icon">🛒</span> WolfShop
                    </a>
                    <a href="https://app.wolfsfera.com" class="btn-gold-sm">Conectar</a>
                    <a href="https://academy.wolfsfera.com" class="nav-link-login">WOLFNANCE ACADEMY APP</a>
                </div>
            </div>
    </div>
    </header>

    <style>
        /* Header Styles */
        .site-header {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            padding: 15px 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Logo */
        .site-title a {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #fff;
            text-transform: uppercase;
        }

        /* Nav */
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 32px;
            align-items: center;
            margin: 0;
            padding: 0;
        }

        .nav-menu a {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text-muted);
            transition: color 0.2s ease;
        }

        .nav-menu a:hover {
            color: #fff;
        }

        /* Actions */
        .header-actions {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .nav-link-login {
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
        }

        .btn-gold-sm {
            background: var(--accent-gold);
            color: #000 !important;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 0.85rem !important;
            font-weight: 700;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-gold-sm:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }

        @media (max-width: 768px) {

            .main-navigation,
            .header-actions {
                display: none;
            }
        }
    </style>