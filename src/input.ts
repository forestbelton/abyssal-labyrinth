export enum InputKey {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  SELECT = "SELECT",
  BACK = "BACK",
}

const KEYBOARD_INPUT_KEYS: Record<string, InputKey> = {
  ArrowUp: InputKey.UP,
  ArrowDown: InputKey.DOWN,
  ArrowLeft: InputKey.LEFT,
  ArrowRight: InputKey.RIGHT,
  Enter: InputKey.SELECT,
  Backspace: InputKey.BACK,
};

export class InputState {
  keys: Set<InputKey>;
  lastKeys: Set<InputKey>;
  shouldUpdate: boolean;

  constructor() {
    this.keys = new Set();
    this.lastKeys = new Set();
    this.shouldUpdate = true;

    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
  }

  isDown(key: InputKey): boolean {
    return this.keys.has(key);
  }

  isPressed(key: InputKey): boolean {
    return this.keys.has(key) && !this.lastKeys.has(key);
  }

  isHeld(key: InputKey): boolean {
    return this.keys.has(key) && this.lastKeys.has(key);
  }

  isReleased(key: InputKey): boolean {
    return !this.keys.has(key) && this.lastKeys.has(key);
  }

  update() {
    this.lastKeys = this.keys;
    this.keys = new Set(this.keys);
  }

  _onKeyDown(ev: KeyboardEvent) {
    if (!this.shouldUpdate) {
      return;
    }

    const key = KEYBOARD_INPUT_KEYS[ev.key];
    if (typeof key === "undefined") {
      return;
    }
    this.keys.add(key);
  }

  _onKeyUp(ev: KeyboardEvent) {
    if (!this.shouldUpdate) {
    }

    const key = KEYBOARD_INPUT_KEYS[ev.key];
    if (typeof key === "undefined") {
      return;
    }
    this.keys.delete(key);
  }
}
