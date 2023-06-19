const screen = document.querySelector('.calculator-result');
let num = "0";
let totalNum = 0;
let operator = null;

function handleNumber(number) {
    if (num === "0")
        num = number;
    else
        num += number;

};

function makeOperation(intNum) {
    if (operator === "+")
        totalNum += intNum;
    else if (operator === "-")
        totalNum -= intNum;
    else if (operator === "÷")
        totalNum /= intNum;
    else if (operator === "×")
        totalNum *= intNum;
}

function handleOperations(symbol) {
    if (num === "0") {
        //do nothing
        return;
    };

    const intNum = parseInt(num);
    if (totalNum === 0)
        totalNum = intNum;
    else
        makeOperation(intNum);

    operator = symbol;
    num = "0";
};

function handleEquasion() {
    if (num === "0") {
        //do nothing
        return;
    };
    makeOperation(parseInt(num));
    operator = null;
    num = "" + totalNum;
    totalNum = 0;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            num = "0";
            break;
        case "←":
            if (num.length === 1)
                num = "0";
            else
                num = num.slice(0, -1);
            break;
        case "=":
            handleEquasion();
            break;
        case "÷":
        case "×":
        case "-":
        case "+":
            handleOperations(symbol);
            break;

    }
};

function buttonEvent(item) {
    if (isNaN(parseInt(item)))
        handleSymbol(item);
    else
        handleNumber(item);
    updateResult();

}

function updateResult() {
    screen.innerText = num;
};

function init() {
    document
        .querySelector('.calculator')
        .addEventListener("click", function (event) {
            buttonEvent(event.target.innerText);
        });
};

init();