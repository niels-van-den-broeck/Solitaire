import Game from '../models/game';
import GameDimensions from '../models/game-dimensions';

export default class GameView {
    private model: Game;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public scale: number;

    constructor(model: Game, canvas: HTMLCanvasElement) {
        this.model = model;
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not get canvas context");
        this.ctx = ctx;
        this.scale = this.canvas.width / GameDimensions.width;
    }

    public render(): void {
        this.scale = this.canvas.width / GameDimensions.width;

        if (!this.model.stock) throw new Error("Game has not been not initialized");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.transform(this.scale, 0, 0, this.scale, 0, 0);

        this.model.stock?.render(this.ctx);
        this.model.waste.render(this.ctx);

        this.model.foundation.stacks.forEach((stack) => stack.render(this.ctx));
        this.model.tableau.stacks.forEach((stack) => stack.render(this.ctx));
        this.model.floating.forEach((card) => card.render(this.ctx));
        // Render the game view based on the model's state

        // You can access the model's properties and methods here
    }

    // Other view methods and event handlers can be defined here
}
