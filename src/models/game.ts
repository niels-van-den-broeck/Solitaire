import Deck from "./deck";
import Foundation from "./piles/foundation";
import Tableau from "./piles/tableau";
import Stock from "./piles/stock";
import Card from "./card";
import Waste from './piles/waste';

export default class Game {
    deck?: Deck;

    stock?: Stock;
    waste: Waste = new Waste();
    foundation: Foundation = new Foundation();
    tableau: Tableau = new Tableau();
    floating: Card[] = [];


    scale: number = 1;

    constructor(deck: Deck) {
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
    }

    checkForWin() {
        if (this.foundation.stacks.every((stack) => stack.cards.length === 13)) {
            alert("You win!");
        }
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
}