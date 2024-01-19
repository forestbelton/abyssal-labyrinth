export type ItemName =
  | "Red Potn"
  | "Ora Potn"
  | "Yel Potn"
  | "Blu Potn"
  | "Red Mush"
  | "Ora Mush"
  | "Yel Mush"
  | "Blu Mush"
  | "BroSword"
  | "IroSword"
  | "MitSword"
  | "AdaSword"
  | "RunSword"
  | "DrgSword";

export type ItemWeaponAttributes = {
  type: "weapon";
  baseDamage: number;
  damageModifier: number;
};

type BaseItemInfo<Name extends ItemName> = {
  name: Name;
};

export type ItemInfo<Name extends ItemName> = BaseItemInfo<Name> &
  (ItemWeaponAttributes | {});

export const ITEM_INFO: { [Name in ItemName]: ItemInfo<Name> } = {
  "Red Potn": {
    name: "Red Potn",
  },
  "Ora Potn": {
    name: "Ora Potn",
  },
  "Yel Potn": {
    name: "Yel Potn",
  },
  "Blu Potn": {
    name: "Blu Potn",
  },
  "Red Mush": {
    name: "Red Mush",
  },
  "Ora Mush": {
    name: "Ora Mush",
  },
  "Yel Mush": {
    name: "Yel Mush",
  },
  "Blu Mush": {
    name: "Blu Mush",
  },
  BroSword: {
    name: "BroSword",
    baseDamage: 1,
    damageModifier: 1,
  },
  IroSword: {
    name: "IroSword",
    baseDamage: 2,
    damageModifier: 2,
  },
  MitSword: {
    name: "MitSword",
    baseDamage: 3,
    damageModifier: 2,
  },
  AdaSword: {
    name: "AdaSword",
    baseDamage: 4,
    damageModifier: 3,
  },
  RunSword: {
    name: "RunSword",
    baseDamage: 5,
    damageModifier: 3,
  },
  DrgSword: {
    name: "DrgSword",
    baseDamage: 6,
    damageModifier: 4,
  },
};
