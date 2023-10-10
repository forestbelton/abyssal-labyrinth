import * as PIXI from "pixi.js";

export default class UiBox extends PIXI.Container {
  constructor(w: number, h: number, r: number = 4) {
    super();

    const box = new PIXI.Graphics();
    box.beginFill("#242424");
    box.drawRoundedRect(0, 0, w, h, r);
    box.lineStyle(1, "#fefefe");
    box.drawRoundedRect(1, 1, w - 2, h - 2, r);
    box.endFill();
    this.addChild(box);
  }
}
