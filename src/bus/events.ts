export const events = {
    CARD_PICKED_UP: 'event://card-picked-up',
    CARD_MOVED: 'event://card-moved',
    STOCK_ACCESSED: 'event://stock-accessed',
    FOUNDATION_FILLED: 'event://foundation-filled',
    TABLEAU_CHANGED: 'event://tableau-changed',
    CARD_DROPPED: 'event://card-dropped',
} as const;

type Keys = keyof typeof events;
export type EventValues = typeof events[Keys];