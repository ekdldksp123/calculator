export interface CalculatorProps {
  state: string;
  setState: (value: string) => void;
}

export type ButtonType = "number" | "operator" | "addOns";

export interface ButtonProps {
  type: "number" | "operator" | "addOns";
  value: string;
}

export type Actions = Record<string, Function>;
