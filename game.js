
let score = 0;

let taskCount = 0;

const maxTasks = 15;

let timeLeft = 10;

let timer;

let leaderboard = [];

 

const scoreBoard = document.getElementById("scoreboard");

const canvas = document.getElementById("gameCanvas");

const inputBox = document.getElementById("inputBox");

const answerInput = document.getElementById("answerInput");

const micBtn = document.getElementById("micBtn");

const timeBar = document.createElement("div");

timeBar.id = "timeBar";

document.body.appendChild(timeBar);

 

let ctx = canvas.getContext("2d");

let currentA, currentB;

 

// 🎤 Rozpoznawanie mowy

let recognition;

if ("webkitSpeechRecognition" in window) {

    recognition = new webkitSpeechRecognition();

    recognition.lang = "pl-PL";

    recognition.continuous = false;

    recognition.interimResults = false;

 

    recognition.onresult = function (event) {

        let result = event.results[0][0].transcript;

        result = result.replace(/\D/g, "");

        answerInput.value = result;

        checkAnswer();

    };

 

    micBtn.onclick = () => recognition.start();

} else {

    micBtn.style.display = "none";

}

 function resizeCanvas(){
  const containerWidth = document.getElementById("game-container").clientWidth;
  canvas.width = containerWidth * 0.9;
  canvas.height = canvas.width * 0.75;
  if (currentA && currentB) {
   drawTask('${currentA} x ${currentB} (${timeLeft || 10}s)');
  }
 }

window.addEventListener("resize", resizeCanvas)

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

    canvas.classList.add("fade-in");

    setTimeout(() => canvas.classList.remove("fade-in"), 300);

 

    answerInput.value = "";

    timeLeft = 10;

    startTimer();

}

 

// ⏳ Timer

function startTimer() {

    clearInterval(timer);

    timeBar.style.width = "100%";

    timeBar.classList.add("active");

 

    timer = setInterval(() => {

        timeLeft--;

        drawTask(`${currentA} × ${currentB}   (${timeLeft}s)`);

        timeBar.style.width = (timeLeft / 10) * 100 + "%";

 

        if (timeLeft <= 0) {

            clearInterval(timer);

            flashRed();

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

        createConfetti();
        nextTask();

    } else {

        flashRed();

    }

    nextTask();

}

 

answerInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") checkAnswer();

});

 

// 🎨 Wyświetlanie zadania

function drawTask(text) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "60px Comic Sans MS";

    ctx.textAlign = "center";

    ctx.fillStyle = "#222";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

}

 

// 💥 Efekt czerwonego błysku

function flashRed() {

    document.body.classList.add("flash");

    setTimeout(() => document.body.classList.remove("flash"), 300);

}

 

// 🎉 Konfetti

function createConfetti() {

    for (let i = 0; i < 20; i++) {

        const conf = document.createElement("div");

        conf.classList.add("confetti");

        conf.style.left = Math.random() * 100 + "vw";

        conf.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        conf.style.animationDuration = 2 + Math.random() * 2 + "s";

        document.body.appendChild(conf);

        setTimeout(() => conf.remove(), 3000);

    }

}

 

// 🏁 Koniec gry

function endGame() {

    clearInterval(timer);

    timeBar.classList.remove("active");

    drawTask(`Koniec! Wynik: ${score}/${maxTasks}`);

    inputBox.style.display = "none";

    createConfetti();

    leaderboard.push(score);
    leaderboard.sort((a,b) => b-a);
    leaderboard = leaderboard.slice(0, 5);

    const list = document.getElementById("leaderboardList");
    list.innerHTML= "";
    leaderboard.forEach((s, i) => {
     const li = document.createElement("li");
     li.innerText = '#${i + 1}: ${s} punktów';
      list.appendChild(li);
    })
document.getElementById("leaderboard").style.display = "block";
}









