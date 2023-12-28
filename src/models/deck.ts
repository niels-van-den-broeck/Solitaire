import Card from "./card";

export default class Deck {
  cards: Card[];

  constructor(image: HTMLImageElement) {
    this.cards = Card.TYPES.map((type) => {
      return new Array(13)
        .fill(null)
        .map((x, i) => new Card(type, i + 1, image));
    }).flat();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
}
