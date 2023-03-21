import Calculator from "./module/calculator";

function App() {
  const display = document.querySelector("p#display") as HTMLParagraphElement;
  const numbers = Array.from(document.querySelectorAll("button.number"));
  const operator = Array.from(document.querySelectorAll("button.operator"));
  const addOns = Array.from(document.querySelectorAll("button.addOns"));

  const onDisplayUpdate = (newValue: string) => {
    display.innerText = newValue;
  };

  const calculator = new Calculator(onDisplayUpdate);
  const init = () => {
    numbers.forEach((number) => {
      number.addEventListener("click", (e: Event) => {
        const value = (e.target as HTMLButtonElement).innerText;
        calculator.onClickButton("number", value);
      });
    });
  };

  init();
}

export default App;
