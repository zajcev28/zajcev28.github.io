const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreboard');
const inputBox = document.getElementById('answerInput');
const micBtn = document.getElementById('micBtn');

let bombs = [];
let active = false;
let score = 0;
let bombCount = 0;
const totalBombs = 15;
const fallSpeed = 1.3;
const bombRadius = 32;
let recognition = null;

// --- Start gry ---
function startGame() {
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('inputBox').style.display = 'block';
    micBtn.style.display = 'block';

    score = 0;
    bombCount = 0;
    scoreBoard.textContent = `Punkty: ${score}`;
    active = true;

    spawnBomb();
    gameLoop();
}

// --- Tworzenie nowej bomby ---
function spawnBomb() {
    if (!active || bombCount >= totalBombs) return;

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const bomb = {
        x: Math.random() * (canvas.width - bombRadius * 2) + bombRadius,
        y: -50,
        a, b,
        result: a * b,
        color: 'black',
        timeLeft: 10 * 60 // ~10s przy 60 FPS
    };

    bombs.push(bomb);
    bombCount++;

    // Spawn nowej bomby co 2.5s
    if (bombCount < totalBombs) {
        setTimeout(spawnBomb, 2500);
    }
}

// --- Główna pętla gry ---
function gameLoop() {
    if (!active) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bombs.forEach(bomb => {
        bomb.y += fallSpeed;
        bomb.timeLeft--;

        if (bomb.timeLeft <= 0) explodeFail(bomb);

        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bombRadius, 0, Math.PI * 2);
        ctx.fillStyle = bomb.color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${bomb.a} × ${bomb.b}`, bomb.x, bomb.y + 7);
    });

    bombs = bombs.filter(b => b.y < canvas.height + bombRadius);

    if (bombCount >= totalBombs && bombs.length === 0) endGame();

    requestAnimationFrame(gameLoop);
}

// --- Sprawdzenie odpowiedzi ---
function checkAnswer(value) {
    for (let b of bombs) {
        if (b.result === value) {
            score++;
            scoreBoard.textContent = `Punkty: ${score}`;
            explode(b);
            return;
        }
    }
}

// --- Wybuch poprawny ---
function explode(bomb) {
    bomb.color = 'orange';
    setTimeout(() => {
        bombs = bombs.filter(x => x !== bomb);
    }, 200);
}

// --- Wybuch niepoprawny / czas minął ---
function explodeFail(bomb) {
    bomb.color = 'red';
    setTimeout(() => {
        bombs = bombs.filter(x => x !== bomb);
    }, 200);
}

// --- Koniec gry ---
function endGame() {
    active = false;
    alert(`Koniec gry! Twój wynik: ${score}/${totalBombs}`);
    location.reload();
}

// --- Klawiatura ---
const inputField = document.getElementById('answeInput');
inputBox.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) checkAnswer(val);
        e.target.value = '';
    }
});

// --- Mikrofon ---
micBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
        recognition = null;
        micBtn.textContent = "🎤 Włącz mikrofon";
        micBtn.classList.remove('active');
        return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");

    recognition = new SR();
    recognition.lang = 'pl-PL';
    recognition.continuous = true;

    micBtn.textContent = "🎧 Nasłuchuję...";
    micBtn.classList.add('active');

    recognition.onresult = e => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        const num = parseInt(transcript.replace(/\D/g, ''));
        if (!isNaN(num)) checkAnswer(num);
    };

    recognition.start();
});

