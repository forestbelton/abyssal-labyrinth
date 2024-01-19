export interface CombatStats {
  maxHp: number;
  maxMp: number;
  armorClass: number; // physical damage resist
  strength: number; // physical melee attack damage
  vitality: number; // max health
  dexterity: number; // physical attack chance
  agility: number; // dodge chance
  intelligence: number; // magic attack damage
  spirit: number; // max mana
  luck: number; // critical chance
}

export interface Combat {
  curHp: number;
  curMp: number;
  stats: CombatStats;
}

export interface AttackResult {
  damage: number;
  isCriticalHit: boolean;
  isMiss: boolean;
}

export const physAttack = (
  attacker: Combat,
  defender: Combat,
  baseDamage: number
): AttackResult => {
  // NB: when dexterity - agility > 6 then hit is guaranteed
  // NB: when agility - dexterity > 14 then miss is guaranteed
  const BASE_HIT_CHANCE = 85;
  const hitChance =
    BASE_HIT_CHANCE + (attacker.stats.dexterity - defender.stats.agility) * 5;
  const isMiss = hitChance < Math.floor(Math.random() * 100);
  if (isMiss) {
    return {
      damage: 0,
      isCriticalHit: false,
      isMiss,
    };
  }

  const strAdjustedDamage =
    baseDamage + Math.floor(attacker.stats.strength / 3);

  const BASE_CRIT_CHANCE = 5;
  const critChance =
    BASE_CRIT_CHANCE + (attacker.stats.luck - defender.stats.luck) * 2;
  const isCriticalHit = Math.floor(Math.random() * 100) < critChance;

  const postCritDamage = isCriticalHit
    ? strAdjustedDamage * 2 + (strAdjustedDamage >> 1)
    : strAdjustedDamage;

  const unboundedDamage =
    (postCritDamage * postCritDamage) /
    (postCritDamage + defender.stats.armorClass);
  const damage = Math.min(1, Math.floor(unboundedDamage));

  console.log({
    hitChance,
    critChance,
    baseDamage,
    strAdjustedDamage,
    postCritDamage,
    unboundedDamage,
    damage,
  });

  return {
    damage,
    isCriticalHit,
    isMiss,
  };
};
