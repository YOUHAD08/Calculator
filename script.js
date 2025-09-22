let operator;
let operand_1;
let operand_2;
let lastButtonType = "";

function add(number_1, number_2) {
  return number_1 + number_2;
}

function subtract(number_1, number_2) {
  return number_1 - number_2;
}

function multiply(number_1, number_2) {
  return number_1 * number_2;
}

function divide(number_1, number_2) {
  if (number_2 === 0) {
    return "404!";
  }
  return number_1 / number_2;
}
function modulus(number_1, number_2) {
  return number_1 % number_2;
}

function operate(operator_symbol, operand_1_var, operand_2_var) {
  const a = Number(operand_1_var.replace(/,/g, ""));
  const b = Number(operand_2_var.replace(/,/g, ""));

  switch (operator_symbol) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "x":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    case "%":
      return modulus(a, b);
    default:
      throw new Error("Unknown operator: " + operator_symbol);
  }
}

function format_number(string_number) {
  let [integerPart, decimalPart] = string_number.split(".");

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  integerPart + "." + decimalPart;
  return string_number.includes(".")
    ? decimalPart
      ? integerPart + "." + decimalPart
      : integerPart + "."
    : integerPart;
}

function unformat_number(string_number) {
  let [integerPart, decimalPart] = string_number.split(".");

  integerPart = integerPart.replaceAll(",", "");

  return string_number.includes(".")
    ? decimalPart
      ? integerPart + "." + decimalPart
      : integerPart + "."
    : integerPart;
}

const calculatorContainer = document.querySelector(".calculator-container");
const currentOperand = document.querySelector(".current-operand");
const previousOperand = document.querySelector(".previous-operand");

function clearCalculator() {
  operand_1 = "";
  operand_2 = "";
  operator = "";
  currentOperand.textContent = "0";
  previousOperand.textContent = "";
}

calculatorContainer.addEventListener("click", (event) => {
  const clickedButton = event.target;

  if (clickedButton.tagName !== "BUTTON") return;
  const buttonClass = clickedButton.className;
  const buttonContent = clickedButton.textContent;

  switch (true) {
    // ---------- NUMBER ----------
    case buttonClass.includes("number"):
      if (currentOperand.textContent.trim() === "404!") {
        clearCalculator();
      }
      if (currentOperand.textContent === "0" || lastButtonType === "operator") {
        currentOperand.textContent = buttonContent;
      } else {
        currentOperand.textContent = format_number(
          unformat_number(currentOperand.textContent) + buttonContent
        );
      }
      currentOperand.scrollLeft = currentOperand.scrollWidth;
      lastButtonType = "number";
      break;

    // ---------- DOT ----------
    case buttonClass === "dot":
      if (!currentOperand.textContent.includes(".")) {
        currentOperand.textContent += ".";
      }
      lastButtonType = "dot";
      break;

    // ---------- OPERATOR ----------
    case buttonClass.includes("operator"):
      if (lastButtonType === "operator") {
        operator = buttonContent;
        break;
      }
      if (operator && previousOperand.textContent !== "") {
        operand_1 = previousOperand.textContent;
        operand_2 = currentOperand.textContent;
        let result = operate(operator, operand_1, operand_2);
        currentOperand.textContent = result;
        previousOperand.textContent = "";
      }
      operator = buttonContent;
      previousOperand.textContent = currentOperand.textContent;
      lastButtonType = "operator";
      break;

    // ---------- EQUAL ----------
    case buttonClass === "equal":
      operand_1 = previousOperand.textContent;
      operand_2 = currentOperand.textContent;
      let result = operate(operator, operand_1, operand_2);
      currentOperand.textContent = result;
      previousOperand.textContent = "";
      lastButtonType = "equal";
      break;

    // ---------- ALL CLEAR ----------
    case buttonClass === "AC":
      clearCalculator();
      lastButtonType = "AC";
      break;

    // ---------- DELETE ----------
    case buttonClass === "DEL":
      if (currentOperand.textContent.trim() === "404!") {
        break;
      }
      currentOperand.textContent =
        currentOperand.textContent.slice(0, -1) || "0";
      lastButtonType = "DEL";
      break;

    // ---------- OTHER ----------
    default:
      console.log("Other button clicked:", buttonContent);
      break;
  }
});

// --- DRAG TO SCROLL FEATURE ---
let isDown = false; // are we holding the mouse down?
let startX; // mouse X position when started
let scrollLeft; // where the scroll was when started

currentOperand.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - currentOperand.offsetLeft;
  scrollLeft = currentOperand.scrollLeft;
  console.log(scrollLeft);
});

currentOperand.addEventListener("mouseup", () => {
  isDown = false;
});

currentOperand.addEventListener("mousemove", (e) => {
  if (!isDown) return; // only run if mouse is pressed
  e.preventDefault();
  const x = e.pageX - currentOperand.offsetLeft;
  const walk = x - startX; // distance moved
  currentOperand.scrollLeft = scrollLeft - walk;
});
