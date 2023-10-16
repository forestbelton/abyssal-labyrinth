import * as PIXI from "pixi.js";

export class ResourceBar extends PIXI.Container {
  bar: PIXI.Graphics;
  barWidth: number;
  color: string;

  constructor(barWidth: number, color: string, initialScale: number = 1) {
    super();

    this.bar = new PIXI.Graphics();
    this.color = color;
    this.barWidth = barWidth;

    this.update(initialScale);
    this.addChild(this.bar);
  }

  update(scale: number) {
    this.bar
      .clear()
      .lineStyle(2, this.color)
      .lineTo(Math.floor(this.barWidth * scale), 0);
  }
}
