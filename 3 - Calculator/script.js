const calculatorResult = document.querySelector('.calculator-result');
const calculator = document.querySelector('.calculator');

let calculations = [];
let number = "0";
let result = false;

calculator.addEventListener("click", function (event) {

    const e = event.target;
    const eT = e.innerText;

    if (!e.classList.contains('calculator-result')) {

        if (eT >= 0 || eT <= 10) {
            (number === "0" || result === true) ? number = eT : number += eT;
            result = false;
        }
        else if (eT === "=") {
            calculations.push(number);
            for (let i = 0; i < calculations.length - 1; i += 2) {
                calculations[i] = parseInt(calculations[i]);
                calculations[i + 2] = parseInt(calculations[i + 2]);
                if (calculations[i + 1] === "÷")
                    calculations[i + 2] = calculations[i] / calculations[i + 2];
                else if (calculations[i + 1] === "x")
                    calculations[i + 2] = calculations[i] * calculations[i + 2];
                else if (calculations[i + 1] === "-")
                    calculations[i + 2] = calculations[i] - calculations[i + 2];
                else if (calculations[i + 1] === "+")
                    calculations[i + 2] = calculations[i] + calculations[i + 2];
                number = Math.round(calculations[i + 2]).toString();
            };
            calculations = [];
            result = true;
        }
        else if (eT === "C") {
            calculations = [];
            number = "0";
        }
        else if (eT === "←") {
            if (result = true) {
                calculations = [];
                number = "0";
            } else
                number.length > 1 ? number = number.slice(0, -1) : number = "0";
        }
        else {
            calculations.push(number);
            calculations.push(eT);
            number = "0";
        }
        calculatorResult.innerText = parseInt(number);
    }
});