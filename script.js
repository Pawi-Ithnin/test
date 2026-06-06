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
    "berat": "https://i.ibb.co/rwrD00q/Berat-167d033fd4464d4d1f7c.jpg",
    "beza": "https://i.ibb.co/ZhtqK4K/Beza-31ab13b0132f19bf0d5d-1.jpg",
    "bukti": "https://i.ibb.co/Ch5y3D5/Bukti-Membuktikan-45841d5839580627a4e3-1.jpg",
    "cemerlang": "https://i.ibb.co/5YNgXRs/Cemerlang-ecfb99e902b211bb605a-1.jpg",
    "cukup": "https://i.ibb.co/ZMS2Fzr/Cukup-1544d4da1d5a71170ac4-1.jpg",
    "digital": "https://i.ibb.co/syZkWdT/Digital-8de94d31fde61690c99f-1.jpg",
    "gemuk": "https://i.ibb.co/cL53bbN/Gemuk-bd671109050e019e0d3f-1.jpg",
    "istimewa": "https://i.ibb.co/K0jzt8Y/Istimewa-21fd6011b69f29ad987a-1.jpg",
    "jahil": "https://i.ibb.co/sPqNNvS/Jahil-5c5a82f0f7ab158cd5e3.jpg"
};

let words = Object.keys(gameData);
let currentWord = "";
let lives = 3;
let stars = 0;

// Simpan point walaupun refresh
let points = parseInt(localStorage.getItem("points")) || 0;

const inputEl = document.getElementById("answer-input");
const msgEl = document.getElementById("message");
const imgEl = document.getElementById("sign-image");

// Papar point jika elemen wujud
if (document.getElementById("points")) {
    document.getElementById("points").innerText = points;
}

function nextQuestion() {
    if (lives <= 0) return;

    let newWord;

    do {
        newWord = words[Math.floor(Math.random() * words.length)];
    } while (newWord === currentWord && words.length > 1);

    currentWord = newWord;

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
        points++;

        localStorage.setItem("points", points);

        document.getElementById("stars").innerText = stars;

        if (document.getElementById("points")) {
            document.getElementById("points").innerText = points;
        }

        msgEl.innerText = "BETUL! 🌟";
        msgEl.className = "correct";

        // Redeem apabila cukup 5 point
        if (points >= 5) {
            setTimeout(() => {
                alert("🎁 Tahniah! Anda telah mengumpul 5 point dan boleh redeem hadiah!");
            }, 300);
        }

        setTimeout(nextQuestion, 1200);

    } else {

        lives--;

        document.getElementById("lives").innerText = lives;

        msgEl.innerText = `SALAH! Jawapan: ${currentWord.toUpperCase()}`;
        msgEl.className = "wrong";

        if (lives <= 0) {
            endGame();
        } else {
            setTimeout(nextQuestion, 2000);
        }
    }
}

// Tekan Enter untuk semak jawapan
inputEl.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

function endGame() {
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("final-score").innerText =
        `Skor Akhir: ${stars} Bintang`;
}

function resetGame() {
    lives = 3;
    stars = 0;

    document.getElementById("lives").innerText = lives;
    document.getElementById("stars").innerText = stars;

    document.getElementById("overlay").style.display = "none";

    nextQuestion();
}

// Soalan pertama
nextQuestion();
