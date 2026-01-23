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
    },
    {
        id: 'slippage',
        term: 'Slippage (Deslizamiento)',
        definition: 'La diferencia entre el precio que esperas y el que realmente pagas. En memecoins volátiles, necesitas ajustar esto al 5-10% o más.',
        level: 'TECH'
    },
    {
        id: 'rpc',
        term: 'RPC Node',
        definition: 'Tu "antena" para hablar con la Blockchain. Si tu RPC es lento, los Snipers te ganarán siempre.',
        level: 'TECH'
    },

    // 🟣 LEVEL 5: CHARTING (Gráficos)
    {
        id: 'candlestick',
        term: 'Vela Japonesa (Candle)',
        definition: 'Representa el movimiento del precio. El cuerpo es la apertura/cierre, las "mechas" son los máximos y mínimos.',
        level: 'ROOKIE'
    },
    {
        id: 'ath',
        term: 'ATH (All Time High)',
        definition: 'El precio más alto histórico. Mucha gente compra aquí por FOMO y luego pierde dinero.',
        level: 'DEGEN'
    },
    {
        id: 'mcap',
        term: 'Market Cap (Capitalización)',
        definition: 'El valor total de la moneda. (Precio x Suministro Total). Un MCap bajo significa más riesgo pero más potencial multiplicador.',
        level: 'ROOKIE'
    },
    {
        id: 'support',
        term: 'Soporte / Suelo',
        definition: 'Un precio donde los compradores suelen entrar, impidiendo que caiga más.',
        level: 'ROOKIE'
    },
    {
        id: 'resistance',
        term: 'Resistencia / Techo',
        definition: 'Un precio difícil de superar porque mucha gente vende ahí para tomar ganancias.',
        level: 'ROOKIE'
    },
    {
        id: 'correction',
        term: 'Corrección',
        definition: 'Una bajada saludable después de una subida fuerte. No es lo mismo que un "Crash" o un "Dump".',
        level: 'DEGEN'
    },
    {
        id: 'volume',
        term: 'Volumen',
        definition: 'La cantidad de dinero que se ha movido en 24h. Si sube el precio SIN volumen, es una trampa.',
        level: 'TECH'
    }
];
