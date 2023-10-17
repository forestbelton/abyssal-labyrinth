import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import UiBox from "../../util/UiBox";
import { TEXT_STYLE } from "../../../constant";
import { InputKey } from "../../../input";
import { Game } from "../../../game";
import ItemMenu from "./ItemMenu";
import IMenu from "../../util/IMenu";
import SpellMenu from "./SpellMenu";

export default class ActionMenu extends UiBox implements IMenu {
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

  update(game: Game) {
    if (game.input.isPressed(InputKey.SELECT)) {
      sound.play("SFX_menu_select");
      switch (this.cursorIndex) {
        // ATTACK
        case 0:
          game.log?.addLogMessage("You attack but it does nothing!");
          break;
        // ITEM
        case 1:
          if (game.actionMenu) {
            game.screen.removeChild(game.actionMenu);
          }
          game.subMenu = new ItemMenu(game.player?.items || {});
          game.subMenu.x = 10;
          game.subMenu.y = game.actionMenu?.y || 0;
          game.screen.addChild(game.subMenu);
          break;
        // CAST
        case 2:
          if (game.actionMenu) {
            game.screen.removeChild(game.actionMenu);
          }
          game.subMenu = new SpellMenu(game.player?.spells || new Set([]));
          game.subMenu.x = 10;
          game.subMenu.y = game.actionMenu?.y || 0;
          game.screen.addChild(game.subMenu);
          break;
        // FLEE
        case 3:
          game.log?.addLogMessage("Can't escape...");
          break;
      }
      return;
    }

    const oldCursorIndex = this.cursorIndex || 0;
    if (game.input.isPressed(InputKey.LEFT)) {
      this.setCursorIndex([0, 1, 0, 1][this.cursorIndex]);
    } else if (game.input.isPressed(InputKey.RIGHT)) {
      this.setCursorIndex([2, 3, 2, 3][this.cursorIndex]);
    } else if (game.input.isPressed(InputKey.UP)) {
      this.setCursorIndex([0, 0, 2, 2][this.cursorIndex]);
    } else if (game.input.isPressed(InputKey.DOWN)) {
      this.setCursorIndex([1, 1, 3, 3][this.cursorIndex]);
    }
    if (oldCursorIndex !== this.cursorIndex) {
      sound.play("SFX_menu_move");
    }
  }
}
