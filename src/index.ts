import "./styles.css";
import spriteSrc from "./images/old-spritesheet.png";

import GameHandler from "./handlers/game-handler";

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

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.border = "1px solid black";
  app.appendChild(canvas);

  const canvasDimensions = canvas.getClientRects().item(0);
  if (!canvasDimensions) throw new Error("Could not get canvas dimensions");

  canvas.width = canvasDimensions.width;
  canvas.height = canvasDimensions.height;

  const game = new GameHandler(canvas, image);
  game.startGame();
}

start();
