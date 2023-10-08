import * as PIXI from "pixi.js";

const WIDTH = 320;
const HEIGHT = 240;

export class Game {
  app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const view = this.app.view as HTMLCanvasElement;

    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const scale = Math.min(screenWidth / WIDTH, screenHeight / HEIGHT);

    const enlargedWidth = Math.floor(scale * WIDTH);
    const enlargedHeight = Math.floor(scale * HEIGHT);

    view.style.width = `${enlargedWidth}px`;
    view.style.height = `${enlargedHeight}px`;

    const horizontalMarginPx = `${(screenWidth - enlargedWidth) / 2}px`;
    view.style.marginLeft = horizontalMarginPx;
    view.style.marginRight = horizontalMarginPx;

    const verticalMarginPx = `${(screenHeight - enlargedHeight) / 2}px`;
    view.style.marginTop = verticalMarginPx;
    view.style.marginBottom = verticalMarginPx;
  }
}

export const createGame = async () => {
  const app = new PIXI.Application({
    antialias: false,
    autoDensity: true,
    background: "#ff00ff",
    resolution: window.devicePixelRatio || 1,
    width: WIDTH,
    height: HEIGHT,
  });

  return new Game(app);
};
