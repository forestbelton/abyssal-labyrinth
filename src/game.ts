import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import {
  WIDTH,
  HEIGHT,
  MANIFEST_JSON_PATH,
  MAX_SCALE,
  FONT_BOLD,
  TEXT_STYLE,
} from "./constant";
import ActionMenu from "./component/ActionMenu";
import EnemyContainer from "./component/EnemyContainer";
import UiBox from "./component/UiBox";
import { MOB_INFO, Mob } from "./data/mob";
import { InputKey, InputState } from "./input";

export enum GameState {
  TITLE,
  GAME,
}

export class Game {
  app: PIXI.Application;
  assets: Record<string, any>;
  input: InputState;
  screen: PIXI.Container;
  state: GameState;
  timers: any[];
  bgm?: string;
  actionMenu?: ActionMenu;

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
    sound.play(this.bgm, {
      volume: 0.3,
      complete: this.playBgm.bind(this),
    });
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
      case GameState.GAME:
        const oldCursorIndex = this.actionMenu?.cursorIndex || 0;
        if (this.input.isPressed(InputKey.LEFT) && this.actionMenu) {
          this.actionMenu.setCursorIndex(
            [0, 1, 0, 1][this.actionMenu.cursorIndex]
          );
        } else if (this.input.isPressed(InputKey.RIGHT) && this.actionMenu) {
          this.actionMenu.setCursorIndex(
            [2, 3, 2, 3][this.actionMenu.cursorIndex]
          );
        } else if (this.input.isPressed(InputKey.UP) && this.actionMenu) {
          this.actionMenu.setCursorIndex(
            [0, 0, 2, 2][this.actionMenu.cursorIndex]
          );
        } else if (this.input.isPressed(InputKey.DOWN) && this.actionMenu) {
          this.actionMenu.setCursorIndex(
            [1, 1, 3, 3][this.actionMenu.cursorIndex]
          );
        }
        if (oldCursorIndex !== this.actionMenu?.cursorIndex) {
          sound.play("SFX_menu_move");
        }
    }
  }

  startBattle() {
    const bg = new PIXI.Sprite(this.assets[`BG_${this.bg}`]);
    this.screen.addChild(bg);

    // Draw enemy name
    const enemyNameBg = new UiBox(80, 15);
    enemyNameBg.x = (WIDTH - 80) / 2;
    enemyNameBg.y = 60;
    const enemyName = new PIXI.Text(this.enemy.info.name, TEXT_STYLE);
    enemyName.x = 4;
    enemyName.y = 3;
    enemyNameBg.addChild(enemyName);
    this.screen.addChild(enemyNameBg);

    // Draw enemy
    const enemyBox = new EnemyContainer(
      this.enemy,
      this.assets[this.enemy.info.assetId]
    );
    enemyBox.x = enemyNameBg.x;
    enemyBox.y = 80;
    this.screen.addChild(enemyBox);

    // Draw menu
    this.actionMenu = new ActionMenu();
    this.actionMenu.x = 98;
    this.actionMenu.y = enemyBox.y + 100;
    this.screen.addChild(this.actionMenu);
  }
}

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
  sound.add("SFX_menu_move", "asset/sfx/menu-move.ogg");
  sound.add("SFX_menu_select", "asset/sfx/menu-select.ogg");

  await PIXI.Assets.init({ manifest: MANIFEST_JSON_PATH });
  return new Game(app, await PIXI.Assets.loadBundle("all"));
};
