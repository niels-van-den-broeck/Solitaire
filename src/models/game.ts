import throttle from 'lodash/throttle';

import Deck from "./deck";
import Foundation from "./piles/foundation";
import Tableau from "./piles/tableau";
import Stock from "./piles/stock";
import GameDimensions from "./game-dimensions";
import Card from "./card";
import Waste from './piles/waste';

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    spriteSheet: HTMLImageElement;
    deck?: Deck;

    stock?: Stock;
    waste: Waste = new Waste();
    foundation: Foundation = new Foundation();
    tableau: Tableau = new Tableau();
    floating: Card[] = [];
    mouseDownListener?: (e: MouseEvent) => void;
    hoverListener?: (e: MouseEvent) => void;

    scale: number = 1;

    constructor(canvas: HTMLCanvasElement, spriteSheet: HTMLImageElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not get canvas context");
        this.ctx = ctx;
        this.spriteSheet = spriteSheet;
    }

    initialize() {
        const deck = new Deck(this.spriteSheet);
        // deck.shuffle();
        deck.cards.reverse();

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                const card = deck.cards.pop();
                if (!card) throw new Error("Ran out of cards");
                if (j === i) {
                    card.setPlayable(true)
                    card.setVisible(true);
                }
                this.tableau.stacks[i].add(card);
            }
        }

        this.stock = new Stock(deck);

        this.addListeners();
    }

    addListeners() {
        this.hoverListener = throttle((e: MouseEvent) => {
            const playableCards = this.getAllPlayableCards();

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
        this.canvas.addEventListener("click", (e) => {
            const canvasCoords = this.canvas.getBoundingClientRect();
            const x = (e.clientX - canvasCoords.left) / this.scale;
            const y = (e.clientY - canvasCoords.top) / this.scale;

            const isStockClicked = this.stock?.cards.isPointInside(x, y);

            if (isStockClicked) {
                const card = this.stock?.cards.remove();

                if (!card) {
                    [...this.waste.stack.cards].reverse().forEach((card) => {
                        this.stock?.add(card);
                    });

                    this.waste.stack.cards = [];
                    
                    return;
                }

                this.waste.add(card);
            }
        });

        this.mouseDownListener = (e: MouseEvent) => {
            const playableCards = this.getAllPlayableCards();

            const canvasCoords = this.canvas.getBoundingClientRect();
            let x = (e.clientX - canvasCoords.left) / this.scale;
            let y = (e.clientY - canvasCoords.top) / this.scale;

            const draggedCards = playableCards.filter((card) => card.isPointInside(x, y));
            if (!draggedCards.length) return;

            const originalStack = draggedCards[0].stack;

            this.floating = draggedCards;
            draggedCards.forEach(card => card.stack?.remove());

            const originalCardCoords = draggedCards.map((card) => ({ x: card.x, y: card.y }));

            const mouseMoveListener = (ev: MouseEvent) => {
                const newX = (ev.clientX - canvasCoords.left) / this.scale;
                const newY = (ev.clientY - canvasCoords.top) / this.scale;

                const offsetX = newX - x;
                const offsetY = newY - y;

                x = newX;
                y = newY;

                draggedCards.forEach((card) => card.setPosition(card.x + offsetX, card.y + offsetY));
            };

            this.canvas.addEventListener("mousemove", mouseMoveListener);

            const mouseUpListener = (ev: MouseEvent) => {
                console.log('up')
                x = (ev.clientX - canvasCoords.left) / this.scale;
                y = (ev.clientY - canvasCoords.top) / this.scale;

                this.canvas.removeEventListener("mousemove", mouseMoveListener);

                const isStockClicked = this.stock?.cards.isPointInside(x, y);

                if (isStockClicked) {
                    this.canvas.removeEventListener('mouseup', mouseUpListener);
                    this.canvas.removeEventListener('mouseleave', mouseUpListener);

                    return;
                }

                const newAreaInTableau = this.tableau.stacks.find(area => area.isPointInside(x, y));
                const newAreaInFoundation = this.foundation.stacks.find(area => area.isPointInside(x, y));

                if (newAreaInTableau) {
                    draggedCards.forEach((card) => {
                        if (this.tableau.addCardToStack(newAreaInTableau, card)) {
                        } else {
                            draggedCards.forEach((card, i) => card.setPosition(originalCardCoords[i].x, originalCardCoords[i].y));
                        }
                    });
                } else if (newAreaInFoundation) {
                    draggedCards.forEach((card) => {
                        if (this.foundation.addCardToStack(newAreaInFoundation, card)) {
                        } else {
                            draggedCards.forEach((card, i) => card.setPosition(originalCardCoords[i].x, originalCardCoords[i].y));
                        }
                    });
                } else {
                    draggedCards.forEach((card, i) => {
                        originalStack?.add(card)
                    });
                }

                this.canvas.removeEventListener('mouseup', mouseUpListener);
                this.canvas.removeEventListener('mouseleave', mouseUpListener);
            };

            this.canvas.addEventListener("mouseup", mouseUpListener);
            this.canvas.addEventListener("mouseleave", mouseUpListener);
        };

        this.canvas.addEventListener("mousedown", this.mouseDownListener);
    }

    getAllPlayableCards() {
        const cards: Card[] = [];

        this.tableau.stacks.forEach((stack) => {
            if (stack.cards.length) cards.push(...stack.cards.filter((card) => card.isPlayable));
        });
        this.foundation.stacks.forEach((stack) => {
            if (stack.cards.length) cards.push(...stack.cards.filter((card) => card.isPlayable));
        });

        if (this.waste.stack.cards.length) {
            const topCard = this.waste.stack.getTopCard();
            cards.push(topCard);
        }

        return cards;
    }

    render() {
        if (!this.stock) throw new Error("Game has not been not initialized");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.scale = this.canvas.width / GameDimensions.width;
        this.ctx.transform(this.scale, 0, 0, this.scale, 0, 0);

        this.stock.render(this.ctx);
        this.foundation.stacks.forEach((stack) => stack.render(this.ctx));
        this.waste.render(this.ctx);
        this.tableau.stacks.forEach((stack) => stack.render(this.ctx));
        this.floating.forEach((card) => card.render(this.ctx));
    }
}