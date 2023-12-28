import PlayableArea from "../../interfaces/playable-area";
import Card from "../card";
import CardStack from "./cardstack";
import GameDimensions from "./game-dimensions";


const LAST_STACK_X = GameDimensions.width - GameDimensions.DEFAULT_PADDING - Card.CARD_WIDTH;
const STACK_DECREMENT = Card.CARD_WIDTH + GameDimensions.DEFAULT_PADDING;
const Y = 50;

// The four piles at the upper right which you complete to win the game.
export default class Foundation implements PlayableArea {
    stacks: CardStack[] = [new CardStack(LAST_STACK_X - STACK_DECREMENT * 3, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 2, Y), new CardStack(LAST_STACK_X - STACK_DECREMENT * 1, Y), new CardStack(LAST_STACK_X, Y)];

    isAddingAllowed(stack: CardStack, card: Card) {
        if (!stack.cards.length) return card.value === 1;
        const topCard = stack.cards[stack.cards.length - 1];

        return topCard.type === card.type && topCard.value === card.value - 1;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.stacks.forEach((stack) => stack.render(ctx));
    }
}