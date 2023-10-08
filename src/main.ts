import FontFaceObserver from "fontfaceobserver";

import "./style.css";
import { createGame } from "./game";
import { FONT, FONT_BOLD } from "./constant";

const appElement = document.getElementById("app");
if (typeof appElement === "undefined") {
  throw new Error("Can't find application container");
}

await new FontFaceObserver(FONT).load();
await new FontFaceObserver(FONT_BOLD).load();

const game = await createGame();
appElement?.appendChild(game.app.view as HTMLCanvasElement);

game.resize();
await game.start();
