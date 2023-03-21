import { Actions, ButtonProps, ButtonType, CalculatorProps } from "../types";
import { add, convert, divide, multiply, percent, subtract } from "./actions";

/**
 * @description calulator
 *
 * @param
 *  - onDisplayUpdate: 화면에 보이는 숫자 변경 함수
 *
 * @fields
 *  - operations: 사칙연산
 *  - addOns: 부가 기능
 *  - currentValue: 누적된 계산값
 *  - currentNumber: 최근 선택된 숫자
 *  - currentAction: 최근 선택된 액션(사칙연산, 부가기능)
 *  - 화면에 보이는 숫자 업데이트 해주는 함수
 */

class Calculator {
  private _currentValue: string;
  private _currentNumber: number;
  private _currentAction: Function;
  private _operations: Actions;
  private _addOns: Actions;
  private _updateDisplay: (newValue: string) => void;

  constructor(onDisplayUpdate: (newValue: string) => void) {
    this._updateDisplay = onDisplayUpdate;
    this._currentValue = "0";
    this._currentAction = () => {};
    this._currentNumber = 0;
    this._operations = {
      add: add,
      subtract: subtract,
      multiply: multiply,
      divide: divide,
    };
    this._addOns = {
      convert: convert,
      percent: percent,
      clear: this.clear,
    };
  }

  clear() {
    this._updateDisplay("0");
    this._currentValue = "0";
    this._currentAction = () => {};
    this._currentNumber = 0;
  }

  onClickButton(type: ButtonType, value: string) {
    switch (type) {
      case "number":
        this._currentNumber = parseInt(value);
        this._updateDisplay(value);
        break;
      case "operator":
        this._currentAction = this._operations[value];
        break;
    }
  }
}

export default Calculator;
