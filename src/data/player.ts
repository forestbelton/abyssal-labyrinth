import { Combat, CombatStats } from "./combat";
import { ItemName } from "./item";
import { SpellName } from "./spell";

export type PlayerInventory = Partial<Record<ItemName, number>>;

export type PlayerSpells = Set<SpellName>;

export class Player implements Combat {
  level: number;
  exp: number;

  curHp: number;
  curMp: number;
  stats: CombatStats;

  items: PlayerInventory;
  spells: PlayerSpells;

  constructor() {
    this.level = 1;
    this.exp = 0;

    this.curHp = 10;
    this.curMp = 5;
    this.stats = {
      maxHp: 10,
      maxMp: 5,
      strength: 1,
      intelligence: 1,
      vitality: 1,
      agility: 1,
    };

    this.items = {};
    this.spells = new Set([]);
  }
}
