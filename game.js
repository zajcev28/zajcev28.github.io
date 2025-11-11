let score = 0;
let taskCount = 0;
const maxTasks = 15;
let timeLeft = 10;
let timer;

const scoreBoard = document.getElementById("scoreboard");
const canvas = document.getElementById("gameCanvas");
const inputBox = document.getElementById("inputBox");
const answerInput = document.getElementById("answerInput");
const micBtn = document.getElementById("micBtn");

let ctx = canvas.getContext("2d");
let currentA, currentB;

// 🎤 Rozpoznawanie mowy
let recognition;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        let result = event.results[0][0].transcript;
        result = result.replace(/\D/g, ""); // zostaw tylko cyfry
        answerInput.value = result;
        checkAnswer();
    };

    micBtn.onclick = () => recognition.start();
} else {
    micBtn.style.display = "none"; // jeśli przeglądarka nie wspiera
}

// ▶️ Start gry
function startGame() {
    score = 0;
    taskCount = 0;
    scoreBoard.innerText = "Punkty: 0";
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    inputBox.style.display = "block";
    answerInput.value = "";
    answerInput.focus();
    nextTask();
}

// 🎮 Nowe zadanie
function nextTask() {
    if (taskCount >= maxTasks) {
        endGame();
        return;
    }

    taskCount++;

    currentA = Math.floor(Math.random() * 10) + 1;
    currentB = Math.floor(Math.random() * 10) + 1;

    drawTask(`${currentA} × ${currentB}`);

    answerInput.value = "";
    timeLeft = 10;
    startTimer();
}

// ⏳ Timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        drawTask(`${currentA} × ${currentB}   (${timeLeft}s)`);
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextTask();
        }
    }, 1000);
}

// 🧠 Sprawdź odpowiedź
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentA * currentB) {
        score++;
        scoreBoard.innerText = "Punkty: " + score;
    }
    nextTask();
}

answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});

// 🎨 Wyświetlanie zadania na canvasie
function drawTask(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// 🏁 Koniec gry
function endGame() {
    clearInterval(timer);
    drawTask(`Koniec! Wynik: ${score}/${maxTasks}`);
    inputBox.style.display = "none";
}
