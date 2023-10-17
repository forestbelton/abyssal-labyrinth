import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import { MAX_ITEMNAME_LENGTH, TEXT_STYLE, WIDTH } from "../../../constant";
import { InputKey } from "../../../input";
import IMenu from "../../util/IMenu";
import UiBox from "../../util/UiBox";
import { Game } from "../../../game";
import { Player, PlayerInventory } from "../../../data/player";
import { ItemName } from "../../../data/item";

type ItemEntry = [ItemName, number] | null;

type ItemEntryRow = [ItemEntry, ItemEntry, ItemEntry];

export default class ItemMenu extends UiBox implements IMenu {
  itemEntries: ItemEntryRow[];
  itemEntrySprites: PIXI.Text[];
  cursorState: {
    text: PIXI.Text;
    x: number;
    y: number;
    rowIndex: number;
  } | null;

  constructor(items: PlayerInventory) {
    super(WIDTH - 20, 55);

    this.itemEntrySprites = [];

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
      row[rowIndex++] = entry as [ItemName, number];
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

    this.itemEntrySprites.forEach((sprite) => {
      this.removeChild(sprite);
    });
    this.itemEntrySprites = [];

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

        let entryName: string = entry[0];
        while (entryName.length < MAX_ITEMNAME_LENGTH) {
          entryName = entryName + " ";
        }

        const entryText = new PIXI.Text(`${entryName} ${entry[1]}`, TEXT_STYLE);
        entryText.x = 16 + x * 96;
        entryText.y = 8 + (y - this.cursorState.rowIndex) * 16;
        this.addChild(entryText);
        this.itemEntrySprites.push(entryText);
      }
    }
  }

  goBack(game: Game) {
    game.subMenu = null;
    this.destroy({ children: true });
    if (game.actionMenu) {
      game.screen.addChild(game.actionMenu);
    }
  }

  update(game: Game) {
    if (game.input.isPressed(InputKey.BACK)) {
      this.goBack(game);
      return;
    }

    if (this.cursorState === null) {
      return;
    }

    if (game.input.isPressed(InputKey.SELECT)) {
      const entry =
        this.itemEntries[this.cursorState.rowIndex + this.cursorState.y][
          this.cursorState.x
        ];
      if (entry === null) {
        console.error("Tried to use a null item");
        return;
      }

      const [itemName, _] = entry;
      const player: Player = game.player as Player;

      game.log?.addLogMessage(
        "You use ",
        `$i:${itemName}`,
        ". It does nothing."
      );
      if (typeof player.items[itemName] === "undefined") {
        console.error("Tried to use an item not in inventory");
        return;
      }

      // @ts-ignore
      player.items[itemName]--;

      this.goBack(game);
      return;
    }

    const { x, y, rowIndex } = this.cursorState;
    if (game.input.isPressed(InputKey.RIGHT)) {
      this.cursorState.x = Math.min(x + 1, 2);
    } else if (game.input.isPressed(InputKey.LEFT)) {
      this.cursorState.x = Math.max(x - 1, 0);
    } else if (game.input.isPressed(InputKey.UP)) {
      this.cursorState.y = Math.max(y - 1, 0);
      if (y === 0 && this.cursorState.rowIndex > 0) {
        this.cursorState.rowIndex--;
      }
    } else if (game.input.isPressed(InputKey.DOWN)) {
      this.cursorState.y = Math.min(y + 1, 2);
      if (y === 2 && rowIndex + 3 < this.itemEntries.length) {
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

    if (
      this.cursorState.x !== x ||
      this.cursorState.y !== y ||
      this.cursorState.rowIndex !== rowIndex
    ) {
      sound.play("SFX_menu_move");
      this.cursorState.text.x = 8 + this.cursorState.x * 96;
      this.cursorState.text.y = 8 + this.cursorState.y * 16;

      if (this.cursorState.rowIndex !== rowIndex) {
        this.renderEntries();
      }
    }
  }
}
