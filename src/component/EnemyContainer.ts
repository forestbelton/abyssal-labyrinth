import * as PIXI from "pixi.js";

import { Mob } from "../data/mob";
import UiBox from "./UiBox";

export default class EnemyContainer extends UiBox {
  enemy: Mob;
  sprite: PIXI.Sprite;
  healthBar: PIXI.Graphics;
  manaBar: PIXI.Graphics;

  constructor(enemy: Mob, spriteTexture: PIXI.Texture) {
    super(80, 90);

    this.enemy = enemy;

    this.sprite = new PIXI.Sprite(spriteTexture);
    this.sprite.x = 8;
    this.sprite.y = 8;
    this.addChild(this.sprite);

    this.healthBar = new PIXI.Graphics();
    this.healthBar.x = 8;
    this.healthBar.y = 8 + 64 + 8;
    this.updateHealthBar();
    this.addChild(this.healthBar);

    this.manaBar = new PIXI.Graphics();
    this.manaBar.x = 8;
    this.manaBar.y = 8 + 64 + 8 + 3;
    this.updateManaBar();
    this.addChild(this.manaBar);
  }

  updateHealthBar() {
    const healthBarLength = Math.floor(
      64 * (this.enemy.curHp / this.enemy.stats.maxHp)
    );
    this.healthBar.clear().lineStyle(2, "#ff4757").lineTo(healthBarLength, 0);
  }

  updateManaBar() {
    const baseLength = Math.floor(
      64 * (this.enemy.curMp / this.enemy.stats.maxMp)
    );
    const manaBarLength = baseLength > 0 ? baseLength : 64;
    this.manaBar.clear().lineStyle(2, "#3742fa").lineTo(manaBarLength, 0);
  }
}
