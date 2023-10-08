import "./style.css";
import { createGame } from "./game";

const appElement = document.getElementById("app");
if (typeof appElement === "undefined") {
  throw new Error("Can't find application container");
}

const game = await createGame();
appElement?.appendChild(game.app.view as HTMLCanvasElement);

game.resize();
