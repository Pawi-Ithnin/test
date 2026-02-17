// 1. FIREBASE SETUP
const firebaseConfig = { databaseURL: "https://tanda-x-pro-default-rtdb.asia-southeast1.firebasedatabase.app/" };
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. KAMUS GAMBAR
const wordImages = {
    "makan": "https://i.ibb.co/pd6WB8L/Makan-Makanan-358171f7a0d456b53998.jpg",
    "baca": "https://i.ibb.co/WfqmLPZ/Baca-4f6dce926d7cb25e66a3-1.jpg",
    "saya": "https://i.ibb.co/tTYPQ2YH/Saya-308cf649158d30e78273.jpg",
    "angkat": "https://i.ibb.co/CKyDRtL/Angkat-5a39a6cc3f28b66e33d5-1.jpg"
};

// 3. YOUTUBE SETUP
let player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', { height: '240', width: '100%', videoId: '' });
};

function getYTID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

// 4. SPEECH RECOGNITION
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
    const rec = new Recognition();
    rec.lang = 'ms-MY';
    rec.continuous = true;
    document.getElementById('btnStart').onclick = () => rec.start();
    document.getElementById('btnStop').onclick = () => rec.stop();
    rec.onresult = (e) => {
        const text = e.results[e.results.length-1][0].transcript.toLowerCase().trim();
        text.split(" ").forEach(w => {
            if(wordImages[w]) {
                document.getElementById('signImage').src = wordImages[w];
                document.getElementById('output').innerText = "Isyarat: " + w.toUpperCase();
            }
        });
    };
}

// 5. CLICK LISTENERS (GAME & YOUTUBE)
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnLoad') {
        const id = getYTID(document.getElementById('youtubeUrl').value);
        if (id && player) player.loadVideoById(id);
    }
    if (e.target.id === 'btnYT') {
        const s = document.getElementById('youtubeSection');
        s.style.display = (s.style.display === 'none') ? 'block' : 'none';
    }
    if (e.target.id === 'toggleGameBtn') {
        const g = document.getElementById('game-container');
        g.style.display = (g.style.display === 'none') ? 'block' : 'none';
        if(g.style.display === 'block') window.loadGameQuestion();
    }
});

// 6. LOGIN & ADMIN SYSTEM
window.showRegister = () => { document.getElementById('login-box').style.display='none'; document.getElementById('register-box').style.display='block'; };
window.showLogin = () => { document.getElementById('login-box').style.display='block'; document.getElementById('register-box').style.display='none'; };

window.prosesLogin = function() {
    const u = document.getElementById('userInput').value.trim().toLowerCase();
    const p = document.getElementById('passInput').value.trim();
    if(u === "admin" && p === "1234") return window.bukaDashboard();
    db.ref('users/' + u).once('value', snap => {
        const d = snap.val();
        if(d && d.pass === p && d.status === 'active') {
            localStorage.setItem('tandaX_logged', 'true'); window.bukaAplikasi();
        } else alert("Akses Ditolak!");
    });
};

window.bukaDashboard = () => {
    document.getElementById('pay-screen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    db.ref('users').on('value', snap => {
        const tbody = document.getElementById('userTableBody'); tbody.innerHTML = "";
        snap.forEach(c => {
            const u = c.val();
            tbody.innerHTML += `<tr><td>${u.user}</td><td>${u.status}</td>
            <td><button onclick="window.ubahStatus('${u.user}','active')">Aktif</button>
            <button onclick="window.ubahStatus('${u.user}','pending')">Sekat</button></td></tr>`;
        });
    });
};

window.ubahStatus = (u, s) => db.ref('users/' + u).update({ status: s });
window.logKeluar = () => { localStorage.clear(); location.reload(); };
window.logKeluarAdmin = () => { db.ref('users').off(); localStorage.clear(); location.reload(); };

function bukaAplikasi() {
    document.getElementById('pay-screen').style.display = 'none';
    document.getElementById('free-demo-section').style.display = 'none';
    document.getElementById('mainAppSection').style.display = 'block';
}

// 7. GAME LOGIC
const gameData = [{a:"baca", i:"https://i.ibb.co/WfqmLPZ/Baca-4f6dce926d7cb25e66a3-1.jpg"}, {a:"makan", i:"https://i.ibb.co/pd6WB8L/Makan-Makanan-358171f7a0d456b53998.jpg"}];
let curG = 0;
window.loadGameQuestion = () => { document.getElementById('sign-image-game').src = gameData[curG].i; document.getElementById('user-input-game').value=""; };
window.checkAnswer = () => {
    const val = document.getElementById('user-input-game').value.toLowerCase().trim();
    if(val === gameData[curG].a) {
        curG++; if(curG < gameData.length) { alert("Betul!"); window.loadGameQuestion(); }
        else { alert("Tamat!"); curG=0; window.loadGameQuestion(); }
    } else alert("Salah!");
};

window.onload = () => { if(localStorage.getItem('tandaX_logged') === 'true') bukaAplikasi(); };
