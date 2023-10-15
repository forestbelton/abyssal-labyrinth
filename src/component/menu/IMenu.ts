import { Game } from "../../game";
import UiBox from "../UiBox";

export default interface IMenu extends UiBox {
  update(game: Game): void;
}
