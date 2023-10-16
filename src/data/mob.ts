import { Combat, CombatStats } from "./combat";

export type MobInfo = {
  assetId: string;
  name: string; // NB: Must be <= 9 chars
  stats: CombatStats;
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
}

export const MOB_INFO: Record<string, MobInfo> = {
  Goblin: {
    assetId: "MOB_GOBLIN",
    name: "Goblin",
    stats: {
      maxHp: 8,
      maxMp: 0,
      strength: 2,
      intelligence: 0,
      vitality: 1,
      agility: 2,
    },
  },
  Rat: {
    assetId: "MOB_RAT",
    name: "Rat",
    stats: {
      maxHp: 5,
      maxMp: 0,
      strength: 1,
      intelligence: 0,
      vitality: 1,
      agility: 3,
    },
  },
};
