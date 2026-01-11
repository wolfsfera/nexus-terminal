<?php
/**
 * Template Name: Legal Page
 * Description: A clean, focused template for legal content (Privacy Policy, Terms, etc.)
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="container legal-container">
        <article id="post-<?php the_ID(); ?>" <?php post_class('glass-panel legal-content'); ?>>
            <header class="entry-header">
                <?php the_title('<h1 class="entry-title text-gold">', '</h1>'); ?>
            </header>

            <div class="entry-content">
                <?php
                while (have_posts()):
                    the_post();
                    the_content();
                endwhile;
                ?>
            </div>
        </article>
    </div>
</main>

<?php
get_footer();
