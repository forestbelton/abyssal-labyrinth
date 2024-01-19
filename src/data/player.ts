import { AttackResult, Combat, CombatStats, physAttack } from "./combat";
import { ITEM_INFO, ItemName } from "./item";
import { Mob } from "./mob";
import { SpellName } from "./spell";

export type PlayerArmorSlot = "head" | "torso" | "hands" | "legs" | "feet";

export type PlayerArmor = Record<PlayerArmorSlot, ItemName | null>;

export type PlayerInventory = Partial<Record<ItemName, number>>;

export type PlayerSpells = Set<SpellName>;

export class Player implements Combat {
  level: number;
  exp: number;

  curHp: number;
  curMp: number;
  stats: CombatStats;

  weapon: ItemName | null;
  armor: PlayerArmor;

  items: PlayerInventory;
  spells: PlayerSpells;

  constructor() {
    this.level = 1;
    this.exp = 0;

    this.curHp = 10;
    this.curMp = 5;
    this.stats = {
      armorClass: 0,
      maxHp: 10,
      maxMp: 5,
      strength: 1,
      intelligence: 1,
      vitality: 1,
      agility: 1,
      dexterity: 1,
      spirit: 1,
      luck: 1,
    };

    this.weapon = null;
    this.armor = {
      head: null,
      torso: null,
      hands: null,
      legs: null,
      feet: null,
    };

    this.items = {};
    this.spells = new Set([]);
  }

  attack(mob: Mob): AttackResult {
    const weapon = this.weapon !== null ? ITEM_INFO[this.weapon] : null;
    // @ts-ignore
    const weaponBaseDamage = weapon !== null ? weapon.baseDamage : 1;
    // @ts-ignore
    const weaponDamageModifier = weapon !== null ? weapon.damageModifier : 1;

    const baseDamage =
      weaponBaseDamage + Math.floor(Math.random() * (weaponDamageModifier + 1));

    return physAttack(this, mob, baseDamage);
  }
}
