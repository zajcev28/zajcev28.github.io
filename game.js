// ------------------------------
// USTAWIENIA
// ------------------------------
const totalTime = 60; // czas w sekundach
let timeLeft = totalTime;

let currentTask = null;
let isAnimating = false;
let timerId = null; // przechowuje setInterval -> pozwala czyścić poprzedni timer

// Czekamy na DOM
document.addEventListener("DOMContentLoaded", () => {
    const taskEl = document.getElementById("task");
    const answerInput = document.getElementById("answer");
    const timerEl = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const resultEl = document.getElementById("result");
    const animationBox = document.getElementById("animationBox");

    // Jeżeli brak ważnego elementu — wyloguj i przestań (bez rzucania błędu)
    if (!taskEl || !answerInput || !timerEl || !startBtn || !resultEl || !animationBox) {
        console.error("Brak wymaganych elementów w DOM. Sprawdź czy masz #task, #answer, #timer, #startBtn, #result, #animationBox.");
        return;
    }

    // Start gry
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true; // zapobiegamy wielokrotnemu startowi
        resetGame();
        newTask();
        startTimer();
        animateBox();
    });

    // Odpowiedź gracza (tylko input, nie submit)
    answerInput.addEventListener("input", () => {
        checkAnswer();
    });

    // ------------------------------
    // Funkcje gry
    // ------------------------------

    function resetGame() {
        // jeśli był aktywny timer — czyścimy
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }

        timeLeft = totalTime;
        currentTask = null;
        resultEl.textContent = "";
        answerInput.value = "";
        timerEl.textContent = timeLeft + "s";
        isAnimating = false;
        // upewniamy się, że animacja nie została już zatrzymana (css transform reset)
        animationBox.style.transform = "";
    }

    function startTimer() {
        // zabezpieczenie: jeśli już jest timer, wyczyść go
        if (timerId !== null) {
            clearInterval(timerId);
        }

        // ustaw timer natychmiast w UI (żeby widoczne od razu)
        timerEl.textContent = timeLeft + "s";

        timerId = setInterval(() => {
            timeLeft--;
            // Aktualizujemy UI za każdym tickiem
            timerEl.textContent = timeLeft + "s";

            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                resultEl.textContent = "Koniec czasu!";
                stopAnimation();
                startBtn.disabled = false; // pozwalamy restartować
            }
        }, 1000);
    }

    function newTask() {
        // jeśli gra już się skończyła (timeLeft <= 0) — nie tworzymy nowych zadań
        if (timeLeft <= 0) {
            return;
        }

        const a = Math.floor(Math.random() * 10 + 1);
        const b = Math.floor(Math.random() * 10 + 1);

        currentTask = { a, b, result: a + b };
        taskEl.textContent = `${a} + ${b} = ?`;

        // Ważne: od razu odświeżamy licznik w UI, żeby sekundy były widoczne natychmiast
        timerEl.textContent = timeLeft + "s";
    }

    function checkAnswer() {
        // zabezpieczenie: jeśli nie ma zadania, nic nie robić
        if (!currentTask) return;

        // jeśli pusty input — pomiń
        const val = answerInput.value.trim();
        if (val === "") return;

        // porównujemy liczbę (Number), obsługujemy też liczby z przecinkami - używamy parseInt/Number
        const userVal = Number(val);
        if (!Number.isFinite(userVal)) return; // nie liczba

        if (userVal === currentTask.result) {
            resultEl.textContent = "Dobrze!";
            // króciutkie opóźnienie żeby użytkownik zauważył "Dobrze!" i animacje
            setTimeout(() => {
                // po poprawnej odpowiedzi — nowe zadanie i czyścimy input
                answerInput.value = "";
                newTask();
            }, 200);
        } else {
            // niepoprawna odpowiedź - lekki feedback, nie generujemy nowego zadania
            resultEl.textContent = "Spróbuj jeszcze raz";
            flashWrong();
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

    function stopAnimation() {
        isAnimating = false;
        // opcjonalnie ustawiamy transform na 0
        animationBox.style.transform = "";
    }

    // prosty efekt błędnej odpowiedzi
    function flashWrong() {
        animationBox.classList.add("shake");
        setTimeout(() => animationBox.classList.remove("shake"), 300);
    }

    // Opcjonalne: przy zamknięciu/odświeżeniu strony czyścimy timery
    window.addEventListener("beforeunload", () => {
        if (timerId) clearInterval(timerId);
    });
});
