import Card from "../card";
import GameDimensions from "./game-dimensions";

const STACK_PADDING = GameDimensions.height * 0.02;
export default class CardStack {
    cards: Card[] = [];
    x: number;
    y: number;
    amountCardsShowing: number;
    stackdown: boolean;
    removable: boolean;

    constructor(x: number, y: number, amountCardsShowing = 1, stackdown = true, removable = true) {
        this.x = x;
        this.y = y;
        this.amountCardsShowing = amountCardsShowing;
        this.stackdown = stackdown;
        this.removable = removable;
    }

    add(card: Card) {
        this.cards.push(card);
    }

    remove() {
        return this.cards.pop();
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.cards.length) {

            ctx.strokeRect(this.x, this.y, Card.CARD_WIDTH, Card.CARD_HEIGHT);
            return;
        }

        this.cards.forEach((card, i) => {
            const y = this.stackdown ? this.y + i * STACK_PADDING : this.y;
            card.render(ctx, this.x, y, this.cards.length - i <= this.amountCardsShowing);
        });
    }
}