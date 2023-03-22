export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw NaN;
  }
  return a / b;
};
export const convert = (a: number) => {
  if (a < 0) return Math.abs(a);
  else return -1 * a;
};

export const percent = (a: number) => a / 100;

export const operations: { [index: string]: Function } = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
};
