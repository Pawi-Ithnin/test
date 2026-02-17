/**
 * TANDA X 1.0 - PRO (FINAL ONLINE VERSION)
 */

// --- 1. CONFIG FIREBASE ---
const firebaseConfig = {
    databaseURL: "https://tanda-x-pro-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 2. CONFIG TELEGRAM ---
const TELEGRAM_TOKEN = "8362133596:AAG0FzCOuspjxIrZT6dl2CFAC0pwBanf-yE"; 
const TELEGRAM_CHAT_ID = "1460830899"; 

// --- 3. LOGIK GAME (BARU - HADAPAN) ---
const gameData = [
    { word: "MAKAN", img: "https://i.ibb.co/pd6WB8L/Makan-Makanan-358171f7a0d456b53998.jpg" },
    { word: "SAYA", img: "https://i.ibb.co/tTYPQ2YH/Saya-308cf649158d30e78273.jpg" },
    { word: "MANDI", img: "https://i.ibb.co/RT8bLtZ/Mandi-36a248a7c1e9603e8ad9.jpg" },
    { word: "BACA", img: "https://i.ibb.co/WfqmLPZ/Baca-4f6dce926d7cb25e66a3-1.jpg" }
];

let currentLevel = 0;
let lives = 3;

window.startLevel = () => {
    if (lives <= 0) return;
    const feedback = document.getElementById('gameFeedback');
    const imgElement = document.getElementById('gameSignImage');
    const inputElement = document.getElementById('gameInput');

    if (imgElement) imgElement.src = gameData[currentLevel].img;
    if (inputElement) inputElement.value = "";
    if (feedback) feedback.innerText = "";
};

window.checkGameAnswer = () => {
    const input = document.getElementById('gameInput').value.trim().toUpperCase();
    const jawapanBetul = gameData[currentLevel].word.toUpperCase();
    const feedback = document.getElementById('gameFeedback');

    if (input === jawapanBetul) {
        feedback.innerText = "✅ BETUL! Hebat!";
        feedback.style.color = "green";
        currentLevel = (currentLevel + 1) % gameData.length;
        setTimeout(window.startLevel, 1500);
    } else {
        lives--;
        updateLivesUI();
        feedback.innerText = `❌ SALAH! Jawapan Sebenar: ${jawapanBetul}`;
        feedback.style.color = "red";

        if (lives <= 0) {
            feedback.innerText = "👻 GAME OVER! Sila cuba lagi.";
            setTimeout(resetGame, 3000);
        } else {
            // Walaupun salah, tunjuk jawapan dan pergi ke soalan seterusnya
            currentLevel = (currentLevel + 1) % gameData.length;
            setTimeout(window.startLevel, 2500);
        }
    }
};

function updateLivesUI() {
    const lifeContainer = document.getElementById('lives');
    if (lifeContainer) {
        lifeContainer.innerText = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    }
}

function resetGame() {
    lives = 3;
    currentLevel = 0;
    updateLivesUI();
    window.startLevel();
}

// --- 4. LOGIK NAVIGASI ---
window.showRegister = () => {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'block';
};

window.showLogin = () => {
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('register-box').style.display = 'none';
};

// --- 5. LOGIK PENDAFTARAN ---
window.prosesDaftar = () => {
    const u = document.getElementById('regUser').value.trim().toLowerCase();
    const p = document.getElementById('regPass').value.trim();
    const ph = document.getElementById('regPhone').value.trim();
    const pkg = document.getElementById('regPackage').value;

    if(!u || !p || !ph) return alert("Sila isi semua maklumat!");

    db.ref('users/' + u).once('value', (snapshot) => {
        if (snapshot.exists()) {
            alert("Username ini sudah berdaftar!");
        } else {
            db.ref('users/' + u).set({
                user: u, pass: p, phone: ph, pakej: pkg, status: "pending"
            }).then(() => {
                const mesej = `🔔 *DAFTAR BARU*\n👤 User: ${u}\n🔑 Pass: ${p}\n📞 Phone: ${ph}\n📦 Pakej: ${pkg}`;
                const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(mesej)}&parse_mode=Markdown`;
                fetch(url);
                alert("Pendaftaran berjaya! Tunggu admin aktifkan akaun anda.");
                window.showLogin();
            });
        }
    });
};

// --- 6. LOGIK LOG MASUK ---
window.prosesLogin = () => {
    const u = document.getElementById('userInput').value.trim().toLowerCase();
    const p = document.getElementById('passInput').value.trim();

    if (u === "admin" && p === "1234") return bukaDashboard();

    db.ref('users/' + u).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.pass === p) {
            if (userData.status === "pending") return alert("Akaun belum aktif. Sila hubungi Admin!");
            localStorage.setItem('tandaX_logged', 'true');
            localStorage.setItem('tandaX_user', u);
            bukaAplikasi();
        } else {
            alert("Username atau Password salah!");
        }
    });
};

// --- 7. ADMIN DASHBOARD ---
function bukaDashboard() {
    document.getElementById('pay-screen').style.display = 'none';
    document.getElementById('game-section').style.display = 'none'; // Sembunyi game
    document.getElementById('adminDashboard').style.display = 'block';
    
    db.ref('users').on('value', (snapshot) => {
        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = "";
        snapshot.forEach((child) => {
            const user = child.val();
            const waLink = `https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`;
            tbody.innerHTML += `<tr>
                <td>${user.user}</td>
                <td>${user.phone}</td>
                <td>${user.pakej}</td>
                <td><strong>${user.status.toUpperCase()}</strong></td>
                <td>
                    ${user.status === 'pending' ? `<button onclick="ubahStatus('${user.user}','active')" style="background:green;color:white;border:none;padding:5px;border-radius:3px;cursor:pointer;">Aktif</button>` : ''}
                    <button onclick="padamUser('${user.user}')" style="background:red;color:white;border:none;padding:5px;border-radius:3px;margin-left:5px;cursor:pointer;">Padam</button>
                    <a href="${waLink}" target="_blank" style="background:#25D366;color:white;padding:5px;border-radius:3px;text-decoration:none;font-size:12px;margin-left:5px;">WA</a>
                </td>
            </tr>`;
        });
    });
}

window.ubahStatus = (username, s) => db.ref('users/' + username).update({ status: s });
window.padamUser = (username) => { if(confirm("Padam user " + username + "?")) db.ref('users/' + username).remove(); };
window.logKeluarAdmin = () => { localStorage.clear(); location.reload(); };

// --- 8. APLIKASI UTAMA ---
function bukaAplikasi() {
    document.getElementById('pay-screen').style.display = 'none';
    document.getElementById('game-section').style.display = 'none'; // Sembunyi game
    document.getElementById('mainAppSection').style.display = 'block';
    document.getElementById('status').innerText = "Akaun: " + localStorage.getItem('tandaX_user');
}

window.logKeluar = () => { localStorage.clear(); location.reload(); };

// --- 9. YOUTUBE API ---
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;

document.getElementById('btnLoad').onclick = () => {
    const url = document.getElementById('youtubeUrl').value;
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]{11})/)?.[1];
    if (videoId) {
        if (player) player.loadVideoById(videoId);
        else player = new YT.Player('player', { height: '360', width: '100%', videoId: videoId });
    }
};

// --- 10. SPEECH RECOGNITION ---
const wordImages = {
    kami: "https://i.ibb.co/2BQ4Zyw/Kami-b14a9c807d6417a26758-1.jpg",
    saya: "https://i.ibb.co/tTYPQ2YH/Saya-308cf649158d30e78273.jpg",
    makan: "https://i.ibb.co/pd6WB8L/Makan-Makanan-358171f7a0d456b53998.jpg",
    mandi: "https://i.ibb.co/RT8bLtZ/Mandi-36a248a7c1e9603e8ad9.jpg",
    baca: "https://i.ibb.co/WfqmLPZ/Baca-4f6dce926d7cb25e66a3-1.jpg"
};

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const rec = new Recognition();
    rec.lang = 'ms-MY'; 
    rec.continuous = true;

    document.getElementById('btnStart').onclick = () => { 
        rec.start(); 
        document.getElementById('status').innerText = "🎤 Mendengar..."; 
    };

    document.getElementById('btnStop').onclick = () => { 
        rec.stop(); 
        document.getElementById('status').innerText = "Berhenti."; 
    };

    rec.onresult = (e) => {
        const t = e.results[e.results.length-1][0].transcript.toLowerCase().trim();
        document.getElementById('transcriptDisplay').innerText = t;
        const lastWord = t.split(" ").pop().replace(/[^\w]/g, '');
        
        if (wordImages[lastWord]) {
            document.getElementById('signImage').src = wordImages[lastWord];
            document.getElementById('output').innerText = "Isyarat: " + lastWord.toUpperCase();
        } else {
            fingerspell(lastWord);
        }
    };
}

function fingerspell(w) {
    let i = 0;
    const interval = setInterval(() => {
        if(i >= w.length) return clearInterval(interval);
        document.getElementById('signImage').src = `https://via.placeholder.com/300?text=${w[i].toUpperCase()}`;
        document.getElementById('output').innerText = "Mengeja: " + w[i].toUpperCase();
        i++;
    }, 700);
}

document.getElementById('btnYT').onclick = () => {
    document.getElementById('youtubeSection').style.display = "block";
    document.getElementById('signLanguageSection').style.display = "flex";
};

// --- 11. SISTEM FALLING ICONS (CNY) ---
function createCNYIcon() {
    const icons = ['🍊', '🐉', '🧧', '🏮', '✨'];
    const iconElement = document.createElement('div');
    iconElement.classList.add('cny-icon');
    iconElement.innerText = icons[Math.floor(Math.random() * icons.length)];
    iconElement.style.left = Math.random() * 100 + "vw";
    iconElement.style.fontSize = Math.random() * 20 + 20 + "px";
    const duration = Math.random() * 4 + 4;
    iconElement.style.animationDuration = duration + "s";
    document.body.appendChild(iconElement);
    setTimeout(() => iconElement.remove(), duration * 1000);
}

// Menjalankan semua sistem semasa window load
window.onload = () => { 
    setInterval(createCNYIcon, 500); // Lancarkan CNY Icon
    window.startLevel(); // Mula Game
    if(localStorage.getItem('tandaX_logged') === 'true') {
        bukaAplikasi(); 
    }
};
