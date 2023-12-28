import CardStack from "./cardstack";

export default class Foundation {
    stacks: CardStack[] = [new CardStack(50, 50), new CardStack(200, 50), new CardStack(350, 50), new CardStack(500, 50)];

    render(ctx: CanvasRenderingContext2D) {
        this.stacks.forEach((stack) => stack.render(ctx));
    }
}