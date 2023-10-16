import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import { MAX_ITEMNAME_LENGTH, TEXT_STYLE, WIDTH } from "../../../constant";
import { InputKey } from "../../../input";
import IMenu from "../../util/IMenu";
import UiBox from "../../util/UiBox";
import { Game } from "../../../game";
import { SPELL_INFO, SpellName } from "../../../data/spell";
import { PlayerSpells } from "../../../data/player";

type SpellEntry = SpellName | null;

type SpellEntryRow = [SpellEntry, SpellEntry, SpellEntry];

const SPELLS_PER_ROW = 3;

export default class SpellMenu extends UiBox implements IMenu {
  spellEntries: SpellEntryRow[];
  spellEntrySprites: PIXI.Text[];
  cursorState: {
    text: PIXI.Text;
    x: number;
    y: number;
    rowIndex: number;
  } | null;

  constructor(spells: PlayerSpells) {
    super(WIDTH - 20, 55);

    this.spellEntrySprites = [];

    if (spells.size === 0) {
      const text = new PIXI.Text("No spells.", TEXT_STYLE);
      text.x = 8;
      text.y = 8;
      this.addChild(text);
      this.spellEntries = [];
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

    const entries: SpellEntryRow[] = [];
    let row: SpellEntryRow = [null, null, null];
    let rowIndex = 0;
    for (let spellName of spells) {
      row[rowIndex++] = spellName;
      if (rowIndex >= row.length) {
        entries.push(row);
        row = [null, null, null];
        rowIndex = 0;
      }
    }
    if (rowIndex > 0) {
      entries.push(row);
    }
    this.spellEntries = entries;

    this.renderEntries();
  }

  renderEntries() {
    if (this.cursorState === null) {
      return;
    }

    this.spellEntrySprites.forEach((sprite) => {
      this.removeChild(sprite);
    });
    this.spellEntrySprites = [];

    for (
      let y = this.cursorState.rowIndex;
      y < this.cursorState.rowIndex + SPELLS_PER_ROW;
      y++
    ) {
      if (y >= this.spellEntries.length) {
        break;
      }

      for (let x = 0; x < SPELLS_PER_ROW; x++) {
        const entry = this.spellEntries[y][x];
        if (entry === null) {
          continue;
        }

        let spellName: string = entry;
        while (spellName.length < MAX_ITEMNAME_LENGTH) {
          spellName = spellName + " ";
        }

        let spellCost = SPELL_INFO[entry].mpCost.toString();
        if (spellCost.length === 1) {
          spellCost = " " + spellCost;
        }

        const entryText = new PIXI.Text(
          `${spellName} ${spellCost}`,
          TEXT_STYLE
        );
        entryText.x = 16 + x * 96;
        entryText.y = 8 + (y - this.cursorState.rowIndex) * 16;
        this.addChild(entryText);
        this.spellEntrySprites.push(entryText);
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
      // Cast spell!
      this.goBack(game);
      return;
    }

    const { x, y, rowIndex } = this.cursorState;
    if (game.input.isPressed(InputKey.RIGHT)) {
      this.cursorState.x = Math.min(x + 1, SPELLS_PER_ROW - 1);
    } else if (game.input.isPressed(InputKey.LEFT)) {
      this.cursorState.x = Math.max(x - 1, 0);
    } else if (game.input.isPressed(InputKey.UP)) {
      this.cursorState.y = Math.max(y - 1, 0);
      if (y === 0 && this.cursorState.rowIndex > 0) {
        this.cursorState.rowIndex--;
      }
    } else if (game.input.isPressed(InputKey.DOWN)) {
      this.cursorState.y = Math.min(y + 1, SPELLS_PER_ROW - 1);
      if (
        y === SPELLS_PER_ROW - 1 &&
        rowIndex + SPELLS_PER_ROW < this.spellEntries.length
      ) {
        this.cursorState.rowIndex++;
      }
    }

    if (
      this.cursorState.rowIndex + this.cursorState.y >=
        this.spellEntries.length ||
      this.spellEntries[this.cursorState.rowIndex + this.cursorState.y][
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
