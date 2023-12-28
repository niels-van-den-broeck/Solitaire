const SPRITE_SHEET_OFFSET = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3,
  cardBacks: 4,
};

const CARD_SPRITE_WIDTH = 71;
const CARD_SPRITE_HEIGHT = 96;

export default class Card {
    type: keyof typeof SPRITE_SHEET_OFFSET;
    value: number;
    image: HTMLImageElement;

    static TYPES = ["spades", "hearts", "clubs", "diamonds"] as const;
    static CARD_WIDTH = CARD_SPRITE_WIDTH * 2;
    static CARD_HEIGHT = CARD_SPRITE_HEIGHT * 2;

    constructor(type: keyof typeof SPRITE_SHEET_OFFSET, value: number, image: HTMLImageElement) {
      this.type = type;
      this.value = value;
      this.image = image;
    }
  
    render(ctx: CanvasRenderingContext2D, x: number, y: number, showFront = true) {
      const offset = this.value - 1;

      const offsetParameter = showFront ? this.type : 'cardBacks';

      ctx.drawImage(
        this.image,
        offset * CARD_SPRITE_WIDTH,
        CARD_SPRITE_HEIGHT * SPRITE_SHEET_OFFSET[offsetParameter],
        CARD_SPRITE_WIDTH,
        CARD_SPRITE_HEIGHT,
        x,
        y,
        Card.CARD_WIDTH,
        Card.CARD_HEIGHT,
      );
    }
}