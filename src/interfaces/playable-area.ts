import Card from "../models/card";
import CardStack from "../models/piles/cardstack";

export default interface PlayableArea {
    stacks: CardStack[];

    isAddingAllowed(stack: CardStack, card: Card): boolean;
    addCardToStack(stack: CardStack, card: Card): void;
    render(ctx: CanvasRenderingContext2D): void;
}