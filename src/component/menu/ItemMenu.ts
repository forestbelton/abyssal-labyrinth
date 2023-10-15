import * as PIXI from "pixi.js";

import { TEXT_STYLE, WIDTH } from "../../constant";
import { ItemInventory } from "../../data/item";
import { InputKey } from "../../input";
import IMenu from "./IMenu";
import UiBox from "../UiBox";
import { Game } from "../../game";
import { sound } from "@pixi/sound";

type ItemEntry = [string, number] | null;
type ItemEntryRow = [ItemEntry, ItemEntry, ItemEntry];

export default class ItemMenu extends UiBox implements IMenu {
  itemEntries: ItemEntryRow[];
  cursorState: {
    text: PIXI.Text;
    x: number;
    y: number;
    rowIndex: number;
  } | null;

  constructor(items: ItemInventory) {
    super(WIDTH - 20, 55);

    const numItems = Object.keys(items).length;
    if (numItems === 0) {
      const text = new PIXI.Text("No items.", TEXT_STYLE);
      text.x = 8;
      text.y = 8;
      this.addChild(text);
      this.itemEntries = [];
      this.cursorState = null;
      return;
    }

    const text = new PIXI.Text(">", TEXT_STYLE);
    text.x = 8;
    text.y = 8;
    this.addChild(text);

    this.cursorState = {
      rowIndex: 0,
      text,
      x: 0,
      y: 0,
    };

    const entries: ItemEntryRow[] = [];
    let row: ItemEntryRow = [null, null, null];
    let rowIndex = 0;
    for (let entry of Object.entries(items)) {
      row[rowIndex++] = entry;
      if (rowIndex >= row.length) {
        entries.push(row);
        row = [null, null, null];
        rowIndex = 0;
      }
    }
    if (rowIndex > 0) {
      entries.push(row);
    }
    this.itemEntries = entries;

    this.renderEntries();
  }

  renderEntries() {
    if (this.cursorState === null) {
      return;
    }

    for (
      let y = this.cursorState.rowIndex;
      y < this.cursorState.rowIndex + 3;
      y++
    ) {
      if (y >= this.itemEntries.length) {
        break;
      }

      for (let x = 0; x < 3; x++) {
        const entry = this.itemEntries[y][x];
        if (entry === null) {
          continue;
        }

        const entryText = new PIXI.Text(`${entry[0]} ${entry[1]}`, TEXT_STYLE);
        entryText.x = 16 + x * 96;
        entryText.y = 8 + y * 16;
        this.addChild(entryText);
      }
    }
  }

  update(game: Game) {
    if (game.input.isPressed(InputKey.BACK)) {
      game.subMenu = null;
      this.destroy({ children: true });
      if (game.actionMenu) {
        game.screen.addChild(game.actionMenu);
      }
      return;
    }

    if (this.cursorState === null) {
      return;
    }

    const { x, y } = this.cursorState;
    if (game.input.isPressed(InputKey.RIGHT)) {
      this.cursorState.x = Math.min(x + 1, 2);
    } else if (game.input.isPressed(InputKey.LEFT)) {
      this.cursorState.x = Math.max(x - 1, 0);
    } else if (game.input.isPressed(InputKey.UP)) {
      this.cursorState.y = Math.max(y - 1, 0);
      if (this.cursorState.y === 0 && this.cursorState.rowIndex > 0) {
        this.cursorState.rowIndex--;
      }
    } else if (game.input.isPressed(InputKey.DOWN)) {
      this.cursorState.y = Math.min(y + 1, 2);
      if (
        this.cursorState.y === 2 &&
        this.cursorState.rowIndex + 3 < this.itemEntries.length
      ) {
        this.cursorState.rowIndex++;
      }
    }

    if (
      this.cursorState.rowIndex + this.cursorState.y >=
        this.itemEntries.length ||
      this.itemEntries[this.cursorState.rowIndex + this.cursorState.y][
        this.cursorState.x
      ] === null
    ) {
      this.cursorState.x = x;
      this.cursorState.y = y;
    }

    if (this.cursorState.x !== x || this.cursorState.y !== y) {
      sound.play("SFX_menu_move");
      console.log([this.cursorState.x, this.cursorState.y]);
      this.cursorState.text.x = 8 + this.cursorState.x * 96;
      this.cursorState.text.y = 8 + this.cursorState.y * 16;
    }
  }
}
