import { Combat, CombatStats } from "./combat";
import { Player } from "./player";
import { SpellName } from "./spell";

export type MobInfo = {
  assetId: string;
  name: string; // NB: Must be <= 9 chars
  stats: CombatStats;
};

export type MobAction =
  | {
      type: "attack";
    }
  | {
      type: "spell";
      spell: SpellName;
    };

export class Mob implements Combat {
  info: MobInfo;
  stats: CombatStats;
  curHp: number;
  curMp: number;

  constructor(info: MobInfo) {
    this.info = info;
    this.stats = this.info.stats;
    this.curHp = this.stats.maxHp;
    this.curMp = this.stats.maxMp;
  }

  act(player: Player): MobAction {
    // TODO: Make more complex
    // a) Weighted random choice between:
    // 1. Basic attack
    // 2. Cast spell
    // b) Act according to player condition
    //   (e.g. fire-weak -> cast fire, !asleep -> cast sleep)
    return { type: "attack" };
  }
}

export const MOB_INFO: Record<string, MobInfo> = {
  Goblin: {
    assetId: "MOB_GOBLIN",
    name: "Goblin",
    stats: {
      armorClass: 1,
      maxHp: 8,
      maxMp: 0,
      strength: 2,
      intelligence: 0,
      spirit: 0,
      vitality: 1,
      agility: 2,
      dexterity: 1,
      luck: 0,
    },
  },
  Rat: {
    assetId: "MOB_RAT",
    name: "Rat",
    stats: {
      armorClass: 0,
      maxHp: 5,
      maxMp: 0,
      strength: 1,
      intelligence: 0,
      vitality: 1,
      agility: 3,
      luck: 0,
      dexterity: 1,
      spirit: 0,
    },
  },
  Zombie: {
    assetId: "MOB_ZOMBIE",
    name: "Zombie",
    stats: {
      armorClass: 2,
      maxHp: 7,
      maxMp: 0,
      strength: 2,
      intelligence: 0,
      vitality: 2,
      agility: 1,
      luck: 1,
      dexterity: 1,
      spirit: 0,
    },
  },
};

export const getRandomMob = () => {
  const mobNames = Object.keys(MOB_INFO);
  const mobNameIndex = Math.floor(Math.random() * mobNames.length);
  return new Mob(MOB_INFO[mobNames[mobNameIndex]]);
};
