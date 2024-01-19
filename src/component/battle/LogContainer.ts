import * as PIXI from "pixi.js";

import {
  TEXT_STYLE,
  TEXT_STYLE_ITEM,
  TEXT_STYLE_MOB,
  TEXT_STYLE_SPELL,
  WIDTH,
} from "../../constant";
import UiBox, { UIBOX_PADDING_HORIZ, UIBOX_PADDING_VERT } from "../util/UiBox";

const MAX_LOG_MESSAGES = 3;

const CONTAINER_WIDTH = WIDTH - 20;
const CONTAINER_HEIGHT = 48;

export class LogContainer extends UiBox {
  logEntries: PIXI.Container[];
  logContainer: PIXI.Container;

  constructor() {
    super(CONTAINER_WIDTH, CONTAINER_HEIGHT);

    this.logContainer = new PIXI.Container();
    this.logContainer.mask = new PIXI.Graphics()
      .beginFill("#fff")
      .drawRect(
        0,
        UIBOX_PADDING_VERT,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT - UIBOX_PADDING_VERT * 1.5
      )
      .endFill();
    this.logContainer.addChild(this.logContainer.mask);
    this.addChild(this.logContainer);

    this.logEntries = [];
  }

  addLogMessage(...message: string[]) {
    const logEntry = new PIXI.Container();
    logEntry.x = UIBOX_PADDING_HORIZ;
    logEntry.y =
      this.logEntries.length > 0
        ? this.logEntries[this.logEntries.length - 1].y + 12
        : UIBOX_PADDING_VERT;

    let x = 0;
    for (let chunk of message) {
      const { text, width } = this.renderLogMessageChunk(chunk);
      text.x = x;
      logEntry.addChild(text);
      x += width;
    }

    this.logContainer.addChild(logEntry);
    this.logEntries.push(logEntry);
  }

  renderLogMessageChunk(chunk: string) {
    let start = 0;
    let style = TEXT_STYLE;

    if (chunk.startsWith("$i:")) {
      start = 3;
      style = TEXT_STYLE_ITEM;
    } else if (chunk.startsWith("$s:")) {
      start = 3;
      style = TEXT_STYLE_SPELL;
    } else if (chunk.startsWith("$m:")) {
      start = 3;
      style = TEXT_STYLE_MOB;
    }

    const message = chunk.substring(start);
    const metrics = PIXI.TextMetrics.measureText(message, style);

    return {
      text: new PIXI.Text(message, style),
      width: metrics.width,
    };
  }

  update() {
    if (this.logEntries.length <= MAX_LOG_MESSAGES) {
      return;
    }

    this.logEntries.forEach((entry) => {
      entry.y--;
    });

    if (this.logEntries[0].y === -4) {
      const entry = this.logEntries[0];
      this.logContainer.removeChild(entry);
      entry.destroy();
      this.logEntries = this.logEntries.slice(1);
    }
  }
}
