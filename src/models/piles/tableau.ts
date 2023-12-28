import CardStack from "./cardstack";

export default class Tableau {
    stacks: CardStack[] = [new CardStack(50, 400), new CardStack(200, 400), new CardStack(350, 400), new CardStack(500, 400), new CardStack(650, 400), new CardStack(800, 400), new CardStack(950, 400)];
    
    render(ctx: CanvasRenderingContext2D) {
        this.stacks.forEach((stack) => stack.render(ctx));
    }
}