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
  try {
    if (number_2 === 0) {
      throw new Error("Cannot divide by zero!");
    }
    return number_1 / number_2;
  } catch (error) {
    console.error("Error:", error.message);
    return null; // return null if an error happens
  }
}
