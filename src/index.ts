import "./styles.css";
import spriteSrc from "./images/cards-spritesheet.png";

import Game from "./models/game";

function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();

  return new Promise((resolve) => {
    image.onload = () => {
      resolve(image);
    };

    image.src = src;
  });
}

async function start() {
  const image = await loadImage(spriteSrc);

  const app = document.getElementById("app") as HTMLDivElement;
  const canvas = document.createElement("canvas");

  canvas.width = 1500;
  canvas.height = 5000;
  canvas.style.border = "1px solid black";
  app.appendChild(canvas);

  const game = new Game(canvas, image);
  game.initialize();
  game.render();
}

start();
