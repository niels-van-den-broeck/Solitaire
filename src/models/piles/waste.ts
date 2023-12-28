import Card from "../card";
import CardStack from "./cardstack";
import GameDimensions from "../game-dimensions";

const X = GameDimensions.DEFAULT_PADDING * 2 + Card.CARD_WIDTH;
const Y = GameDimensions.DEFAULT_PADDING;

// TODO Deck size
export default class Waste {
    stack: CardStack;

    constructor() {
        this.stack = new CardStack(X, Y, false);
    }

    add(card: Card) {
        this.stack.cards.forEach((card) => {
            card.setPlayable(false);
            card.setVisible(false);
        });
        
        card.setPlayable(true);
        card.setVisible(true);

        this.stack.add(card);
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stack.render(ctx)
    }
}