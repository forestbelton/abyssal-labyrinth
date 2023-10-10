import * as PIXI from "pixi.js";

import UiBox from "./UiBox";
import { TEXT_STYLE } from "../constant";

export default class ActionMenu extends UiBox {
  cursorText: PIXI.Text;
  cursorIndex: number;

  constructor() {
    super(125, 45);
    const attackText = new PIXI.Text("Attack", TEXT_STYLE);
    attackText.x = 16;
    attackText.y = 8;
    this.addChild(attackText);
    const castText = new PIXI.Text("Spell", TEXT_STYLE);
    castText.x = 76;
    castText.y = 8;
    this.addChild(castText);
    const itemText = new PIXI.Text("Item", TEXT_STYLE);
    itemText.x = 16;
    itemText.y = 28;
    this.addChild(itemText);
    const fleeText = new PIXI.Text("Flee", TEXT_STYLE);
    fleeText.x = 76;
    fleeText.y = 28;
    this.addChild(fleeText);

    this.cursorIndex = 0;
    this.cursorText = new PIXI.Text(">", TEXT_STYLE);
    this.moveCursor();
    this.addChild(this.cursorText);
  }

  moveCursor() {
    const { x, y } = [
      { x: 8, y: 8 },
      { x: 8, y: 28 },
      { x: 68, y: 8 },
      { x: 68, y: 28 },
    ][this.cursorIndex];
    this.cursorText.x = x;
    this.cursorText.y = y;
  }

  setCursorIndex(cursorIndex: number) {
    this.cursorIndex = cursorIndex;
    this.moveCursor();
  }
}
