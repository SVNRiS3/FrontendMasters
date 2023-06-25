
let rowString = "";
let rowCount = 0;
let letterCount = 0;
let finished = 0;
let processingInput = false;
const rows = document.querySelectorAll(".row");
const result = document.querySelector(".result");
const title = document.querySelector(".title");
const waitAnimation = document.querySelector(".hollow-dots-spinner");
const URLGET = "https://words.dev-apis.com/word-of-the-day";
const URLPOST = "https://words.dev-apis.com/validate-word";
async function getWord(URL, mtd, data = "") {
    const fetchObj = {
        method: mtd,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (data)
        fetchObj.body = JSON.stringify(data);
    return (await (await fetch(URL, fetchObj)).json());
};
function colorLetters(wordToGuess) {
    let wordToGuessString = wordToGuess.word;
    for (let i = 0; i < rowString.length; i++) {
        let letterToCheck = rowString[i];
        if (wordToGuess.word[i] === letterToCheck) {
            rows[rowCount].childNodes[i].classList.add("letter-place");
            wordToGuessString = wordToGuessString.replace(letterToCheck, "");
        };
    };
    for (let i = 0; i < rowString.length; i++) {
        let letterToCheck = rowString[i];
        if (!rows[rowCount].childNodes[i].classList.contains("letter-place"))
            if (wordToGuessString.match(letterToCheck)) {
                rows[rowCount].childNodes[i].classList.add("letter");
                wordToGuessString = wordToGuessString.replace(letterToCheck, "");
            } else {
                rows[rowCount].childNodes[i].classList.add("nothing");
            };
    };
};

async function processEnter() {
    if (processingInput) return;
    processingInput = true;
    waitAnimation.classList.remove('none');
    const isValid = await getWord(URLPOST, "POST", { "word": rowString });
    const wordToGuess = await getWord(URLGET, "GET");
    if (isValid.validWord) {
        colorLetters(wordToGuess);
        if (wordToGuess.word === rowString) {
            finished = 1;
            outputResult(wordToGuess);
        } else {
            rowString = "";
            letterCount = 0;
            rowCount++;
            if (rowCount === rows.length) {
                finished = 2;
                outputResult(wordToGuess);
            };
        };
    };
    waitAnimation.classList.add('none');
    processingInput = false;
};

function addLetter(letter) {
    rows[rowCount].childNodes[letterCount].innerText = letter;
    letterCount++;
    rowString += letter;
};

async function outputResult(wordToGuess) {
    if (finished === 1) {
        title.classList.add("text-rb");
        result.innerText = `You won!\nThe word was: "${wordToGuess.word}"`;
    } else if (finished === 2) {
        title.classList.add("text-rb");
        result.innerText = `You lost :(\nThe word was: "${wordToGuess.word}"`;
    };
};

function processBackspace() {
    if (processingInput) return;
    letterCount--;
    rowString = rowString.slice(0, -1);
    rows[rowCount].childNodes[letterCount].innerText = "";
}

function handleKey(key) {
    const regex = /^[a-zA-Z]$/;
    if (finished > 0) {
        //hit some key to reset the board
    } else if (regex.test(key.toLowerCase()) && rowString.length < 5) {
        addLetter(key);
    } else if (key === "Enter" && rowString.length === 5) {
        processEnter();
    } else if (key === "Backspace" && rowString.length > 0) {
        processBackspace();
    };
};

function init() {
    document.addEventListener("keydown", (e) => {
        if (!e.repeat) {
            handleKey(e.key);
        };
    });
};

init();