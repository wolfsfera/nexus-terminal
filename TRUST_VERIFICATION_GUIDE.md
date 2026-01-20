# Guía de Verificación de Confianza y Desbloqueo de Dominio

Para eliminar las advertencias de "Sitio Malicioso" o "Phishing" en wallets como Phantom o Solflare, debemos validar técnicamente el dominio y enviar apelaciones a las listas de seguridad.

## 1. Validación Técnica (Completado por Mí) ✅
He actualizado los archivos de tu servidor para cumplir con los estándares de seguridad:
- **`security.txt`**: Define contacto de seguridad y políticas.
- **`robots.txt`**: Permite indexación legítima.
- **`PaymentModal`**: Ahora incluye un **MEMO** en cada transacción. Esto le dice a la blockchain "Esto es un pago por Créditos Nexus", lo cual es una señal fuerte de legitimidad (los drainers raramente usan memos descriptivos).

## 2. Acciones Requeridas por Ti (Vital para Desbloqueo) 🚀

Debes rellenar los siguientes formularios para avisar a los proveedores de seguridad que somos legítimos.

### A. Apelación a Blowfish (Proveedor de Seguridad de Phantom)
Blowfish es el motor principal que marca sitios como peligrosos en Solana.
1. Ve a: [https://blowfish.xyz/dispute-scanning](https://blowfish.xyz/dispute-scanning) (o busca "Blowfish XYZ Dispute")
2. **Domain**: `scanner.wolfsfera.com` (o el dominio que estés usando)
3. **Description**: 
   > "We are Wolfsfera Nexus, a legitimate utility tool for analyzing Solana tokens. We accept payments for credits using standard Solana transfers with Memos. We are NOT a drainer. We have implemented security.txt and transparent coding practices. Please whitelist us."

### B. Registro en GitHub de Solana (Opcional pero Recomendado)
Si tienes un token propio o quieres ser "oficial", registra tu proyecto en el ecosistema de Solana.

### C. Verificar en Google Search Console
Asegúrate de tener la propiedad del dominio verificada en Google. Esto ayuda a la reputación global del dominio.

## 3. Pruebas de Pago
Una vez hechos los cambios en el código (que ya he aplicado), intenta hacer una compra pequeña (Iniciado).
- Si la wallet te muestra una advertencia roja: **Debes hacer el paso A (Blowfish) sí o sí.**
- Si el pago pasa: ¡Estamos listos!

---
**Nota**: Los cambios de reputación pueden tardar 24-48 horas después de enviar los formularios.
