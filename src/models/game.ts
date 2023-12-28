import throttle from 'lodash/throttle';

import CardStack from "./piles/cardstack";
import Deck from "./deck";
import Foundation from "./piles/foundation";
import Tableau from "./piles/tableau";
import Stock from "./piles/stock";
import GameDimensions from "./piles/game-dimensions";
import Card from "./card";


export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    spriteSheet: HTMLImageElement;
    deck?: Deck;
    
    stock?: Stock;
    waste: CardStack;
    foundation: Foundation = new Foundation();
    tableau: Tableau = new Tableau();
    clickListener?: (e: MouseEvent) => void;
    hoverListener?: (e: MouseEvent) => void;

    scale: number = 1;

    constructor(canvas: HTMLCanvasElement, spriteSheet: HTMLImageElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not get canvas context");
        this.ctx = ctx;
        this.spriteSheet = spriteSheet;
        this.waste = new CardStack(canvas.width - 350, 50);
    }

    initialize() {
        const deck = new Deck(this.spriteSheet);
        deck.shuffle();

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                const card = deck.cards.pop();
                if (!card) throw new Error("Ran out of cards");
                this.tableau.stacks[i].add(card);
            }
        }

        this.stock = new Stock(deck);

        this.hoverListener = throttle((e: MouseEvent) => {
            const playableCards = this.getAllPlayableCards();
            console.log(playableCards)
            const canvasCoords = this.canvas.getBoundingClientRect();
            const x = (e.clientX - canvasCoords.left) / this.scale;
            const y = (e.clientY - canvasCoords.top) / this.scale;

            const hoveredCards = playableCards.filter((card) => card.isPointInside(x, y));
            if (hoveredCards.length) {
                this.canvas.style.cursor = "pointer";
            } else {
                this.canvas.style.cursor = "default";
            }
        }, 100);

        this.canvas.addEventListener("mousemove", this.hoverListener);
    }

    getAllPlayableCards() {
        const cards: Card[] = [];

        this.tableau.stacks.forEach((stack) => {
            if (stack.cards.length) cards.push(...stack.cards.filter((card) => card.isShowing));
        });

        this.foundation.stacks.forEach((stack) => {
            if (stack.cards.length) cards.push(...stack.cards.filter((card) => card.isShowing));
        });

        return cards;
    }

    update() {
        if (this.clickListener) this.canvas.removeEventListener("click", this.clickListener);

        this.clickListener = (e: MouseEvent) => {
            const playableCards = this.getAllPlayableCards();

            const canvasCoords = this.canvas.getBoundingClientRect();
            const x = (e.clientX - canvasCoords.left) / this.scale;
            const y = (e.clientY - canvasCoords.top) / this.scale;

            const clickedCards = playableCards.filter((card) => card.isPointInside(x, y));
            console.log(clickedCards)
        };
        
        this.canvas.addEventListener("click", this.clickListener);
    }

    render() {
        if (!this.stock) throw new Error("Game has not been not initialized");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.scale = this.canvas.width / GameDimensions.width;
        this.ctx.transform(this.scale, 0, 0, this.scale, 0, 0);

        this.stock.render(this.ctx);
        this.tableau.stacks.forEach((stack) => stack.render(this.ctx));
        this.foundation.stacks.forEach((stack) => stack.render(this.ctx));
    }
}