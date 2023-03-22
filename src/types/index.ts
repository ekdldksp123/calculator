export type Operation = (a: number, b: number) => number;

export type ActionType = "number" | "operator";

export interface Button {
  type: ActionType;
  value: string;
}

export interface History {
  operation: Operation;
  leftNum: number;
  rightNum: number;
}
