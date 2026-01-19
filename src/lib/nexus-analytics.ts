type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
};

// Helper to track events safely
export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    } else {
        console.warn("GA4 not initialized", { action, category, label });
    }
};

// PRE-DEFINED EVENTS FOR NEXUS
export const ANALYTICS = {
    // 1. Scanner Events
    SCAN_ATTEMPT: (ticker: string) => trackEvent({
        action: 'scan_attempt',
        category: 'Scanner',
        label: ticker
    }),
    SCAN_SUCCESS: (ticker: string, riskLevel: string) => trackEvent({
        action: 'scan_complete',
        category: 'Scanner',
        label: `${ticker} - ${riskLevel}`
    }),

    // 2. Money Events
    OPEN_PAYMENT: () => trackEvent({
        action: 'open_payment_modal',
        category: 'Revenue',
        label: 'User clicked Top Up'
    }),
    PURCHASE_COMPLETE: (pack: string, amount: number) => trackEvent({
        action: 'purchase_success',
        category: 'Revenue',
        label: pack,
        value: amount
    }),

    // 3. Education
    OPEN_ACADEMY: () => trackEvent({
        action: 'open_academy',
        category: 'Education',
        label: 'Academy Modal'
    }),
};
