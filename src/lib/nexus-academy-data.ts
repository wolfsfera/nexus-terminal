export type TermLevel = 'ROOKIE' | 'DEGEN' | 'DANGER' | 'TECH';

export interface AcademyTerm {
    id: string;
    term: string;
    definition: string;
    example?: string;
    level: TermLevel;
}

export const ACADEMY_DATA: AcademyTerm[] = [
    // 🟢 LEVEL 1: ROOKIE (Básicos)
    {
        id: 'blockchain',
        term: 'Blockchain',
        definition: 'El libro de contabilidad digital, público e imborrable donde se anotan todas las transacciones. En nuestro caso: Solana.',
        level: 'ROOKIE'
    },
    {
        id: 'wallet',
        term: 'Wallet (Billetera)',
        definition: 'Tu cuenta bancaria cripto (ej: Phantom). Tienes una Llave Pública (para recibir) y una Llave Privada (¡SECRETA!).',
        level: 'ROOKIE'
    },
    {
        id: 'gas',
        term: 'Gas Fee',
        definition: 'La "propina" que pagas a la red por procesar tu operación. En Solana suele ser menos de 1 céntimo.',
        level: 'ROOKIE'
    },

    // 🟡 LEVEL 2: DEGEN SLANG (La Calle)
    {
        id: 'hype',
        term: 'Hype',
        definition: 'Entusiasmo exagerado por una moneda. Es el combustible principal de los memecoins.',
        level: 'DEGEN'
    },
    {
        id: 'fomo',
        term: 'FOMO',
        definition: '"Fear Of Missing Out". El miedo a perderse una subida, que te hace comprar caro y sin pensar.',
        example: '"Vi la vela verde, me entró FOMO y compré en el pico."',
        level: 'DEGEN'
    },
    {
        id: 'diamond_hands',
        term: 'Diamond Hands 💎🙌',
        definition: 'Alguien que NO vende sus monedas aunque el precio caiga un 90%. Aguantar hasta el final.',
        level: 'DEGEN'
    },
    {
        id: 'paper_hands',
        term: 'Paper Hands 🧻🙌',
        definition: 'Lo contrario. Alguien que vende a la mínima señal de peligro o por una ganancia ridícula.',
        level: 'DEGEN'
    },
    {
        id: 'jeet',
        term: 'Jeet',
        definition: 'Término despectivo para quien vende por "micros-ganancias" (ej: ganar $2 para comprarse una hamburguesa), frenando la subida.',
        level: 'DEGEN'
    },
    {
        id: 'whale',
        term: 'Whale (Ballena) 🐋',
        definition: 'Inversor con muchísimo dinero. Si entra, el precio vuela. Si sale, provoca un terremoto.',
        level: 'DEGEN'
    },

    // 🔴 LEVEL 3: DANGER ZONE (Peligros)
    {
        id: 'rug_pull',
        term: 'Rug Pull (Alfombra) 📉',
        definition: 'La estafa clásica. El creador retira toda la liquidez (dinero) y se larga, dejando el precio en cero.',
        level: 'DANGER'
    },
    {
        id: 'honeypot',
        term: 'Honeypot (Tarro de Miel) 🍯',
        definition: 'Una trampa en el código: Puedes comprar la moneda, pero NO puedes venderla. Tu dinero queda atrapado para siempre.',
        level: 'DANGER'
    },
    {
        id: 'sniper',
        term: 'Sniper Bot 🔫',
        definition: 'Un robot programado para comprar en el milisegundo 0 de un lanzamiento, antes que cualquier humano.',
        level: 'DANGER'
    },
    {
        id: 'insider',
        term: 'Insider (Infiltrado)',
        definition: 'Alguien con información privilegiada (amigo del dev) que compra antes de que el público sepa que existe la moneda.',
        level: 'DANGER'
    },

    // 🔵 LEVEL 4: TECH (Lo que mira el Scanner)
    {
        id: 'liquidity',
        term: 'Liquidez (LP)',
        definition: 'El dinero real (SOL) disponible en el pool para respaldar las monedas. Sin liquidez, no puedes vender.',
        level: 'TECH'
    },
    {
        id: 'locked_liq',
        term: 'Liquidez Bloqueada (Burned)',
        definition: 'Cuando el creador "quema" o bloquea las fichas de liquidez. Significa que NO puede hacer Rug Pull fácilmente. (SEGURO)',
        level: 'TECH'
    },
    {
        id: 'mint_auth',
        term: 'Mint Authority',
        definition: 'La "impresora de billetes". Si está activada, el creador puede crear millones de monedas gratis y hundir el precio. (PELIGROSO)',
        level: 'TECH'
    },
    {
        id: 'freeze_auth',
        term: 'Freeze Authority',
        definition: 'El "botón de pausa". Permite al creador congelar tu billetera específica para que no puedas vender. (MUY PELIGROSO)',
        level: 'TECH'
    }
];
