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

export type ItemInfo<Name extends string> = {
  name: Name;
};

export type ItemInventory = Partial<Record<ItemName, number>>;

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
  },
  IroSword: {
    name: "IroSword",
  },
  MitSword: {
    name: "MitSword",
  },
  AdaSword: {
    name: "AdaSword",
  },
  RunSword: {
    name: "RunSword",
  },
  DrgSword: {
    name: "DrgSword",
  },
};
