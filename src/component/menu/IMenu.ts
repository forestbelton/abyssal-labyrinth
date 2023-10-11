import { InputState } from "../../input";
import UiBox from "../UiBox";

export default interface IMenu extends UiBox {
  update(input: InputState): void;
}
