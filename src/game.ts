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
import ActionMenu from "./component/battle/menu/ActionMenu";
import EnemyContainer from "./component/battle/EnemyContainer";
import UiBox from "./component/util/UiBox";
import { MOB_INFO, Mob } from "./data/mob";
import { InputKey, InputState } from "./input";
import IMenu from "./component/util/IMenu";
import { PlayerContainer } from "./component/battle/PlayerContainer";
import { Player } from "./data/player";
import { LogContainer } from "./component/battle/LogContainer";

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
  log?: LogContainer;
  subMenu: IMenu | null;

  // game state
  bg?: string;
  player?: Player;
  enemy?: Mob;

  constructor(app: PIXI.Application, assets: Record<string, any>) {
    this.app = app;
    this.assets = assets;
    this.input = new InputState();
    this.timers = [];
    this.subMenu = null;

    this.screen = new PIXI.Container();
    this.app.stage.addChild(this.screen);

    this.player = new Player();
    this.player.items = {
      "Red Potn": 99,
      "Ora Potn": 99,
      "Yel Potn": 99,
      "Blu Potn": 99,
      "Red Mush": 99,
      "Ora Mush": 99,
      "Yel Mush": 99,
      "Blu Mush": 99,
      BroSword: 99,
      IroSword: 99,
      MitSword: 99,
      AdaSword: 99,
      RunSword: 99,
      DrgSword: 99,
    };
    this.player.spells = new Set([
      "Spark",
      "Jolt",
      "Thunder",
      "Ember",
      "Burn",
      "Fireball",
      "Sprinkle",
      "Rain",
      "Flood",
      "Cure",
      "Heal",
      "Big Heal",
    ]);

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
        this.playBgm("BGM_title");
        break;
      case GameState.GAME:
        // TODO: randomly select?
        this.bg = "FIELDS";
        this.enemy = new Mob(MOB_INFO["Rat"]);
        this.playBgm("BGM_battle");
        this.startBattle();
        break;
    }

    this.state = state;
  }

  playBgm(bgm: string) {
    if (this.bgm) {
      sound.stop(this.bgm);
    }

    this.bgm = bgm;
    if (!this.bgm) {
      return;
    }
    sound.play(this.bgm, {
      volume: 0.3,
      complete: () => this.playBgm(bgm),
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
        if (this.subMenu) {
          this.subMenu.update(this);
          return;
        }
        this.actionMenu?.update(this);
    }
  }

  startBattle() {
    const bg = new PIXI.Sprite(this.assets[`BG_${this.bg}`]);
    this.screen.addChild(bg);

    // Draw log
    this.log = new LogContainer();
    this.log.x = 8;
    this.log.y = 8;
    this.screen.addChild(this.log);

    if (typeof this.enemy === "undefined") {
      return;
    }

    // Draw enemy name
    const enemyNameBg = new UiBox(80, 15);
    enemyNameBg.x = (WIDTH - 80) / 2;
    enemyNameBg.y = 64;
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
    enemyBox.y = 84;
    this.screen.addChild(enemyBox);

    // Draw player info
    const playerBox = new PlayerContainer(this.player as Player);
    playerBox.x = 8;
    playerBox.y = 88;
    this.screen.addChild(playerBox);

    // Draw menu
    this.actionMenu = new ActionMenu();
    this.actionMenu.x = 98;
    this.actionMenu.y = enemyBox.y + 96;
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
  sound.add("BGM_battle", "asset/bgm/battle.ogg");
  sound.add("SFX_menu_move", "asset/sfx/menu-move.ogg");
  sound.add("SFX_menu_select", "asset/sfx/menu-select.ogg");

  await PIXI.Assets.init({ manifest: MANIFEST_JSON_PATH });
  return new Game(app, await PIXI.Assets.loadBundle("all"));
};
