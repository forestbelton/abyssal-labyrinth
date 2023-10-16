import * as PIXI from "pixi.js";

import { Mob } from "../../data/mob";
import UiBox from "../util/UiBox";
import { ResourceBar } from "../util/ResourceBar";
import { COLOR_HP, COLOR_MP } from "../../constant";

export default class EnemyContainer extends UiBox {
  enemy: Mob;
  sprite: PIXI.Sprite;
  healthBar: ResourceBar;
  manaBar: ResourceBar;

  constructor(enemy: Mob, spriteTexture: PIXI.Texture) {
    super(80, 90);

    this.enemy = enemy;

    this.sprite = new PIXI.Sprite(spriteTexture);
    this.sprite.x = 8;
    this.sprite.y = 8;
    this.addChild(this.sprite);

    this.healthBar = new ResourceBar(64, COLOR_HP);
    this.healthBar.x = 8;
    this.healthBar.y = 8 + 64 + 8;

    this.manaBar = new ResourceBar(64, COLOR_MP);
    this.manaBar.x = 8;
    this.manaBar.y = 8 + 64 + 8 + 3;

    this.update();
    this.addChild(this.healthBar);
    this.addChild(this.manaBar);
  }

  update() {
    const healthBarScale = this.enemy.curHp / this.enemy.stats.maxHp;
    this.healthBar.update(healthBarScale);

    const manaBarScale =
      this.enemy.stats.maxMp === 0
        ? 1
        : this.enemy.curMp / this.enemy.stats.maxMp;
    this.manaBar.update(manaBarScale);
  }
}
