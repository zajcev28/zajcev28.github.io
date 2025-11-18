// ======= ELEMENTY DOM =======
const taskEl = document.getElementById("task");
const answerInput = document.getElementById("answerInput");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ======= ZMIENNE GRY =======
let currentA, currentB;
let questionCount = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;

// ======= BOMBA – ANIMACJA =======
function drawBomb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // lont
    ctx.fillStyle = "orange";
    ctx.fillRect(canvas.width / 2 + 35, canvas.height / 2 - 5, 20, 10);

    // płomień (migający)
    ctx.fillStyle = (timeLeft % 2 === 0) ? "yellow" : "red";
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + 60, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
}

// ======= ANIMACJA WYBUCHU =======
function explodeBomb(callback) {
    let radius = 40;
    let maxRadius = 150;
    let alpha = 1;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // kula ognia
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(80 + radius)}, 0, ${alpha})`;
        ctx.fill();

        radius += 8;
        alpha -= 0.05;

        if (radius <= maxRadius && alpha > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (callback) callback();
        }
    }

    animate();
}


// ======= GENERATOR ZADAŃ =======
function newQuestion() {
    currentA = Math.floor(Math.random() * 10) + 1;
    currentB = Math.floor(Math.random() * 10) + 1;

    taskEl.textContent = `${currentA} × ${currentB} = ?`;

    answerInput.value = "";
    answerInput.focus();

    timeLeft = 10;
    timerEl.textContent = `Czas: ${timeLeft}s`;

    drawBomb();

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Czas: ${timeLeft}s`;
        drawBomb();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(true);
        }
    }, 1000);
}

function checkAnswer(timeout = false) {
    clearInterval(timerInterval);

    const correct = currentA * currentB;
    const userAnswer = parseInt(answerInput.value);

    // Zła odpowiedź lub timeout → WYBUCH
    if (timeout || userAnswer !== correct) {
        resultEl.textContent = timeout
            ? `⏳ Czas minął! Poprawna odpowiedź: ${correct}`
            : `✖ Źle! Poprawna odpowiedź: ${correct}`;

        explodeBomb(() => {
            questionCount++;
            if (questionCount < 15) {
                newQuestion();
            } else {
                endGame();
            }
        });

        return;
    }

    // Dobra odpowiedź
    resultEl.textContent = "✔ Dobrze!";
    score++;

    questionCount++;
    if (questionCount < 15) {
        setTimeout(newQuestion, 800);
    } else {
        endGame();
    }
}


// ======= KONIEC GRY =======
function endGame() {
    taskEl.textContent = "Koniec gry!";
    timerEl.textContent = "";
    resultEl.textContent = `Twój wynik: ${score}/15`;
}

// ======= START GRY =======
startBtn.addEventListener("click", () => {
    score = 0;
    questionCount = 0;
    resultEl.textContent = "";
    newQuestion();
});

// ======= KLAWIATURA ENTER =======
answerInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// ======= ROZPOZNAWANIE MOWY =======
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.interimResults = false;

    recognition.onresult = e => {
        answerInput.value = e.results[0][0].transcript.replace(/\D/g, "");
        checkAnswer();
    };

    recognition.onerror = () => {};

    // kliknięcie w pole uruchamia nasłuch
    answerInput.addEventListener("click", () => {
        recognition.start();
    });
} else {
    console.log("Rozpoznawanie mowy niedostępne w tej przeglądarce.");
}

