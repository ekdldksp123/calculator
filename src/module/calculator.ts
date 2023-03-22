import { Button, History } from "../types";
import { operations } from "./operations";

class Calculator {
  private currentTotal: number | null = null; // What the current running total is
  private currentOperator: string | null = null; // What the active operator is
  private lastOperator: string | null = null; // The last operator that was pressed
  private displayShouldClear: boolean | null = null;
  private operations: Array<Function>;
  private onDisplay: string | null = null;
  private history: History[];

  constructor(updateDisplay: (value: string) => void) {
    this.history = [];
    this.operations = [updateDisplay];
    this.onDisplay = null;
    this.currentTotal = null;
    this.currentOperator = null;
    this.lastOperator = null;
    this.displayShouldClear = true;
  }

  private executeOperators = (): void => {
    this.operations.forEach((func) => func(this.onDisplay));
  };

  private numberPressed = (btn: Button) => {
    const isNegativeZero = this.onDisplay === "-0";
    if (this.displayShouldClear) {
      this.clear();
      this.displayShouldClear = false;
    }

    if (this.currentOperator && this.onDisplay && !isNegativeZero) {
      this.removeHangingDecimal();

      if (this.currentTotal && this.lastOperator) {
        const operation = operations[this.lastOperator];
        const result = operation(this.currentTotal, parseFloat(this.onDisplay));
        this.currentTotal = result;
      } else {
        this.currentTotal = parseFloat(this.onDisplay);
      }

      this.onDisplay = null;

      this.lastOperator = this.currentOperator;
      this.currentOperator = null;
    }

    // We handle null/-0 the same, replace them with the number pressed
    if (this.onDisplay === null || isNegativeZero) {
      this.onDisplay = isNegativeZero ? "-" + btn.value : btn.value;
      this.executeOperators();
      return;
    }

    // Don't let more than one 0 be displayed
    if (this.onDisplay === "0" && btn.value === "0") {
      return;
    }

    this.onDisplay = this.onDisplay + btn.value;
    this.executeOperators();
    return;
  };

  private removeHangingDecimal = () => {
    if (
      this.onDisplay !== null &&
      this.onDisplay.indexOf(".") === this.onDisplay.length
    ) {
      this.onDisplay = this.onDisplay.slice(0, this.onDisplay.length - 1);
    }
  };

  private evaluate = () => {
    // No operator? Can't evaluate
    if (!this.currentOperator && !this.lastOperator) return;

    this.removeHangingDecimal();

    let leftNum;
    let rightNum;
    let operation;
    if (this.onDisplay === null) return;
    if (this.displayShouldClear) {
      // Hitting evaluate again just after an evaluation, repeat op
      const latestOperation = this.history[this.history.length - 1];
      leftNum = parseFloat(this.onDisplay);
      rightNum = latestOperation.rightNum;
      operation = latestOperation.operation;
    } else {
      leftNum = this.currentTotal;
      rightNum = parseFloat(this.onDisplay);
      // TODO refactoring
      operation = operations[this.currentOperator || this.lastOperator || "+"];
    }

    const result = operation(leftNum, rightNum);
    this.currentTotal = null;
    this.onDisplay = result.toString();
    this.executeOperators();
    this.displayShouldClear = true;
    if (leftNum === null) return;
    this.history.push({
      operation: operation,
      leftNum,
      rightNum,
    });
    return result;
  };

  private clear = () => {
    this.onDisplay = null;
    this.executeOperators();
    this.currentTotal = null;
    this.currentOperator = null;
    this.lastOperator = null;
    this.displayShouldClear = true;
  };

  private actionPressed = (btn: Button) => {
    switch (btn.value) {
      case "evaluate":
        this.evaluate();
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
        this.currentOperator = btn.value;
        this.displayShouldClear = false;
        break;
      case "clear":
        this.clear();
        break;
      case ".":
        if (
          typeof this.onDisplay === "string" &&
          !this.onDisplay.includes(".") &&
          this.onDisplay.length > 0 &&
          !this.displayShouldClear
        ) {
          const newVal = this.onDisplay + ".";
          this.onDisplay = newVal;
          this.executeOperators();
        } else if (this.displayShouldClear || this.onDisplay === null) {
          const newVal = "0.";
          this.onDisplay = newVal;
          this.executeOperators();
          this.displayShouldClear = false;
        }
        break;
      case "switchPolarity":
        if (this.currentOperator && this.onDisplay) {
          this.currentTotal = parseFloat(this.onDisplay);
        }
        if (!this.onDisplay || (this.onDisplay && this.currentOperator)) {
          this.onDisplay = "0";
        }
        if (this.onDisplay.substr(0, 1) === "-") {
          this.onDisplay = this.onDisplay.substr(1, this.onDisplay.length);
        } else {
          this.onDisplay = "-" + this.onDisplay;
        }
        this.displayShouldClear = false;
        this.executeOperators();
        break;
      default:
        break;
    }
  };

  buttonPressed = (btn: Button) => {
    switch (btn.type) {
      case "number":
        this.numberPressed(btn);
        break;
      case "operator":
        this.actionPressed(btn);
        break;
      default:
        throw new Error("Button type not recognized!");
    }
    return;
  };
}

export default Calculator;
