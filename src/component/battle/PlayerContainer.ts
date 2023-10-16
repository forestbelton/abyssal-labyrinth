import * as PIXI from "pixi.js";
import { COLOR_HP, COLOR_MP, TEXT_STYLE } from "../../constant";
import { ResourceBar } from "../util/ResourceBar";
import UiBox, { UIBOX_PADDING_HORIZ, UIBOX_PADDING_VERT } from "../util/UiBox";
import { leftPad } from "../../util";
import { Player } from "../../data/player";

const RESOURCE_BAR_LENGTH = 74;

export class PlayerContainer extends UiBox {
  levelText: PIXI.Text;
  expText: PIXI.Text;

  healthBar: ResourceBar;
  healthText: PIXI.Text;

  manaBar: ResourceBar;
  manaText: PIXI.Text;

  constructor(player: Player) {
    super(88, 80);

    this.levelText = new PIXI.Text("LVL: 0", TEXT_STYLE);
    this.levelText.x = UIBOX_PADDING_HORIZ - 1;
    this.levelText.y = UIBOX_PADDING_VERT;
    this.addChild(this.levelText);

    this.expText = new PIXI.Text("EXP: 0", TEXT_STYLE);
    this.expText.x = UIBOX_PADDING_HORIZ - 1;
    this.expText.y = this.levelText.y + 12;
    this.addChild(this.expText);

    this.healthText = new PIXI.Text("HP 000/000", TEXT_STYLE);
    this.healthText.x = UIBOX_PADDING_HORIZ;
    this.healthText.y = this.expText.y + 18;
    this.addChild(this.healthText);

    this.healthBar = new ResourceBar(RESOURCE_BAR_LENGTH, COLOR_HP);
    this.healthBar.x = UIBOX_PADDING_HORIZ;
    this.healthBar.y = this.healthText.y + 12;
    this.addChild(this.healthBar);

    this.manaText = new PIXI.Text("MP 000/000", TEXT_STYLE);
    this.manaText.x = UIBOX_PADDING_HORIZ;
    this.manaText.y = this.healthBar.y + 8;
    this.addChild(this.manaText);

    this.manaBar = new ResourceBar(RESOURCE_BAR_LENGTH, COLOR_MP);
    this.manaBar.x = UIBOX_PADDING_HORIZ;
    this.manaBar.y = this.manaText.y + 12;
    this.addChild(this.manaBar);

    this.update(player);
  }

  update(player: Player) {
    this.levelText.text = `LVL: ${leftPad(player.level, 5)}`;
    this.expText.text = `EXP: ${leftPad(player.exp, 5)}`;

    const playerHp = Math.max(player.curHp, 0);
    const playerMaxHp = player.stats.maxHp;
    const hpText = leftPad(playerHp, 3) + "/" + leftPad(playerMaxHp, 3);
    this.healthText.text = `HP ${hpText}`;

    const hpScale = playerHp / playerMaxHp;
    this.healthBar.update(hpScale);

    const playerMp = Math.max(player.curMp, 0);
    const playerMaxMp = player.stats.maxMp;
    const mpText = leftPad(playerMp, 3) + "/" + leftPad(playerMaxMp, 3);
    this.manaText.text = `MP ${mpText}`;

    const mpScale = playerMaxMp === 0 ? 1 : playerMp / playerMaxMp;
    this.manaBar.update(mpScale);
  }
}
