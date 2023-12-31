import Card from "../card";
import GameDimensions from "../game-dimensions";

const STACK_PADDING = GameDimensions.height * 0.03;
export default class CardStack {
    cards: Card[] = [];
    readonly x: number;
    readonly y: number;
    stackdown: boolean;

    STACK_PADDING = STACK_PADDING;

    constructor(x: number, y: number, stackdown = true) {
        this.x = x;
        this.y = y;
        this.stackdown = stackdown;
    }

    add(card: Card) {
        this.cards.push(card);
        card.stack = this;
        this.updateCardCoords();
    }

    remove() {
        if (!this.cards.length) return null;
        const card = this.cards.pop();
        this.updateCardCoords();

        return card;
    }

    getTopCard() {
        return this.cards[this.cards.length - 1];
    }

    isTopCard(card: Card) {
        return card === this.getTopCard();
    }

    groupWithCardsOnTop(card: Card) {
        const index = this.cards.indexOf(card);

        if (index === -1) throw new Error("Card not found in stack");
        
        return this.cards.slice(index, this.cards.length);
    }

    isPointInside(x: number, y: number) {
        if (!this.cards.length) {
            return (
                x >= this.x &&
                x <= this.x + Card.CARD_WIDTH &&
                y >= this.y &&
                y <= this.y + Card.CARD_HEIGHT
            );
        }
        
        const topCard = this.cards[this.cards.length - 1];
        
        return topCard.isPointInside(x, y);
    }

    updateCardCoords() {
        this.cards.forEach((card, i) => {
            const y = this.stackdown ? this.y + i * STACK_PADDING : this.y;
            card.setPosition(this.x, y);
        });
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.cards.length) {
            ctx.strokeRect(this.x, this.y, Card.CARD_WIDTH, Card.CARD_HEIGHT);
            return;
        }

        this.cards.forEach((card, i) => {
            card.render(ctx);
        });
    }
}