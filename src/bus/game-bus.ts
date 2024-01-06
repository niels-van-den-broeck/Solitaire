import Card from "../models/card";
import Game from "../models/game";
import CardStack from "../models/piles/cardstack";
import { EventValues } from "./events";
import soundBus from "./sound-bus";

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
        if (!movedCards.length) return false;
        this.model.floating = [];

        const originalStack = movedCards[0].stack;
        if (!originalStack) throw new Error("Card stack not found");

        movedCards.forEach((card) => originalStack.add(card));

        return true;
    }

    tableauChanged(destination: CardStack) {
        const movedCards = this.model.floating;
        this.model.floating = [];

        const originalStack = movedCards[0].stack;
        if (!originalStack) throw new Error("Card stack not found");

        if (destination === originalStack) {
            movedCards.forEach((card) => originalStack.add(card));
            return false;
        }

        const allSuccessFull = movedCards.reduce((acc, card) => {
            if (!acc) return acc;

            const moved = this.model.tableau.addCardToStack(destination, card);

            return moved
        }, true);

        if (!allSuccessFull) {
            movedCards.forEach((card) => originalStack.add(card));
        }

        originalStack.getTopCard()?.setVisible(true);
        originalStack.getTopCard()?.setPlayable(true);

        return allSuccessFull;
    }

    stockAccessed() {
        let pulledCard = this.model.stock?.remove();
        
        if (!pulledCard) {
            [...this.model.waste.stack.cards].reverse().forEach((card) => {
                this.model.stock?.add(card);
                this.model.waste.remove();
            });

            pulledCard = this.model.stock?.remove();
        };

        if (pulledCard) this.model.waste.add(pulledCard);

        return Boolean(pulledCard);
    }

    foundationFilled(stack: CardStack) {
        const movedCards = this.model.floating;
        const originalStack = movedCards[0].stack;

        if (!originalStack) throw new Error("Card stack not found");

        this.model.floating = [];

        const targetStack = this.model.foundation.stacks.find(s => s===stack);
        if (!targetStack) throw new Error("Stack not found");

        const allSuccessFull = movedCards.reduce((acc, card) => {
            if (!acc) return acc;

            const moved = this.model.foundation.addCardToStack(stack, card);

            return moved
        }, Boolean(movedCards.length));

        if (!allSuccessFull) {
            movedCards.forEach((card) => originalStack.add(card));
        }

        originalStack.getTopCard()?.setVisible(true);
        originalStack.getTopCard()?.setPlayable(true);

        return allSuccessFull;
    }

    emit(event: EventValues, data?: unknown) {
        console.log({event, data})
        switch (event) {
            case 'event://card-picked-up':
                this.cardsPickedUp(data as Card);
                break;
            case 'event://tableau-changed':
                this.tableauChanged(data as CardStack) && soundBus.emit('event://tableau-changed');
                break;
            case 'event://card-moved':
                this.cardMoved(data as number, data as number);
                break;
            case 'event://stock-accessed':
                this.stockAccessed() && soundBus.emit('event://stock-accessed');
                break;
            case 'event://foundation-filled':
                this.foundationFilled(data as CardStack) && soundBus.emit('event://foundation-filled');
                break;
            case 'event://card-dropped': 
                this.cardDropped();
                break;
            default:
                break;
        }
    }
}