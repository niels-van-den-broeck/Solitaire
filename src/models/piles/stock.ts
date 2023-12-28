import Deck from "../deck";
import CardStack from "./cardstack";
import GameDimensions from "./game-dimensions";

export default class Stock {
    cards: CardStack;

    constructor(deck:Deck) {
        this.cards = new CardStack(GameDimensions.DEFAULT_PADDING, GameDimensions.DEFAULT_PADDING, 0, false);

        while (deck.cards.length > 0) {
            const card = deck.cards.pop();
            if (!card) throw new Error("Ran out of cards");
            this.cards.add(card);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        this.cards.render(ctx);
    }
}