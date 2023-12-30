import PlayableArea from "../../interfaces/playable-area";
import Card from "../card";
import CardStack from "./cardstack";
import GameDimensions from "../game-dimensions";


const STACK_INCREMENT = Card.CARD_WIDTH + GameDimensions.DEFAULT_PADDING;
const Y = GameDimensions.DEFAULT_PADDING;

// The four piles at the upper right which you complete to win the game.
export default class Foundation implements PlayableArea {
    stacks: CardStack[] = [new CardStack(GameDimensions.DEFAULT_PADDING, Y, false), new CardStack(GameDimensions.DEFAULT_PADDING + STACK_INCREMENT * 1, Y, false), new CardStack(GameDimensions.DEFAULT_PADDING + STACK_INCREMENT * 2, Y, false), new CardStack(GameDimensions.DEFAULT_PADDING + STACK_INCREMENT * 3, Y, false)];

    isAddingAllowed(stack: CardStack, card: Card) {
        if (!stack.cards.length) return card.value === 1;
        const topCard = stack.cards[stack.cards.length - 1];
        console.log(topCard.type, card.type, topCard.value, card.value)
        return topCard.type === card.type && topCard.value === card.value - 1;
    }

    addCardToStack(stack: CardStack, card: Card) {
        if (!this.stacks.includes(stack)) throw new Error("Invalid stack");

        if (this.isAddingAllowed(stack, card)) {
            card.setPlayable(false);
            card.setVisible(true);
            stack.add(card);

            return true
        }

        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stacks.forEach((stack) => stack.render(ctx));
    }
}