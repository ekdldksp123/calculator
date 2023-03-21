import { describe, expect, it } from "@jest/globals";
import { add, divide, multiply, subtract } from "../src/module/actions";

describe("Calculator", () => {
  describe("add", () => {
    it("should add two numbers", () => {
      const result = add(1, 2);
      expect(result).toEqual(3);
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers", () => {
      const result = subtract(3, 2);
      expect(result).toEqual(1);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      const result = multiply(2, 3);
      expect(result).toEqual(6);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      const result = divide(6, 2);
      expect(result).toEqual(3);
    });

    it("should throw an error when dividing by zero", () => {
      expect(() => divide(1, 0)).toThrow("Cannot divide by zero");
    });
  });
});
