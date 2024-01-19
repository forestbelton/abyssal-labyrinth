import { TextStyle } from "pixi.js";

export const WIDTH = 320;
export const HEIGHT = 240;
export const MAX_SCALE = 2;

export const FONT = "NicoClean";
export const FONT_BOLD = "NicoBold";

export const MANIFEST_JSON_PATH = "asset/manifest.json";

export const TEXT_STYLE = new TextStyle({
  fill: "#fefefe",
  fontFamily: FONT,
  fontSize: 10,
});

export const TEXT_STYLE_DISABLED = new TextStyle({
  fill: "#ababab",
  fontFamily: FONT,
  fontSize: 10,
});

export const TEXT_STYLE_ITEM = new TextStyle({
  fill: "#eccc68",
  fontFamily: FONT,
  fontSize: 10,
});

export const TEXT_STYLE_SPELL = new TextStyle({
  fill: "#5352ed",
  fontFamily: FONT,
  fontSize: 10,
});

export const TEXT_STYLE_MOB = new TextStyle({
  fill: "#ff6b81",
  fontFamily: FONT,
  fontSize: 10,
});

export const MAX_ITEMNAME_LENGTH = 8;

export const COLOR_HP = "#ff4757";
export const COLOR_MP = "#3742fa";
