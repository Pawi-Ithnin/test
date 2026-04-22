const gameData = {
    
    "baca": "https://i.ibb.co/WfqmLPZ/Baca-4f6dce926d7cb25e66a3-1.jpg",
    "angkat": "https://i.ibb.co/CKyDRtL/Angkat-5a39a6cc3f28b66e33d5-1.jpg",
    "hantar": "https://i.ibb.co/zSGdVZ1/Hantar-a700122bd4d677f6426f.jpg",
    "lihat": "https://i.ibb.co/2S0LmmK/Lihat-Tengok-40c6f1eb831eb4fa42c4.jpg",
    "tengok": "https://i.ibb.co/2S0LmmK/Lihat-Tengok-40c6f1eb831eb4fa42c4.jpg",
    "kami": "https://i.ibb.co/2BQ4Zyw/Kami-b14a9c807d6417a26758-1.jpg",
    "saya": "https://i.ibb.co/tTYPQ2YH/Saya-308cf649158d30e78273.jpg",
    "dapat": "https://i.ibb.co/frJhvCZ/Dapat-bf3f428e2690fc364f3f.jpg",
    "curi": "https://i.ibb.co/y0s9VxZ/Curi-965466ebcc080427c968.jpg",
    "gaduh": "https://i.ibb.co/D8jpHzd/Gaduh-94f7a9ac7b4487f0f5d5.jpg",
    "masam": "https://i.ibb.co/3yvggh1F/Masam-29ea15c3839c43ee765e-2.jpg",
    "manis": "https://i.ibb.co/LDP9BZXh/Manis-f4084527a2578320cec8-1.jpg", 
    "tunjuk": "https://i.ibb.co/nNdwXX8p/Tunjuk-0190c8e30053e0878aef.jpg", 
    "tuduh": "https://i.ibb.co/s9d2C8xD/Tuduh-3154156b682ce1008f5e.jpg",
    // Tambah senarai selebihnya di sini...
};

let words = Object.keys(gameData);
let currentWord = "";
let lives = 3;
let stars = 0;

const inputEl = document.getElementById('answer-input');
const msgEl = document.getElementById('message');
const imgEl = document.getElementById('sign-image');

function nextQuestion() {
    if (lives <= 0) return;
    currentWord = words[Math.floor(Math.random() * words.length)];
    imgEl.src = gameData[currentWord];
    inputEl.value = "";
    msgEl.innerText = "";
    msgEl.className = "";
    inputEl.focus();
}

function checkAnswer() {
    const userAns = inputEl.value.toLowerCase().trim();
    if (!userAns) return;

    if (userAns === currentWord) {
        stars++;
        document.getElementById('stars').innerText = stars;
        msgEl.innerText = "BETUL! 🌟";
        msgEl.className = "correct";
        setTimeout(nextQuestion, 1200);
    } else {
        lives--;
        document.getElementById('lives').innerText = lives;
        msgEl.innerText = `SALAH! Jawapan: ${currentWord.toUpperCase()}`;
        msgEl.className = "wrong";
        if (lives <= 0) endGame();
        else setTimeout(nextQuestion, 2000);
    }
}

// Support key Enter
inputEl.addEventListener("keypress", (e) => { if(e.key === "Enter") checkAnswer(); });

function endGame() {
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('final-score').innerText = `Skor Akhir: ${stars} Bintang`;
}

function resetGame() {
    lives = 3; stars = 0;
    document.getElementById('lives').innerText = lives;
    document.getElementById('stars').innerText = stars;
    document.getElementById('overlay').style.display = 'none';
    nextQuestion();
}

// Jalankan soalan pertama
nextQuestion();
