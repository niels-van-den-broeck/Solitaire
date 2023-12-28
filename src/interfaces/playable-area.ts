import Card from "../models/card";
import CardStack from "../models/piles/cardstack";

export default interface PlayableArea {
    isAddingAllowed(stack: CardStack, card: Card): boolean;
    render(ctx: CanvasRenderingContext2D): void;
}