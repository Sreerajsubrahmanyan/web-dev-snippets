const display = document.getElementById("demo");
let expression = "";

function updateDisplay() {
    if (expression === "") {
        display.innerText = "0";
    } else {
        display.innerText = expression;
    }
}

function handleNumbers(value) {
    expression += value;
    updateDisplay();
}

function handleOperators(op) {
    if (expression === "") return;

    if (['+', '-', '*', '/'].includes(expression[expression.length - 1])) {
        expression = expression.slice(0, -1); 
    }

    expression += op;
    updateDisplay();
}

function evaluateExpression(expr) {
    let result = expr.replace(/(\d+)(\*|\/)(\d+)/g, (match, num1, operator, num2) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);
        if (operator === "*") {
            return (num1 * num2).toString();
        } else if (operator === "/") {
            return num2 === 0 ? "Error" : (num1 / num2).toString();
        }
    });

    result = result.replace(/(\d+)(\+|\-)(\d+)/g, (match, num1, operator, num2) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);
        if (operator === "+") {
            return (num1 + num2).toString();
        } else if (operator === "-") {
            return (num1 - num2).toString();
        }
    });

    return result;
}

function handleEqual() {
    if (expression === "") return;

    let result = evaluateExpression(expression);
    expression = result.toString();
    updateDisplay();
}

function handleClear() {
    expression = "";
    updateDisplay();
}

function handleDel() {
    expression = expression.slice(0, -1);
    updateDisplay();
}


document.querySelectorAll("input[type='button']").forEach((button) => {
    const value = button.value;

    if (!isNaN(value) || value === ".") {
        button.addEventListener("click", () => handleNumbers(value));
    } else if (['+', '-', '*', '/'].includes(value)) {
        button.addEventListener("click", () => handleOperators(value));
    } else if (value === "=") {
        button.addEventListener("click", () => handleEqual());
    } else if (value === "AC") {
        button.addEventListener("click", () => handleClear());
    } else if (value === "DEL") {
        button.addEventListener("click", () => handleDel());
    }
});
