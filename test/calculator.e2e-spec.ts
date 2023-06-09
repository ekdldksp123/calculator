import Calculator from "../src/module/calculator";
import { describe, expect, it } from "@jest/globals";

describe("basic", () => {
  it("Can be instantiated", () => {
    const calc = new Calculator();
    expect(calc).toBeInstanceOf(Calculator);
  });

  it("Displays numbers when they are pressed", () => {
    const calc = new Calculator();
    calc.onButtonClick({
      type: "number",
      value: "1",
    });
    expect(calc.display).toEqual("1");

    calc.onButtonClick({
      type: "number",
      value: "0",
    });

    expect(calc.display).toEqual("10");

    calc.onButtonClick({
      type: "number",
      value: "0",
    });

    expect(calc.display).toEqual("100");
  });

  it('Displays numbers with a decimal when "." is pressed', () => {
    const calc = new Calculator();
    calc.onButtonClick({
      type: "number",
      value: "1",
    });
    expect(calc.display).toEqual("1");

    calc.onButtonClick({
      type: "number",
      value: "0",
    });

    expect(calc.display).toEqual("10");

    calc.onButtonClick({
      type: "number",
      value: "0",
    });

    expect(calc.display).toEqual("100");

    calc.onButtonClick({
      type: "operator",
      value: ".",
    });

    expect(calc.display).toEqual("100.");

    calc.onButtonClick({
      type: "number",
      value: "0",
    });

    expect(calc.display).toEqual("100.0");

    calc.onButtonClick({
      type: "number",
      value: "1",
    });

    expect(calc.display).toEqual("100.01");
  });

  it("The display resets when a number is pressed after a math operator", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "number",
        value: "0",
      },
      {
        type: "number",
        value: "0",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "number",
        value: "0",
      },
      {
        type: "number",
        value: "1",
      },
    ]);

    expect(calc.display).toEqual("100.01");

    calc.pressButtons([
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
    ]);

    expect(calc.display).toEqual("1");
  });
});

describe("Math operators", () => {
  it("Can add numbers", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("2");
  });

  it("Can subtract numbers", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "-",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("1");
  });

  it("Can multiply numbers", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "*",
      },
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("4");
  });

  it("Can divide numbers", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "4",
      },
      {
        type: "operator",
        value: "/",
      },
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("2");
  });

  it("Repeated evaluations continue to add to total", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("2");

    for (let i = 0; i < 10; i++) {
      calc.onButtonClick({
        type: "operator",
        value: "calculate",
      });
      expect(calc.display).toEqual((2 + (i + 1)).toString());
    }
  });

  it("allows multiple operators to be chained together", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "*",
      },
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "-",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("3");
  });

  it("calls update display when a button is pressed", () => {
    const calc = new Calculator();
    let callCount = 0;
    const updateDisplay = (value?: string) => {
      console.log(`display: ${value}`);
      callCount++;
    };
    calc.setUpdateDisplay(updateDisplay);

    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);
    expect(callCount).toEqual(3);
  });

  it("can be cleared", () => {
    const calc = new Calculator();
    calc.pressButtons([
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "+",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "*",
      },
      {
        type: "number",
        value: "2",
      },
      {
        type: "operator",
        value: "-",
      },
      {
        type: "number",
        value: "1",
      },
      {
        type: "operator",
        value: "calculate",
      },
    ]);

    expect(calc.display).toEqual("3");

    calc.onButtonClick({
      type: "operator",
      value: "clear",
    });

    expect(calc.display).toEqual(undefined);
  });
});
