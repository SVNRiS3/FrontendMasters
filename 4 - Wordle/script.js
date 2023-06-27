const ANSWER_LEN = 5;
let done = false;
let currentGuess = "";
let currentRow = 0;
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
    for (let i = 0; i < currentGuess.length; i++) {
        let letterToCheck = currentGuess[i];
        if (wordToGuess.word[i] === letterToCheck) {
            rows[currentRow].childNodes[i].classList.add("letter-place");
            wordToGuessString = wordToGuessString.replace(letterToCheck, "");
        };
    };
    for (let i = 0; i < currentGuess.length; i++) {
        let letterToCheck = currentGuess[i];
        if (!rows[currentRow].childNodes[i].classList.contains("letter-place"))
            if (wordToGuessString.match(letterToCheck)) {
                rows[currentRow].childNodes[i].classList.add("letter");
                wordToGuessString = wordToGuessString.replace(letterToCheck, "");
            } else {
                rows[currentRow].childNodes[i].classList.add("nothing");
            };
    };
};

async function processEnter() {
    if (processingInput) return;
    processingInput = true;
    waitAnimation.classList.remove('none');
    const isValid = await getWord(URLPOST, "POST", { "word": currentGuess });
    const wordToGuess = await getWord(URLGET, "GET");
    if (isValid.validWord) {
        colorLetters(wordToGuess);
        if (wordToGuess.word === currentGuess) {
            outputResult(wordToGuess, true);
        } else {
            currentGuess = "";
            currentRow++;
            if (currentRow === rows.length) {
                outputResult(wordToGuess, false);
            };
        };
    } else {
        rows[currentRow].childNodes.forEach(elem => elem.classList.add('invalid'));
    };
    waitAnimation.classList.add('none');
    processingInput = false;
};

function addLetter(letter) {
    if (processingInput) return;
    if (currentGuess.length < ANSWER_LEN) {
        rows[currentRow].childNodes[currentGuess.length].innerText = letter;
        currentGuess += letter;
    } else {
        currentGuess = currentGuess.slice(0, -1);
        rows[currentRow].childNodes[currentGuess.length].innerText = letter;
    }
};

function outputResult(wordToGuess, isWon) {
    title.classList.add("text-rb");
    if (isWon) {
        result.innerText = `You won!\nThe word was: "${wordToGuess.word}"`;
    } else {
        result.innerText = `You lost :(\nThe word was: "${wordToGuess.word}"`;
    };
    done = true;
};

function processBackspace() {
    if (processingInput) return;
    currentGuess = currentGuess.slice(0, -1);
    rows[currentRow].childNodes[currentGuess.length].innerText = "";
}

function handleKey(key) {
    const regex = /^[a-zA-Z]$/;
    if (done) {
        //hit some key to reset the board
    } else if (regex.test(key.toLowerCase())) {
        addLetter(key);
    } else if (key === "Enter" && currentGuess.length === ANSWER_LEN) {
        processEnter();
    } else if (key === "Backspace" && currentGuess.length > 0) {
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