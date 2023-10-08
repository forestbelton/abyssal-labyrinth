export type MobStats = {
  maxHp: number;
  maxMp: number;
  strength: number;
  intelligence: number;
  vitality: number;
  agility: number;
};

export type MobInfo = {
  assetId: string;
  name: string; // NB: Must be <= 9 chars
  stats: MobStats;
};

export class Mob {
  info: MobInfo;
  stats: MobStats;
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
      strength: 1,
      intelligence: 0,
      vitality: 1,
      agility: 2,
    },
  },
};

Object.keys(MOB_INFO).forEach((name) => {
  if (name !== MOB_INFO[name].name) {
    throw new Error(`Name of monster '${name}' does not match property`);
  }
});
