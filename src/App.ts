import Calculator from "./module/calculator";

function App() {
  const display = document.querySelector("#display") as HTMLParagraphElement;
  const buttons = document.querySelectorAll("button");

  const updateDisplay = (value?: string) => {
    display.innerText = value ?? "0";
  };

  const calculator = new Calculator(updateDisplay);

  const handleBtnClick = (e: Event) => {
    const el = e.target as HTMLButtonElement;
    const { value, type } = el.dataset;

    if (value === undefined || type === undefined) return;
    calculator.buttonPressed({ type, value });
  };

  const init = () => {
    buttons.forEach((btn) =>
      btn.addEventListener("click", (e) => handleBtnClick(e))
    );
  };

  init();
}

export default App;
