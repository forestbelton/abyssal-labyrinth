import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import {
  WIDTH,
  HEIGHT,
  FONT,
  MANIFEST_JSON_PATH,
  MAX_SCALE,
  FONT_BOLD,
} from "./constant";
import { InputKey, InputState } from "./input";
import { MOB_INFO, Mob } from "./data/mob";

export enum GameState {
  TITLE,
  GAME,
}

const ENEMY_NAME_STYLE = new PIXI.TextStyle({
  fill: "#fefefe",
  fontFamily: FONT,
  fontSize: 10,
});

export class Game {
  app: PIXI.Application;
  assets: Record<string, any>;
  input: InputState;
  screen: PIXI.Container;
  state: GameState;
  timers: any[];
  bgm?: string;

  // game state
  bg?: string;
  player?: any;
  enemy?: any;

  constructor(app: PIXI.Application, assets: Record<string, any>) {
    this.app = app;
    this.assets = assets;
    this.input = new InputState();
    this.timers = [];

    this.screen = new PIXI.Container();
    this.app.stage.addChild(this.screen);

    this.state = GameState.TITLE;
    this.select(GameState.TITLE);

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const view = this.app.view as HTMLCanvasElement;

    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const scale = Math.min(
      screenWidth / WIDTH,
      screenHeight / HEIGHT,
      MAX_SCALE
    );

    const enlargedWidth = Math.floor(scale * WIDTH);
    const enlargedHeight = Math.floor(scale * HEIGHT);

    view.style.width = `${enlargedWidth}px`;
    view.style.height = `${enlargedHeight}px`;

    const horizontalMarginPx = `${(screenWidth - enlargedWidth) / 2}px`;
    view.style.marginLeft = horizontalMarginPx;
    view.style.marginRight = horizontalMarginPx;

    const verticalMarginPx = `${(screenHeight - enlargedHeight) / 2}px`;
    view.style.marginTop = verticalMarginPx;
    view.style.marginBottom = verticalMarginPx;
  }

  async select(state: GameState) {
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
    this.timers = [];

    this.screen.removeChildren().forEach((child) => {
      child.destroy();
    });

    switch (state) {
      case GameState.TITLE:
        const bg = new PIXI.Sprite(this.assets.BG_TITLE);
        this.screen.addChild(bg);

        const title = new PIXI.Text("ABYSSAL\n  LABYRINTH", {
          fill: "#fefefe",
          fontFamily: FONT_BOLD,
          fontSize: 32,
        });
        title.x = 32;
        title.y = 32;
        this.screen.addChild(title);

        const pressEnter = new PIXI.Text("PRESS ENTER", {
          fill: "#fefefe",
          fontFamily: FONT_BOLD,
          fontSize: 16,
        });
        pressEnter.x = 90;
        pressEnter.y = 180;
        this.screen.addChild(pressEnter);

        this.timers.push(
          setInterval(() => {
            pressEnter.renderable = !pressEnter.renderable;
          }, 700)
        );

        this.bgm = "BGM_title";
        this.playBgm();
        break;
      case GameState.GAME:
        // TODO: randomly select?
        this.bg = "FIELDS";
        this.enemy = new Mob(MOB_INFO["Goblin"]);
        this.startBattle();
        break;
    }

    this.state = state;
  }

  playBgm() {
    if (!this.bgm) {
      return;
    }
    sound.play(this.bgm, this.playBgm.bind(this));
  }

  async start() {
    await this.select(this.state);
    this.app.ticker.add(() => {
      this.update();
      this.input.update();
    });
  }

  update() {
    switch (this.state) {
      case GameState.TITLE:
        if (this.input.isDown(InputKey.SELECT)) {
          this.select(GameState.GAME);
        }
        break;
    }
  }

  startBattle() {
    const bg = new PIXI.Sprite(this.assets[`BG_${this.bg}`]);
    this.screen.addChild(bg);

    // Draw enemy name
    const enemyNameX = (WIDTH - 80) / 2;
    const enemyNameY = 60;
    const enemyNameBg = box(enemyNameX, enemyNameY, 80, 15);
    const enemyName = new PIXI.Text(this.enemy.info.name, ENEMY_NAME_STYLE);
    enemyName.x = 4;
    enemyName.y = 3;
    enemyNameBg.addChild(enemyName);
    this.screen.addChild(enemyNameBg);

    // Draw enemy
    const enemyX = enemyNameX;
    const enemyY = 80;

    const enemyBox = box(enemyX, enemyY, 80, 90);
    const enemySprite = new PIXI.Sprite(this.assets[this.enemy.info.assetId]);
    enemySprite.x = 8;
    enemySprite.y = 8;
    enemyBox.addChild(enemySprite);

    const enemyHealth = new PIXI.Graphics();
    enemyHealth.x = 8;
    enemyHealth.y = 8 + 64 + 8;
    enemyHealth.lineStyle(2, "#ff4757");
    enemyHealth.lineTo(
      Math.floor(64 * (this.enemy.curHp / this.enemy.stats.maxHp)),
      0
    );
    enemyBox.addChild(enemyHealth);

    const enemyMana = new PIXI.Graphics();
    enemyMana.x = 8;
    enemyMana.y = 8 + 64 + 8 + 3;
    enemyMana.lineStyle(2, "#3742fa");
    const manaLength =
      this.enemy.stats.maxMp > 0
        ? Math.floor(64 * (this.enemy.curMp / this.enemy.stats.maxMp))
        : 64;
    enemyMana.lineTo(manaLength, 0);
    enemyBox.addChild(enemyMana);

    this.screen.addChild(enemyBox);
  }
}

const box = (x: number, y: number, w: number, h: number, r: number = 4) => {
  const g = new PIXI.Graphics();
  g.beginFill("#242424");
  g.drawRoundedRect(0, 0, w, h, r);
  g.lineStyle(1, "#fefefe");
  g.drawRoundedRect(1, 1, w - 2, h - 2, r);
  g.endFill();

  const container = new PIXI.Container();
  container.x = x;
  container.y = y;

  container.addChild(g);

  return container;
};

export const createGame = async () => {
  const app = new PIXI.Application({
    antialias: false,
    autoDensity: true,
    background: "#000",
    resolution: window.devicePixelRatio || 1,
    width: WIDTH,
    height: HEIGHT,
  });

  sound.add("BGM_title", "asset/bgm/title.ogg");

  await PIXI.Assets.init({ manifest: MANIFEST_JSON_PATH });
  return new Game(app, await PIXI.Assets.loadBundle("all"));
};
