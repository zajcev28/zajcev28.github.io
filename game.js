// ------------------------------
// USTAWIENIA
// ------------------------------
const totalTime = 60; // czas w sekundach
let timeLeft = totalTime;

let currentTask = null;
let isAnimating = false;

// Elementy DOM — łapiemy je dopiero gdy DOM już istnieje!
document.addEventListener("DOMContentLoaded", () => {
    const taskEl = document.getElementById("task");
    const answerInput = document.getElementById("answer");
    const timerEl = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const resultEl = document.getElementById("result");
    const animationBox = document.getElementById("animationBox");

    // Start gry
    startBtn.addEventListener("click", () => {
        resetGame();
        newTask();
        startTimer();
        animateBox();
    });

    // Odpowiedź gracza
    answerInput.addEventListener("input", () => {
        checkAnswer();
    });

    // ------------------------------
    // Funkcje gry
    // ------------------------------

    function resetGame() {
        timeLeft = totalTime;
        resultEl.textContent = "";
        answerInput.value = "";
        timerEl.textContent = timeLeft + "s";
    }

    function startTimer() {
        const interval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft + "s"; // Sekundy widoczne od razu

            if (timeLeft <= 0) {
                clearInterval(interval);
                resultEl.textContent = "Koniec czasu!";
                isAnimating = false; // Zatrzymaj animację
            }
        }, 1000);
    }

    function newTask() {
        const a = Math.floor(Math.random() * 10 + 1);
        const b = Math.floor(Math.random() * 10 + 1);

        currentTask = { a, b, result: a + b };
        taskEl.textContent = `${a} + ${b} = ?`;
        timerEl.textContent = timeLeft + "s";
    }

    function checkAnswer() {
        if (Number(answerInput.value) === currentTask.result) {
            resultEl.textContent = "Dobrze!";
            newTask();
            answerInput.value = "";
        }
    }

    // ------------------------------
    // Animacja — płynna i lekka
    // ------------------------------
    function animateBox() {
        if (isAnimating) return;
        isAnimating = true;

        let pos = 0;
        let direction = 1;

        function frame() {
            if (!isAnimating) return;

            pos += direction * 2;

            if (pos >= 200) direction = -1;
            if (pos <= 0) direction = 1;

            animationBox.style.transform = `translateX(${pos}px)`;

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
});

