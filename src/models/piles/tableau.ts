import PlayableArea from "../../interfaces/playable-area";
import Card from "../card";
import CardStack from "./cardstack";
import GameDimensions from "../game-dimensions";

const LAST_STACK_X = GameDimensions.width - GameDimensions.DEFAULT_PADDING - Card.CARD_WIDTH;
const STACK_DECREMENT = Card.CARD_WIDTH + GameDimensions.DEFAULT_PADDING;
const Y = GameDimensions.DEFAULT_PADDING * 4 + Card.CARD_HEIGHT;

export default class Tableau implements PlayableArea {
    stacks: CardStack[] = [new CardStack(LAST_STACK_X - STACK_DECREMENT * 6, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 5, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 4, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 3, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 2, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 1, Y), new CardStack(LAST_STACK_X, Y)];
    
    isAddingAllowed(stack: CardStack, card: Card) {
        if (!stack.cards.length) return card.value === 13;
        const topCard = stack.getTopCard();

        return card.determineColour() !== topCard.determineColour() && topCard.value === card.value + 1;
    }

    addCardToStack(stack: CardStack, card: Card) {
        if (!this.stacks.includes(stack)) throw new Error("Invalid stack");

        if (this.isAddingAllowed(stack, card)) {
            card.setPlayable(true);
            card.setVisible(true);
            stack.add(card);

            return true;
        }

        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stacks.forEach((stack) => stack.render(ctx));
    }
}