import { throttle } from 'lodash';
import Deck from '../models/deck';
import Game from '../models/game';
import GameView from '../views/game';

import Bus from '../bus/game-bus';
import GameDimensions from '../models/game-dimensions';

export default class GameHandler {
    private canvas: HTMLCanvasElement;
    private model: Game;
    private view: GameView;
    private bus: Bus;

    eventListeners: { [key: string]: ((e: MouseEvent) => void)[] } = {
        mousemove: [],
        mouseup: [],
        mousedown: [],
        mouseleave: [],
        hover: [],
    };

    constructor(canvas: HTMLCanvasElement, spriteSheet: HTMLImageElement) {
        const deck = new Deck(spriteSheet);
        deck.shuffle();

        this.canvas = canvas;
        this.model = new Game(deck);
        this.bus = new Bus(this.model);
        this.view = new GameView(this.model, this.canvas);
        this.addListeners();
    }

    hoverListener = throttle((e: MouseEvent) => {
        if (this.canvas.style.cursor === "grabbing") return;
        const playableCards = this.model.getAllPlayableCards();

        const canvasCoords = this.canvas.getBoundingClientRect();
        const x = (e.clientX - canvasCoords.left) / this.view.scale;
        const y = (e.clientY - canvasCoords.top) / this.view.scale;

        const stockHovered = this.model.stock?.stack.isPointInside(x, y);

        if (stockHovered) {
            this.canvas.style.cursor = "pointer";
            return;
        } else {
            this.canvas.style.cursor = "default";
        }

        const hoveredCards = playableCards.filter((card) => card.isPointInside(x, y));
        if (hoveredCards.length) {
            this.canvas.style.cursor = "grab";
        } else {
            this.canvas.style.cursor = "default";
        }
    }, 100);

    private mouseDown(e: MouseEvent) {
        const playableCards = this.model.getAllPlayableCards();

        const canvasCoords = this.canvas.getBoundingClientRect();
        let x = (e.clientX - canvasCoords.left) / this.view.scale;
        let y = (e.clientY - canvasCoords.top) / this.view.scale;

        const draggedCard = playableCards
            .find((card) => card.isPointInside(x, y));

        if (draggedCard) {
            this.bus.emit('event://card-picked-up', draggedCard);
            this.canvas.style.cursor = "grabbing";
        }

        const mouseMove = this.createMoveListener(canvasCoords, x, y);
        this.eventListeners['mousemove'].push(mouseMove);
        this.canvas.addEventListener("mousemove", mouseMove);

        const mouseUp = this.privateCreateReleaseListener(canvasCoords, x, y);

        this.eventListeners['mouseup'].push(mouseUp);
        this.eventListeners['mouseleave'].push(mouseUp);

        this.canvas.addEventListener("mouseup", mouseUp);
        this.canvas.addEventListener("mouseleave", mouseUp);
    }
    
    private createMoveListener(canvasCoords: DOMRect, startX: number, startY: number) {
        let x = startX;
        let y = startY;

        return (ev: MouseEvent) => {
            const newX = (ev.clientX - canvasCoords.left) / this.view.scale;
            const newY = (ev.clientY - canvasCoords.top) / this.view.scale;

            const offsetX = newX - x;
            const offsetY = newY - y;

            x = newX;
            y = newY;

            this.model.floating.forEach((card) => card.setPosition(card.x + offsetX, card.y + offsetY));
        };
    }

    private clearTemporaryListeners() {
        this.eventListeners['mousemove'].forEach((listener) => {
            this.canvas.removeEventListener("mousemove", listener);
        });
        this.eventListeners['mouseup'].forEach((listener) => {
            this.canvas.removeEventListener("mouseup", listener);
        });
        this.eventListeners['mouseleave'].forEach((listener) => {
            this.canvas.removeEventListener("mouseleave", listener);
        });
    }
    
    privateCreateReleaseListener(canvasCoords: DOMRect, startX: number, startY: number) {
        return (ev: MouseEvent) => {
            this.canvas.style.cursor = "default";
            const x = (ev.clientX - canvasCoords.left) / this.view.scale;
            const y = (ev.clientY - canvasCoords.top) / this.view.scale;
            
            const isClick = Math.abs(x - startX) < GameDimensions.DEFAULT_PADDING && Math.abs(y - startY) < GameDimensions.DEFAULT_PADDING;
            const isStockClicked = isClick && this.model.stock?.stack.isPointInside(x, y);

            if (isStockClicked) {
                this.bus.emit('event://stock-accessed');
            }

            if (isClick) {
                const possibleMoves =  this.model.findValidMove();

                if (possibleMoves?.foundation) {
                    this.bus.emit('event://foundation-filled', possibleMoves.foundation);
                } else if (possibleMoves?.tableau) {
                    this.bus.emit('event://tableau-changed', possibleMoves.tableau);
                } else {
                    if (this.model.floating.length) this.bus.emit('event://card-dropped', undefined);
                }

                this.clearTemporaryListeners();
                
                return;
            }

            const newAreaInTableau = this.model.tableau.stacks.find(area => area.isPointInside(x, y));
            const newAreaInFoundation = this.model.foundation.stacks.find(area => area.isPointInside(x, y));

            if (newAreaInTableau) {
                this.bus.emit('event://tableau-changed', newAreaInTableau);
            } else if (newAreaInFoundation) {
                this.bus.emit('event://foundation-filled', newAreaInFoundation);
            } else {
                this.bus.emit('event://card-dropped', undefined)
            }

            this.clearTemporaryListeners();
        };
    }

    private addListeners() {
        const mouseDown = this.mouseDown.bind(this);
        this.eventListeners['mousedown'].push(mouseDown);
        this.canvas.addEventListener("mousedown", mouseDown);

        const hover = this.hoverListener.bind(this);
        this.eventListeners['hover'].push(hover);
        this.canvas.addEventListener("mousemove", hover);
    }

    public startGame(): void {
        setInterval(() => {
            const canvasDimensions = this.canvas.getClientRects().item(0);
            if (!canvasDimensions) throw new Error("Could not get canvas dimensions");

            this.canvas.width = canvasDimensions.width;
            this.canvas.height = canvasDimensions.height;

            this.view.render();
        }, 1000 / 60);
    }
}