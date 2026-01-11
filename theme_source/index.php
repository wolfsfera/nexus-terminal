<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="container" style="padding-top: 120px; padding-bottom: 60px;">
        <?php
        if (have_posts()):
            while (have_posts()):
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header" style="margin-bottom: 30px;">
                        <?php the_title('<h1 class="entry-title" style="color: #fff;">', '</h1>'); ?>
                    </header>

                    <div class="entry-content" style="color: var(--text-muted);">
                        <?php the_content(); ?>
                    </div>
                </article>
                <?php
            endwhile;
        else:
            ?>
            <p style="color: var(--text-muted);">No se ha encontrado contenido.</p>
            <?php
        endif;
        ?>
    </div>
</main>

<?php
get_footer();
