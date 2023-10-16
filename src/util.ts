export const leftPad = (
  s: string | number,
  length: number,
  pad: string = " "
) => {
  if (typeof s === "number") {
    s = s.toString();
  }

  while (s.length < length) {
    s = pad + s;
  }
  return s;
};
