// --- 1. FIREBASE CONFIG (Kekal Asal) ---
const firebaseConfig = { databaseURL: "https://tanda-x-pro-default-rtdb.asia-southeast1.firebasedatabase.app/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const TELEGRAM_TOKEN = "8362133596:AAG0FzCOuspjxIrZT6dl2CFAC0pwBanf-yE"; 
const TELEGRAM_CHAT_ID = "1460830899"; 

// --- 2. GAME LOGIC ---
const gameData = [
    { word: "MAKAN", img: "https://i.ibb.co/pd6WB8L/Makan-Makanan-358171f7a0d456b53998.jpg" },
    { word: "SAYA", img: "https://i.ibb.co/tTYPQ2YH/Saya-308cf649158d30e78273.jpg" }
];
let currentLevel = 0, lives = 3;

window.startLevel = () => {
    document.getElementById('gameSignImage').src = gameData[currentLevel].img;
    document.getElementById('gameInput').value = "";
    document.getElementById('gameFeedback').innerText = "";
};

window.checkGameAnswer = () => {
    const input = document.getElementById('gameInput').value.trim().toUpperCase();
    const correct = gameData[currentLevel].word;
    if (input === correct) {
        document.getElementById('gameFeedback').innerText = "✅ BETUL!";
        currentLevel = (currentLevel + 1) % gameData.length;
        setTimeout(window.startLevel, 1200);
    } else {
        lives--;
        document.getElementById('lives').innerText = "❤️".repeat(lives) + "🖤".repeat(3-lives);
        document.getElementById('gameFeedback').innerText = "❌ SALAH! Jwp: " + correct;
        if (lives <= 0) { alert("Game Over!"); location.reload(); }
        else { currentLevel = (currentLevel + 1) % gameData.length; setTimeout(window.startLevel, 2000); }
    }
};

// --- 3. FUNGSI ASAL (Firebase, Login, Admin, Speech) ---
window.showRegister = () => { document.getElementById('login-box').style.display = 'none'; document.getElementById('register-box').style.display = 'block'; };
window.showLogin = () => { document.getElementById('login-box').style.display = 'block'; document.getElementById('register-box').style.display = 'none'; };

window.prosesDaftar = () => {
    const u = document.getElementById('regUser').value.trim().toLowerCase();
    const p = document.getElementById('regPass').value.trim();
    const ph = document.getElementById('regPhone').value.trim();
    const pkg = document.getElementById('regPackage').value;
    db.ref('users/' + u).set({ user: u, pass: p, phone: ph, pakej: pkg, status: "pending" }).then(() => {
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent("Daftar Baru: "+u)}`);
        alert("Berjaya! Tunggu Admin aktifkan."); window.showLogin();
    });
};

window.prosesLogin = () => {
    const u = document.getElementById('userInput').value.trim().toLowerCase();
    const p = document.getElementById('passInput').value.trim();
    if (u === "admin" && p === "1234") return bukaDashboard();
    db.ref('users/' + u).once('value', (s) => {
        const d = s.val();
        if (d && d.pass === p && d.status === "active") { localStorage.setItem('logged','true'); bukaAplikasi(); }
        else alert("Salah atau belum aktif!");
    });
};

function bukaDashboard() { 
    document.getElementById('pay-screen').style.display = 'none'; 
    document.getElementById('adminDashboard').style.display = 'block';
    db.ref('users').on('value', (s) => {
        const body = document.getElementById('userTableBody'); body.innerHTML = "";
        s.forEach((c) => { 
            const u = c.val();
            body.innerHTML += `<tr><td>${u.user}</td><td>${u.phone}</td><td>${u.status}</td>
            <td><button onclick="db.ref('users/${u.user}').update({status:'active'})">Aktif</button></td></tr>`;
        });
    });
}

function bukaAplikasi() { 
    document.getElementById('pay-screen').style.display = 'none'; 
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('mainAppSection').style.display = 'block'; 
}

window.logKeluar = () => { localStorage.clear(); location.reload(); };

// Speech Recognition & Falling Icons
window.onload = () => {
    window.startLevel();
    setInterval(() => {
        const icon = document.createElement('div'); icon.className = 'cny-icon';
        icon.innerText = ['🍊','🐉','🧧'][Math.floor(Math.random()*3)];
        icon.style.left = Math.random()*100+"vw"; icon.style.animationDuration = "5s";
        document.body.appendChild(icon); setTimeout(()=>icon.remove(), 5000);
    }, 500);
    if(localStorage.getItem('logged')==='true') bukaAplikasi();
};
