import { Button, History, Operation } from "../types";
import { operations } from "./operations";

/**
 * @description calculator 상태관리 클래스
 *
 * @field
 * - display: 화면에 표시될 숫자
 * - updateDisplay: 화면에 표시되는 숫자값을 업데이트 하는 함수(외부 주입)
 * - currentValue: 누적된 계산값
 * - currentOperator: 최근 오퍼레이터
 * - lastOperator: 마지막 오퍼레이터
 * - history: 계산 히스토리
 *
 * @method
 * - setUpdateDisplay: updateDisplay 를 외부에서 주입받아 set
 * - onDisplayUpdate: 화면에 표시된 숫자값을 현재 display 값으로 업데이트
 * - onButtonClick: 계산기 버튼을 클릭했을때 핸들러
 * - numberHandler: 숫자를 클릭했을때 핸들러
 * - decimalHandler: 소수점을 클릭했을 때 핸들러
 * - switchPolarityHandler: 음수양수 변환 핸들러
 * - actionHandler: 사칙연산/부가기능을 클릭했을때 핸들러
 * - calculate: = 을 클릭했을때 핸들러
 * - clear: 상태 초기화
 */

class Calculator {
  display?: string;
  private clearDisplay?: boolean;
  private updateDisplay: (value?: string) => void;
  private currentValue?: number;
  private currentOperator?: string;
  private lastOperator?: string;
  private history: History[];

  constructor() {
    this.history = [];
    this.updateDisplay = (value?: string) => {};
    this.display = undefined;
    this.currentValue = undefined;
    this.currentOperator = undefined;
    this.lastOperator = undefined;
    this.clearDisplay = false;
  }

  setUpdateDisplay(updateDisplay: (value?: string) => void) {
    this.updateDisplay = updateDisplay;
  }

  private addHistory(newHistory: History) {
    this.history.push(newHistory);
  }

  onDisplayUpdate = (): void => {
    this.updateDisplay(this.display);
  };

  private numberHandler = ({ value }: Button) => {
    const isNegativeZero = this.display === "-0";

    if (this.currentOperator && this.display && !isNegativeZero) {
      this.removeDecimalPoint();

      if (this.currentValue && this.lastOperator) {
        const operation = operations[this.lastOperator];
        const result = operation(this.currentValue, parseFloat(this.display));
        this.currentValue = result;
      } else {
        this.currentValue = parseFloat(this.display);
      }

      this.display = undefined;
      this.lastOperator = this.currentOperator;
      this.currentOperator = undefined;
    }

    // 음수 처리
    if (this.display === undefined || isNegativeZero) {
      this.display = isNegativeZero ? "-" + value : value;
      this.onDisplayUpdate();
      return;
    }

    // 0이 하나 이상 찍히지 않게
    if (this.display === "0" && value === "0") return;

    this.display += value;
    this.onDisplayUpdate();
    return;
  };

  private decimalHandler = () => {
    if (
      typeof this.display === "string" &&
      !this.display.includes(".") &&
      this.display.length > 0 &&
      !this.clearDisplay
    ) {
      const newVal = this.display + ".";
      this.display = newVal;
      this.onDisplayUpdate();
    } else if (this.clearDisplay || this.display === undefined) {
      const newVal = "0.";
      this.display = newVal;
      this.onDisplayUpdate();
      this.clearDisplay = false;
    }
  };

  private switchPolarityHandler = () => {
    if (this.currentOperator && this.display) {
      this.currentValue = parseFloat(this.display);
    }
    if (!this.display || (this.display && this.currentOperator)) {
      this.display = "0";
    }
    if (this.display.substring(0, 1) === "-") {
      this.display = this.display.substring(1, this.display.length);
    } else {
      this.display = "-" + this.display;
    }
    this.clearDisplay = false;
    this.onDisplayUpdate();
  };

  // 계산(=) 시 끝에 붙어있는 소수점 제거
  private removeDecimalPoint = () => {
    if (
      this.display !== undefined &&
      this.display.indexOf(".") === this.display.length
    ) {
      this.display = this.display.slice(0, this.display.length - 1);
    }
  };

  private executeOperation = ({ leftNum, rightNum, operation }: History) => {
    let result;
    try {
      result = operation(leftNum, rightNum);
    } catch (error) {
      result = NaN;
    }
    this.currentValue = undefined;

    if (result === undefined || isNaN(result)) {
      this.display = "오류";
    } else {
      this.display = result.toString();
    }
  };

  private calculate = () => {
    // operator, display 확인
    if (!this.currentOperator && !this.lastOperator) return;
    if (this.display === undefined) return;
    this.removeDecimalPoint();

    let leftNum;
    let rightNum;
    let operation;

    if (this.clearDisplay) {
      // = 을 연속해서 눌렀을때 마지막 연산이 계속되게
      const latestOperation = this.history[this.history.length - 1];
      leftNum = parseFloat(this.display);
      rightNum = latestOperation.rightNum;
      operation = latestOperation.operation;
    } else {
      leftNum = this.currentValue;
      rightNum = parseFloat(this.display);
      // TODO refactoring
      operation = operations[this.currentOperator || this.lastOperator!];
    }

    if (leftNum === undefined) return;
    if (rightNum === undefined) return;

    const newHistory = {
      operation: operation,
      leftNum,
      rightNum,
    };
    // 계산 수행
    this.executeOperation(newHistory);
    // display 업데이트
    this.onDisplayUpdate();
    this.clearDisplay = true;
    // history 추가
    this.addHistory(newHistory);
  };

  // 초기화
  private clear = () => {
    this.display = undefined;
    this.onDisplayUpdate();
    this.currentValue = undefined;
    this.currentOperator = undefined;
    this.lastOperator = undefined;
    this.clearDisplay = false;
  };

  private actionHandler = (btn: Button) => {
    switch (btn.value) {
      case "calculate":
        this.calculate();
        break;
      case "clear":
        this.clear();
        break;
      case ".":
        this.decimalHandler();
        break;
      case "switchPolarity":
        this.switchPolarityHandler();
        break;
      default:
        this.currentOperator = btn.value;
        this.clearDisplay = false;
        break;
    }
  };

  onButtonClick = (btn: Button) => {
    switch (btn.type) {
      case "number":
        this.clearDisplay = false;
        this.numberHandler(btn);
        break;
      case "operator":
        this.actionHandler(btn);
        break;
      default:
        throw new Error("Button type not recognized!");
    }
    return;
  };

  // test 용 메서드
  pressButtons = (arr: Array<Button>) => {
    arr.forEach(this.onButtonClick);
  };
}

export default Calculator;
