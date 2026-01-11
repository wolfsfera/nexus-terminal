<footer id="colophon" class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <h2 class="footer-logo">WOLFSFERA</h2>
                <p class="footer-desc">El ecosistema definitivo para el inversor de criptomonedas moderno. Análisis,
                    herramientas y comunidad.</p>
            </div>

            <div class="footer-links">
                <h4>Ecosistema</h4>
                <ul>
                    <li><a href="https://xrpwolfsfera.com">XRP Wolfsfera</a></li>
                    <li><a href="https://solwolfsfera.com">Solana Wolfsfera</a></li>
                    <li><a href="https://app.wolfsfera.com">Wolfnance App</a></li>
                </ul>
            </div>

            <div class="footer-legal">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Aviso Legal</a></li>
                    <li><a href="#">Política de Privacidad</a></li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </div>

        <div class="site-info container">
            <div class="copyright">
                &copy; <?php echo date('Y'); ?> Wolfsfera. Todos los derechos reservados.
            </div>
            <div class="legal-links">
                <a href="/aviso-legal">Aviso Legal</a>
                <a href="/privacidad">Privacidad</a>
                <a href="/cookies">Cookies</a>
            </div>
        </div>
    </div>
</footer>
</div><!-- #page -->

<style>
    .site-footer {
        background: #000;
        padding: 60px 0 20px;
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        margin-top: 80px;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 40px;
        margin-bottom: 40px;
    }

    .footer-logo {
        color: var(--accent-gold);
        margin-bottom: 15px;
    }

    .footer-desc {
        color: var(--text-muted);
        font-size: 0.9rem;
        max-width: 300px;
    }

    .footer-links h4,
    .footer-legal h4 {
        color: #fff;
        margin-bottom: 20px;
        text-transform: uppercase;
        font-size: 0.9rem;
    }

    .footer-links ul,
    .footer-legal ul {
        list-style: none;
    }

    .footer-links li,
    .footer-legal li {
        margin-bottom: 10px;
    }

    .footer-links a,
    .footer-legal a {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .footer-links a:hover,
    .footer-legal a:hover {
        color: var(--accent-gold);
    }

    .site-info {
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 20px;
        color: #555;
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .footer-desc {
            margin: 0 auto;
        }
    }
</style>

<?php wp_footer(); ?>

</body>

</html>