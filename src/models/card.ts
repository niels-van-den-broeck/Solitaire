import GameDimensions from "./game-dimensions";
import CardStack from "./piles/cardstack";

const SPRITE_SHEET_OFFSET = {
  spades: 3,
  hearts: 2,
  clubs: 0,
  diamonds: 1,
  cardBacks: 4,
};

const CARD_SPRITE_WIDTH = 128;
const CARD_SPRITE_HEIGHT = 192;

export default class Card {
    type: keyof typeof SPRITE_SHEET_OFFSET;
    value: number;
    image: HTMLImageElement;
    isPlayable: boolean = false;
    isVisible: boolean = false;
    stack?: CardStack;

    x: number = 0;
    y: number = 0;

    static TYPES = ["spades", "hearts", "clubs", "diamonds"] as const;
    static CARD_WIDTH = CARD_SPRITE_WIDTH;
    static CARD_HEIGHT = CARD_SPRITE_HEIGHT;

    constructor(type: keyof typeof SPRITE_SHEET_OFFSET, value: number, image: HTMLImageElement) {
      this.type = type;
      this.value = value;
      this.image = image;
    }

    setPosition(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    setPlayable(isPlayable: boolean) {
      this.isPlayable = isPlayable;
    }

    setVisible(isVisible: boolean) {
      this.isVisible = isVisible;
    }

    setStack(stack: CardStack) {
      this.stack = stack;
    }

    isPointInside(x: number, y: number) {
      if (this.stack && !this.stack.isTopCard(this)) {
          return (
            x >= this.x &&
            x <= this.x + Card.CARD_WIDTH &&
            y >= this.y &&
            y <= this.y + this.stack?.STACK_PADDING
          );
      }
      
      return (
        x >= this.x &&
        x <= this.x + Card.CARD_WIDTH &&
        y >= this.y &&
        y <= this.y + Card.CARD_HEIGHT
      );
    }
  
    render(ctx: CanvasRenderingContext2D) {
      const offset = this.isVisible ? this.value - 1 : 0;

      const offsetParameter = this.isVisible ? this.type : 'cardBacks';

      ctx.drawImage(
        this.image,
        offset * CARD_SPRITE_WIDTH,
        CARD_SPRITE_HEIGHT * SPRITE_SHEET_OFFSET[offsetParameter],
        CARD_SPRITE_WIDTH,
        CARD_SPRITE_HEIGHT,
        this.x,
        this.y,
        Card.CARD_WIDTH,
        Card.CARD_HEIGHT,
      );
    }
}