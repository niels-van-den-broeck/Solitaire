import Card from "../card";
import Deck from "../deck";
import CardStack from "./cardstack";
import GameDimensions from "../game-dimensions";

export default class Stock {
    stack: CardStack;

    constructor(deck:Deck) {
        this.stack = new CardStack(GameDimensions.width - GameDimensions.DEFAULT_PADDING - Card.CARD_WIDTH, GameDimensions.DEFAULT_PADDING, false);

        while (deck.cards.length > 0) {
            const card = deck.cards.pop();
            if (!card) throw new Error("Ran out of cards");
            this.add(card);
        }
    }

    add(card: Card) {
        card.setPlayable(false);
        card.setVisible(false);
        this.stack.add(card);
    }

    remove() {
        return this.stack.remove()
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stack.render(ctx);
    }
}