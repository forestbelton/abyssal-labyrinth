export type SpellName =
  | "Spark"
  | "Jolt"
  | "Thunder"
  | "Ember"
  | "Burn"
  | "Fireball"
  | "Sprinkle"
  | "Rain"
  | "Flood"
  | "Cure"
  | "Heal"
  | "Big Heal";

export type SpellInfo<Name extends string> = {
  name: Name;
  mpCost: number;
};

export type PlayerSpells = Set<SpellName>;

export const SPELL_INFO: { [Name in SpellName]: SpellInfo<Name> } = {
  Spark: {
    name: "Spark",
    mpCost: 1,
  },
  Jolt: {
    name: "Jolt",
    mpCost: 3,
  },
  Thunder: {
    name: "Thunder",
    mpCost: 5,
  },
  Ember: {
    name: "Ember",
    mpCost: 3,
  },
  Burn: {
    name: "Burn",
    mpCost: 5,
  },
  Fireball: {
    name: "Fireball",
    mpCost: 9,
  },
  Sprinkle: {
    name: "Sprinkle",
    mpCost: 2,
  },
  Rain: {
    name: "Rain",
    mpCost: 4,
  },
  Flood: {
    name: "Flood",
    mpCost: 7,
  },
  Cure: {
    name: "Cure",
    mpCost: 5,
  },
  Heal: {
    name: "Heal",
    mpCost: 7,
  },
  "Big Heal": {
    name: "Big Heal",
    mpCost: 10,
  },
};
