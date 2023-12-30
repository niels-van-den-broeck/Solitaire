import Card from "../models/card";
import Game from "../models/game";
import CardStack from "../models/piles/cardstack";
import { EventValues } from "./events";

export default class GameBus {
    model: Game;

    constructor(model: Game) {
        this.model = model;
    }

    cardsPickedUp(card: Card) {
        const originalStack = card.stack
        if (!originalStack) throw new Error("Card stack not found");

        this.model.floating = originalStack.groupWithCardsOnTop(card);

        this.model.floating.forEach(() => originalStack.remove());
    }

    cardMoved(offsetX: number, offsetY: number) {
        const movedCards = this.model.floating;
        const originalStack = movedCards[0].stack;
        if (!originalStack) throw new Error("Card stack not found");

        movedCards.forEach((card) => {
            card.setPosition(card.x + offsetX, card.y + offsetY);
        });
    }

    cardDropped() {
        const movedCards = this.model.floating;
        this.model.floating = [];

        const originalStack = movedCards[0].stack;
        if (!originalStack) throw new Error("Card stack not found");

        movedCards.forEach((card) => originalStack.add(card));
    }

    tableauChanged(destination: CardStack) {
        const movedCards = this.model.floating;
        this.model.floating = [];

        const originalStack = movedCards[0].stack;
        if (!originalStack) throw new Error("Card stack not found");

        if (destination === originalStack) {
            movedCards.forEach((card) => originalStack.add(card));
            return;
        }

        const allSuccessFull = movedCards.reduce((acc, card) => {
            if (!acc) return acc;

            const moved = this.model.tableau.addCardToStack(destination, card);

            if (!moved) {
                movedCards.forEach((card) => originalStack.add(card));
            }

            return moved
        }, true);

        if (!allSuccessFull) {
            movedCards.forEach((card) => originalStack.add(card));
        }

        originalStack.getTopCard()?.setVisible(true);
        originalStack.getTopCard()?.setPlayable(true);
    }

    stockAccessed() {
        const pulledCard = this.model.stock?.remove();
        
        if (!pulledCard) {
            [...this.model.waste.stack.cards].reverse().forEach((card) => {
                this.model.stock?.add(card);
            });

            return;
        };

        this.model.waste.add(pulledCard);
    }

    foundationFilled(stack: CardStack) {
        const movedCards = this.model.floating;
        this.model.floating = [];

        const targetStack = this.model.foundation.stacks.find(s => s===stack);
        if (!targetStack) throw new Error("Stack not found");

        movedCards.forEach(card => {
            targetStack.add(card);
        })

        if (this.model.foundation.stacks.every((stack) => stack.cards.length === 13)) {
            alert("You win!");
        }
    }

    emit(event: EventValues, data?: unknown) {
        switch (event) {
            case 'event://card-picked-up':
                this.cardsPickedUp(data as Card);
                break;
            case 'event://tableau-changed':
                this.tableauChanged(data as CardStack);
                break;
            case 'event://card-moved':
                this.cardMoved(data as number, data as number);
                break;
            case 'event://stock-accessed':
                this.stockAccessed();
                break;
            case 'event://foundation-filled':
                this.foundationFilled(data as CardStack);
                break;
            case 'event://card-dropped': 
                this.cardDropped();
                break;
            default:
                break;
        }
    }
}