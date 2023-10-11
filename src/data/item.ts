export type ItemInfo = {
  name: string;
};

export type ItemInventory = Record<string, number>;

export const ITEM_INFO: Record<string, ItemInfo> = {};

Object.keys(ITEM_INFO).forEach((name) => {
  if (name !== ITEM_INFO[name].name) {
    throw new Error(`Name of item '${name}' does not match property`);
  }
});
