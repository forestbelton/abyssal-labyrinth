export interface CombatStats {
  maxHp: number;
  maxMp: number;
  strength: number;
  intelligence: number;
  vitality: number;
  agility: number;
}

export interface Combat {
  curHp: number;
  curMp: number;
  stats: CombatStats;
}
