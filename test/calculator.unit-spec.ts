import { describe, expect, beforeEach, it } from "@jest/globals";
import { Calculator } from "../src/libs/calculator";

describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("add", () => {
    it("should add two numbers", () => {
      const result = calculator.add(1, 2);
      expect(result).toEqual(3);
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers", () => {
      const result = calculator.subtract(3, 2);
      expect(result).toEqual(1);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      const result = calculator.multiply(2, 3);
      expect(result).toEqual(6);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      const result = calculator.divide(6, 2);
      expect(result).toEqual(3);
    });

    it("should throw an error when dividing by zero", () => {
      expect(() => calculator.divide(1, 0)).toThrow("Cannot divide by zero");
    });
  });
});
