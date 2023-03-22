# IOS calculator

## 프로젝트 실행 방법

패키지 설치

```
yarn install

```

앱 실행

```
yarn start

```

## 구현 방법

- 연속된 연산

  - history 배열을 통해서 { leftNum, rightNum, operator } 로 계산 내역 관리
  - 누적된 계산 값은 currentValue 에 저장하고 leftNum 에 currentValue를 대입

- 누적된 계산값(currentValue) 와 보여줄 값(display)을 분리해서 관리
  - currentValue은 = 이 수행될때마다 초기화됨
  - 다시 숫자 버튼을 누를 경우 currentValue 값을 마지막 연산의 결과값으로 업데이트 해주고
  - 초기화된 경우 display 값을 동기화 시켜줌

## 예외 처리

- = 을 계속 누를 경우
- display 값이 undefined 인 경우는 리턴
- currentOperator 나 lastOperator 가 undefined 인 경우도 리턴

- 계산(=) 시 repeatLastOperator 상태를 true로 변경하고 다시 = 를 누를 시 history 에서 마지막 operator를 꺼내 다시 계산 수행

  - (ex) 1 + 2 = 3 = 5 = 7

- leftNum + operator 선택 후 . 을 클릭했을 때

  - 원래 0. 이 되게 하고 다시 숫자를 눌렀을때 0.숫자 이런식으로 진행되게 하고 싶었으나 시간 부족으로 leftNum 에 .을 붙이고 계산시 . 제거
  - operator + 0. (사용자가 직접 0 다음에 . 입력시) 시에는 정상 동작

- NaN, Infinity, -Infinity 가 결과값으로 나올 경우
  - 아이폰 계산기를 참고해서 '오류' 라고 표시
