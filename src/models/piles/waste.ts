import Card from "../card";
import CardStack from "./cardstack";
import GameDimensions from "../game-dimensions";

const X = GameDimensions.width - (GameDimensions.DEFAULT_PADDING + Card.CARD_WIDTH) * 2;
const Y = GameDimensions.DEFAULT_PADDING;

// TODO Deck size
export default class Waste {
    stack: CardStack;

    constructor() {
        console.log(X, Y)
        this.stack = new CardStack(X, Y, false);
    }

    add(card: Card) {
        this.stack.cards.forEach((card) => {
            card.setPlayable(false);
            card.setVisible(true);
        });
        
        card.setPlayable(true);
        card.setVisible(true);

        this.stack.add(card);
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stack.render(ctx)
    }
}