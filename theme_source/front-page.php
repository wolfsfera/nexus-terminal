<?php
/**
 * The front page template file
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- HERO SECTION -->
    <section class="hero-section">
        <div class="hero-bg-wolf"></div>
        <div class="container hero-content">
            <!-- Wolf Emblem Removed (Image is now background) -->

            <h1 class="hero-title">WOLFSFERA <span class="text-gold">NEXUS</span></h1>
            <p class="hero-subtitle">El centro de mando para el inversor inteligente. Domina XRP, conquista Solana y
                entrena en nuestra Academia.</p>

            <div class="hero-cta">
                <a href="#ecosistema" class="btn-gold">Explorar Ecosistema</a>
            </div>
        </div>
    </section>

    <!-- DESTACADOS / FEATURED SECTION -->
    <section id="destacados" class="featured-section">
        <div class="container">
            <h2 class="section-title">Destacados de la Manada</h2>
            <div class="featured-grid">
                <!-- Featured Item 1 -->
                <a href="https://wolfshop.wolfsfera.com" class="featured-card glass-panel">
                    <div class="feat-content">
                        <span class="feat-badge">TIENDA</span>
                        <h3>WolfShop Oficial</h3>
                        <p>Merchandising exclusivo, hardware wallets y herramientas para traders.</p>
                    </div>
                    <div class="feat-arrow">→</div>
                </a>
                <!-- Featured Item 2 -->
                <a href="https://academy.wolfsfera.com" class="featured-card glass-panel">
                    <div class="feat-content">
                        <span class="feat-badge">ACADEMIA</span>
                        <h3>Curso de Trading Pro</h3>
                        <p>Aprende a operar como un lobo. Plazas limitadas para el próximo cohort.</p>
                    </div>
                    <div class="feat-arrow">→</div>
                </a>
            </div>
        </div>
    </section>

    <!-- ECOSYSTEM GRID -->
    <section id="ecosistema" class="ecosystem-section">
        <div class="container">
            <h2 class="section-title">Nuestros Territorios</h2>
            <div class="grid-3">

                <!-- Card 1: XRP -->
                <a href="https://xrpwolfsfera.com" class="eco-card glass-panel card-xrp">
                    <div class="card-icon">🔵</div>
                    <h3>XRP Wolfsfera</h3>
                    <p>Análisis fundamental, noticias de Ripple y seguimiento de la SEC. El origen de la manada.</p>
                    <span class="link-arrow">Ir al Sitio &rarr;</span>
                </a>

                <!-- Card 2: APP -->
                <a href="https://app.wolfsfera.com" class="eco-card glass-panel card-app featured">
                    <div class="card-badge">NUEVO</div>
                    <div class="card-icon">🟡</div>
                    <h3>Wolfnance App</h3>
                    <p>Simulador de trading profesional. Practica con WCoin antes de arriesgar capital real.</p>
                    <span class="link-arrow">Entrar a la App &rarr;</span>
                </a>

                <!-- Card 3: SOLANA -->
                <a href="https://solwolfsfera.com" class="eco-card glass-panel card-sol">
                    <div class="card-icon">🟣</div>
                    <h3>Solana Wolfsfera</h3>
                    <p>El hub para degens. Memecoins, NFTs y el ecosistema más rápido del mundo.</p>
                    <span class="link-arrow">Ir al Sitio &rarr;</span>
                </a>

            </div>
        </div>
    </section>

    <!-- AFFILIATE / PARTNERS SECTION -->
    <section id="partners" class="partners-section">
        <div class="container">
            <h2 class="section-title">Herramientas de la Manada</h2>
            <p class="section-subtitle">Plataformas verificadas y seguras para operar.</p>

            <div class="affiliate-table glass-panel">
                <!-- Header -->
                <div class="aff-row aff-header">
                    <div class="col-logo">Plataforma</div>
                    <div class="col-bonus">Bonus Exclusivo</div>
                    <div class="col-rating">Rating</div>
                    <div class="col-action">Acción</div>
                </div>

                <?php
                $args = array(
                    'post_type' => 'affiliate',
                    'posts_per_page' => -1, // Show all affiliates
                    'orderby' => 'menu_order', // Allow manual ordering if plugin installed, or date
                    'order' => 'ASC',
                );
                $affiliates = new WP_Query($args);

                if ($affiliates->have_posts()):
                    while ($affiliates->have_posts()):
                        $affiliates->the_post();
                        // Get Custom Fields
                        // Get Custom Fields
                        $bonus = get_post_meta(get_the_ID(), 'affiliate_bonus', true);
                        $rating = get_post_meta(get_the_ID(), 'affiliate_rating', true); // Expecting number 1-5
                        $link = get_post_meta(get_the_ID(), 'affiliate_link', true);
                        $image_url = get_post_meta(get_the_ID(), 'affiliate_image_url', true); // External image URL
                
                        // Fallbacks
                        $link = $link ? $link : '#';
                        $rating_stars = str_repeat('⭐', (int) $rating ? (int) $rating : 5);
                        ?>
                        <!-- Dynamic Row -->
                        <div class="aff-row">
                            <div class="col-logo font-bold">
                                <?php
                                if ($image_url) {
                                    echo '<img src="' . esc_url($image_url) . '" style="max-height: 50px; width: auto; border-radius: 4px;" alt="' . esc_attr(get_the_title()) . '">';
                                } elseif (has_post_thumbnail()) {
                                    the_post_thumbnail('medium', array('style' => 'max-height: 50px; width: auto; border-radius: 4px;'));
                                } else {
                                    the_title();
                                }
                                ?>
                            </div>
                            <div class="col-bonus text-gold"><?php echo esc_html($bonus ? $bonus : 'Consultar Oferta'); ?></div>
                            <div class="col-rating"><?php echo $rating_stars; ?></div>
                            <div class="col-action">
                                <a href="<?php echo esc_url($link); ?>" class="btn-gold-sm" target="_blank"
                                    rel="nofollow">Reclamar</a>
                            </div>
                        </div>
                        <?php
                    endwhile;
                    wp_reset_postdata();
                else:
                    ?>
                    <!-- Fallback if no affiliates found -->
                    <div class="aff-row">
                        <div class="col-logo" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">
                            Próximamente: Las mejores herramientas para la manada.
                        </div>
                    </div>
                    <?php
                endif;
                ?>
            </div>
        </div>
    </section>

</main>

<style>
    /* Hero Styles */
    .hero-section {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        overflow: hidden;
        padding-top: 80px;
        /* Account for fixed header */
    }

    .hero-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 70%);
        z-index: -1;
    }

    .hero-bg::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('https://www.transparenttextures.com/patterns/cubes.png');
        /* Subtle texture */
        opacity: 0.05;
        pointer-events: none;
    }

    .wolf-emblem-container {
        width: 140px;
        height: 140px;
        margin: 0 auto 40px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wolf-icon {
        width: 100px;
        height: 100px;
        color: var(--accent-gold);
        z-index: 2;
        filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
    }

    .wolf-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--accent-gold);
        filter: blur(60px);
        opacity: 0.15;
        border-radius: 50%;
        animation: pulse 4s ease-in-out infinite;
    }

    .hero-title {
        font-size: 5rem;
        font-weight: 800;
        margin-bottom: 20px;
        line-height: 1.1;
        letter-spacing: -0.03em;
        background: linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .text-gold {
        background: linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: var(--text-muted);
        max-width: 600px;
        margin: 0 auto 50px;
        font-weight: 400;
    }

    /* Ecosystem Grid */
    .ecosystem-section {
        padding: 120px 0;
        position: relative;
    }

    .section-title {
        text-align: center;
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 20px;
        color: #fff;
        letter-spacing: -0.02em;
    }

    .section-subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.1rem;
        margin-bottom: 80px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 40px;
    }

    .eco-card {
        padding: 50px 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, border-color 0.3s ease;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .eco-card:hover {
        transform: translateY(-10px);
        border-color: rgba(212, 175, 55, 0.3);
        background: rgba(255, 255, 255, 0.04);
    }

    .card-icon {
        font-size: 3rem;
        margin-bottom: 30px;
    }

    .eco-card h3 {
        font-size: 1.75rem;
        margin-bottom: 15px;
        font-weight: 700;
    }

    .eco-card p {
        color: var(--text-muted);
        font-size: 1rem;
        margin-bottom: 40px;
        flex-grow: 1;
        line-height: 1.7;
    }

    .link-arrow {
        color: var(--accent-gold);
        font-weight: 700;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .card-app.featured {
        border: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 0 50px rgba(212, 175, 55, 0.05);
    }

    .card-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--accent-gold);
        color: #000;
        font-size: 0.75rem;
        font-weight: 800;
        padding: 6px 12px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Affiliate Table */
    .partners-section {
        padding-bottom: 150px;
    }

    .affiliate-table {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 24px;
        overflow: hidden;
        backdrop-filter: blur(20px);
    }

    .aff-row {
        display: grid;
        grid-template-columns: 1.5fr 2fr 1fr 1.5fr;
        align-items: center;
        padding: 30px 40px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        transition: background 0.2s ease;
    }

    .aff-row:hover:not(.aff-header) {
        background: rgba(255, 255, 255, 0.02);
    }

    .aff-row:last-child {
        border-bottom: none;
    }

    .aff-header {
        background: rgba(255, 255, 255, 0.02);
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 1.5px;
        padding-top: 25px;
        padding-bottom: 25px;
    }

    .col-logo {
        font-size: 1.1rem;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .col-bonus {
        font-weight: 600;
        font-size: 1rem;
    }

    .col-rating {
        color: #FFD700;
        font-size: 0.9rem;
        letter-spacing: 2px;
    }

    .col-action {
        text-align: right;
    }

    @keyframes pulse {

        0%,
        100% {
            opacity: 0.15;
            transform: scale(1);
        }

        50% {
            opacity: 0.25;
            transform: scale(1.1);
        }
    }

    @media (max-width: 768px) {
        .hero-title {
            font-size: 3rem;
        }

        .aff-row {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 20px;
            padding: 30px 20px;
        }

        .col-action {
            text-align: center;
        }

        .aff-header {
            display: none;
        }

        .col-logo {
            justify-content: center;
            font-size: 1.3rem;
        }
    }
</style>

<?php
get_footer();
