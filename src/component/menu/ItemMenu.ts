import { WIDTH } from "../../constant";
import { ItemInventory } from "../../data/item";
import { InputState } from "../../input";
import IMenu from "./IMenu";
import UiBox from "../UiBox";

export default class ItemMenu extends UiBox implements IMenu {
  items: ItemInventory;

  constructor(items: ItemInventory) {
    super(WIDTH - 20, 55);
    this.items = items;
  }

  update(input: InputState) {}
}
