import { Button, History } from "../types";
import { operations } from "./operations";

class Calculator {
  private currentValue?: number;
  private currentOperator?: string;
  private lastOperator?: string;
  private displayShouldClear?: boolean;
  onDisplay?: string;
  private updateDisplay: (value?: string) => void;
  private history: History[];

  debug(method: string) {
    console.log(method);
    console.log("onDisplay:", this.onDisplay);
    console.log("currentValue:", this.currentValue);
    console.log("currentOperator:", this.currentOperator);
    console.log("lastOperator:", this.lastOperator);
    console.log("displayShouldClear:", this.displayShouldClear);
    console.log("history:", this.history);
  }

  constructor() {
    this.history = [];
    this.updateDisplay = (value?: string) => {};
    this.onDisplay = undefined;
    this.currentValue = undefined;
    this.currentOperator = undefined;
    this.lastOperator = undefined;
    this.displayShouldClear = true;
  }

  setUpdateDisplay(updateDisplay: (value?: string) => void) {
    this.updateDisplay = updateDisplay;
  }

  onDisplayUpdate = (): void => {
    this.updateDisplay(this.onDisplay);
  };

  private numberPressed = ({ value }: Button) => {
    const isNegativeZero = this.onDisplay === "-0";

    if (this.displayShouldClear) {
      this.clear();
      this.displayShouldClear = false;
    }

    if (this.currentOperator && this.onDisplay && !isNegativeZero) {
      this.removeHangingDecimal();

      if (this.currentValue && this.lastOperator) {
        const operation = operations[this.lastOperator];
        const result = operation(this.currentValue, parseFloat(this.onDisplay));
        this.currentValue = result;
      } else {
        this.currentValue = parseFloat(this.onDisplay);
      }

      this.onDisplay = undefined;

      this.lastOperator = this.currentOperator;
      this.currentOperator = undefined;
    }

    // We handle null/-0 the same, replace them with the number pressed
    if (this.onDisplay === undefined || isNegativeZero) {
      this.onDisplay = isNegativeZero ? "-" + value : value;
      this.onDisplayUpdate();
      return;
    }

    // 0이 하나 이상 찍히지 않게
    if (this.onDisplay === "0" && value === "0") return;

    this.onDisplay += value;
    this.onDisplayUpdate();
    return;
  };

  private removeHangingDecimal = () => {
    if (
      this.onDisplay !== undefined &&
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
    if (this.onDisplay === undefined) return;
    if (this.displayShouldClear) {
      // Hitting evaluate again just after an evaluation, repeat op
      const latestOperation = this.history[this.history.length - 1];
      leftNum = parseFloat(this.onDisplay);
      rightNum = latestOperation.rightNum;
      operation = latestOperation.operation;
    } else {
      leftNum = this.currentValue;
      rightNum = parseFloat(this.onDisplay);
      // TODO refactoring
      operation = operations[this.currentOperator || this.lastOperator || "+"];
    }

    const result = operation(leftNum, rightNum);
    this.currentValue = undefined;
    this.onDisplay = result.toString();
    this.onDisplayUpdate();
    this.displayShouldClear = true;
    if (leftNum === undefined) return;
    this.history.push({
      operation: operation,
      leftNum,
      rightNum,
    });
    return result;
  };

  private clear = () => {
    this.onDisplay = undefined;
    this.onDisplayUpdate();
    this.currentValue = undefined;
    this.currentOperator = undefined;
    this.lastOperator = undefined;
    this.displayShouldClear = false;
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
          this.onDisplayUpdate();
        } else if (this.displayShouldClear || this.onDisplay === undefined) {
          const newVal = "0.";
          this.onDisplay = newVal;
          this.onDisplayUpdate();
          this.displayShouldClear = false;
        }
        break;
      case "switchPolarity":
        if (this.currentOperator && this.onDisplay) {
          this.currentValue = parseFloat(this.onDisplay);
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
        this.onDisplayUpdate();
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

  pressButtons = (arr: Array<Button>) => {
    arr.forEach(this.buttonPressed);
  };
}

export default Calculator;
