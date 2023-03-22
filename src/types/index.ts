export interface CalculatorProps {
  onDisplayUpdate: (newValue: string) => void;
}

export type ButtonType = "number" | "operator" | "addOns";

export interface ButtonProps {
  type: "number" | "operator" | "addOns";
  value: string;
}

export type Actions = Record<string, Function>;

// UI buttons for calculator
export interface Button {
  type: string; // 'number' | 'operator' | 'action'
  value: string;
}

export interface History {
  operation: Function;
  leftNum: number;
  rightNum: number;
}
