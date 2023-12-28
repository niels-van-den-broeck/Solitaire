import CardStack from "./piles/cardstack";
import Deck from "./deck";
import Foundation from "./piles/foundation";
import Tableau from "./piles/tableau";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    spriteSheet: HTMLImageElement;
    deck?: Deck;
    
    pile: CardStack;
    waste: CardStack;
    foundation: Foundation = new Foundation();
    tableau: Tableau = new Tableau();

    constructor(canvas: HTMLCanvasElement, spriteSheet: HTMLImageElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not get canvas context");
        this.ctx = ctx;
        this.spriteSheet = spriteSheet;
        this.pile = new CardStack(canvas.width - 200, 50, 0, false);
        this.waste = new CardStack(canvas.width - 350, 50);
    }

    initialize() {
        this.deck = new Deck(this.spriteSheet);
        this.deck.shuffle();

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                const card = this.deck.cards.pop();
                if (!card) throw new Error("Ran out of cards");
                this.tableau.stacks[i].add(card);
            }
        }

        while (this.deck.cards.length > 0) {
            const card = this.deck.cards.pop();
            if (!card) throw new Error("Ran out of cards");
            this.pile.add(card);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.pile.render(this.ctx);

        this.tableau.stacks.forEach((stack) => stack.render(this.ctx));
        this.foundation.stacks.forEach((stack) => stack.render(this.ctx));
    }
}