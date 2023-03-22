import { describe, expect, it } from "@jest/globals";
import Calculator from "../src/module/calculator";
import { add, operations } from "../src/module/operations";

describe("executeOperation", () => {
  it("should add two numbers correctly", () => {
    const calc = new Calculator();
    const history = {
      leftNum: 2,
      rightNum: 3,
      operation: (a: number, b: number) => a + b,
    };
    calc.executeOperation(history);
    expect(calc.display).toBe("5");
  });

  it("should handle errors correctly", () => {
    const calc = new Calculator();
    const history = {
      leftNum: 2,
      rightNum: 0,
      operation: (a: number, b: number) => a / b,
    };
    calc.executeOperation(history);
    expect(calc.display).toBe("오류");
  });
});

describe("calculate unit", () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe("calculate", () => {
    it("should not perform calculation if no operator and no last operator", () => {
      calc.calculate();
      expect(calc.currentValue).toBeUndefined();
      expect(calc.display).toBeUndefined();
    });

    it("should not perform calculation if display is undefined", () => {
      calc.currentOperator = "+";
      calc.calculate();
      expect(calc.currentValue).toBeUndefined();
      expect(calc.display).toBeUndefined();
    });

    it("should use latest operation if clearDisplay is true", () => {
      calc.currentOperator = "+";
      calc.display = "3";
      calc.addHistory({
        operation: operations["+"],
        leftNum: 1,
        rightNum: 2,
      });
      calc.repeatLastOperator = true;
      calc.calculate();
      expect(calc.display).toBe("5");
      calc.calculate();
      expect(calc.display).toBe("7");

      console.log(calc.history);

      expect(calc.history).toEqual([
        { operation: operations["+"], leftNum: 1, rightNum: 2 },
        { operation: operations["+"], leftNum: 3, rightNum: 2 },
        { operation: operations["+"], leftNum: 5, rightNum: 2 },
      ]);
    });

    it("should perform calculation with current operator and display value", () => {
      calc.currentValue = 2;
      calc.currentOperator = "*";
      calc.display = "3";
      calc.calculate();
      expect(calc.display).toBe("6");
      expect(calc.history).toEqual([
        { operation: operations["*"], leftNum: 2, rightNum: 3 },
      ]);
    });
  });
});
