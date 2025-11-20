/* =============================================
   SHARED HELPER FUNCTIONS
   ============================================= */
   function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* =============================================
   GAME 1: WEREWOLF LOGIC
   ============================================= */
const WerewolfGame = {
    roles: [],
    currentPlayerIndex: 0,

    // Elements
    setupScreen: document.getElementById('ww-setupScreen'),
    assignScreen: document.getElementById('ww-assignScreen'),
    revealScreen: document.getElementById('ww-revealScreen'),
    rolesTextarea: document.getElementById('ww-rolesTextarea'),
    playerCountText: document.getElementById('ww-playerCount'),
    playerTurnText: document.getElementById('ww-playerTurnText'),
    roleDisplay: document.getElementById('ww-roleDisplay'),

    init() {
        document.getElementById('ww-startButton').addEventListener('click', () => this.startGame());
        document.getElementById('ww-revealButton').addEventListener('click', () => this.revealRole());
        document.getElementById('ww-nextPlayerButton').addEventListener('click', () => this.nextPlayer());
        this.rolesTextarea.addEventListener('input', () => this.updatePlayerCount());
    },

    resetGame() {
        this.setupScreen.classList.remove('hidden');
        this.assignScreen.classList.add('hidden');
        this.revealScreen.classList.add('hidden');
        this.rolesTextarea.value = '';
        this.playerCountText.innerText = 'จำนวนผู้เล่น: 0';
        this.roles = [];
        this.currentPlayerIndex = 0;
    },

    updatePlayerCount() {
        const rolesInput = this.rolesTextarea.value;
        const allRoles = rolesInput.split('\n').filter(role => role.trim() !== '');
        this.playerCountText.innerText = `จำนวนผู้เล่น: ${allRoles.length}`;
    },

    startGame() {
        const rolesInput = this.rolesTextarea.value;
        const allRoles = rolesInput.split('\n').filter(role => role.trim() !== '');
        if (allRoles.length < 2) { alert("ใส่บทบาทอย่างน้อย 2 คนครับ"); return; }
        
        this.roles = shuffleArray(allRoles);
        this.currentPlayerIndex = 0;
        this.playerTurnText.innerText = `ผู้เล่นคนที่ ${this.currentPlayerIndex + 1}`;
        this.setupScreen.classList.add('hidden');
        this.assignScreen.classList.remove('hidden');
    },

    revealRole() {
        this.roleDisplay.innerText = this.roles[this.currentPlayerIndex];
        this.assignScreen.classList.add('hidden');
        this.revealScreen.classList.remove('hidden');
    },

    nextPlayer() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex < this.roles.length) {
            this.playerTurnText.innerText = `ผู้เล่นคนที่ ${this.currentPlayerIndex + 1}`;
            this.revealScreen.classList.add('hidden');
            this.assignScreen.classList.remove('hidden');
        } else {
            alert("ทุกคนรู้บทบาทแล้ว เริ่มเกมได้!");
            this.resetGame();
            App.showScreen('hub');
        }
    }
};

/* =============================================
   GAME 2: SPYFALL LOGIC
   ============================================= */
const SpyfallGame = {
    locationsDeck: [
        { name: "สถานีอวกาศ", roles: ["วิศวกร", "นักบิน", "นักวิทย์", "เอเลี่ยน", "ผู้การ"] },
        { name: "เรือดำน้ำ", roles: ["กัปตัน", "โซนาร์", "ช่าง", "กุ๊ก", "ต้นหน"] },
        { name: "คณะละครสัตว์", roles: ["ตัวตลก", "นักกายกรรม", "ควาญช้าง", "มายากล", "คนดู"] },
        { name: "ธนาคาร", roles: ["ผู้จัดการ", "พนักงาน", "รปภ.", "ลูกค้า", "โจร"] },
        { name: "โรงพยาบาล", roles: ["หมอ", "พยาบาล", "คนไข้", "ภารโรง", "เภสัช"] },
        { name: "โรงแรม", roles: ["พนักงานต้อนรับ", "แม่บ้าน", "ลูกค้า", "บาร์เทนเดอร์", "ยาม"] },
        { name: "เครื่องบิน", roles: ["แอร์", "สจ๊วต", "กัปตัน", "ผู้โดยสาร", "ช่างเครื่อง"] }
    ],
    playerCount: 3,
    spyCount: 1,
    timeRemaining: 0,
    timerInterval: null,
    allRoles: [],
    currentLocation: null,
    currentPlayerIndex: 0,

    // Elements
    setupScreen: document.getElementById('sf-setupScreen'),
    assignScreen: document.getElementById('sf-assignScreen'),
    revealScreen: document.getElementById('sf-revealScreen'),
    timerScreen: document.getElementById('sf-timerScreen'),
    playerCountSelect: document.getElementById('sf-playerCountSelect'),
    playerTurnText: document.getElementById('sf-playerTurnText'),
    roleDisplay: document.getElementById('sf-roleDisplay'),
    locationDisplay: document.getElementById('sf-locationDisplay'),
    timerDisplay: document.getElementById('sf-timerDisplay'),
    startTimerButton: document.getElementById('sf-startTimerButton'),
    spyBtns: document.querySelectorAll('#sf-spyCountButtons button'),
    timeBtns: document.querySelectorAll('#sf-timeSelectButtons button'),

    init() {
        // Setup Select Options
        for(let i=3; i<=12; i++) {
            let opt = document.createElement('option');
            opt.value = i; opt.innerText = i + " คน";
            this.playerCountSelect.appendChild(opt);
        }

        document.getElementById('sf-startGameButton').addEventListener('click', () => this.startGame());
        document.getElementById('sf-revealButton').addEventListener('click', () => this.revealRole());
        document.getElementById('sf-nextPlayerButton').addEventListener('click', () => this.nextPlayer());
        document.getElementById('sf-startTimerButton').addEventListener('click', () => this.startTimer());
        document.getElementById('sf-playAgainButton').addEventListener('click', () => this.resetGame());

        // Spy Count Toggle
        this.spyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.spyBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.spyCount = parseInt(e.target.dataset.spyCount);
            });
        });

        // Time Select
        this.timeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.timeBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.timeRemaining = parseInt(e.target.dataset.timeMin) * 60;
                this.updateTimerDisplay();
                this.startTimerButton.disabled = false;
            });
        });
    },

    resetGame() {
        clearInterval(this.timerInterval);
        this.setupScreen.classList.remove('hidden');
        this.assignScreen.classList.add('hidden');
        this.revealScreen.classList.add('hidden');
        this.timerScreen.classList.add('hidden');
        document.getElementById('sf-playAgainButton').classList.add('hidden');
        this.startTimerButton.classList.remove('hidden');
        this.startTimerButton.disabled = true;
        this.timerDisplay.style.color = "var(--secondary-color)";
        this.timerDisplay.innerText = "00:00";
        this.timeBtns.forEach(b => { b.classList.remove('selected'); b.disabled = false; });
    },

    startGame() {
        this.playerCount = parseInt(this.playerCountSelect.value);
        this.currentLocation = this.locationsDeck[Math.floor(Math.random() * this.locationsDeck.length)];
        
        let roles = [];
        let availableRoles = [...this.currentLocation.roles];
        shuffleArray(availableRoles);

        // Fill roles
        let normalCount = this.playerCount - this.spyCount;
        for(let i=0; i<normalCount; i++) roles.push(availableRoles[i % availableRoles.length]);
        for(let i=0; i<this.spyCount; i++) roles.push("Spy");

        this.allRoles = shuffleArray(roles);
        this.currentPlayerIndex = 0;
        this.playerTurnText.innerText = `ผู้เล่นคนที่ ${this.currentPlayerIndex + 1}`;
        
        this.setupScreen.classList.add('hidden');
        this.assignScreen.classList.remove('hidden');
    },

    revealRole() {
        let role = this.allRoles[this.currentPlayerIndex];
        if (role === "Spy") {
            this.roleDisplay.innerText = "Spy";
            this.locationDisplay.innerText = "???";
            this.roleDisplay.style.color = "var(--danger-color)";
        } else {
            this.roleDisplay.innerText = role;
            this.locationDisplay.innerText = this.currentLocation.name;
            this.roleDisplay.style.color = "var(--secondary-color)";
        }
        this.assignScreen.classList.add('hidden');
        this.revealScreen.classList.remove('hidden');
    },

    nextPlayer() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex < this.playerCount) {
            this.playerTurnText.innerText = `ผู้เล่นคนที่ ${this.currentPlayerIndex + 1}`;
            this.revealScreen.classList.add('hidden');
            this.assignScreen.classList.remove('hidden');
        } else {
            this.revealScreen.classList.add('hidden');
            this.timerScreen.classList.remove('hidden');
        }
    },

    startTimer() {
        this.startTimerButton.disabled = true;
        this.timeBtns.forEach(b => b.disabled = true);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            if(this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.timerDisplay.innerText = "หมดเวลา!";
                this.timerDisplay.style.color = "var(--danger-color)";
                document.getElementById('sf-playAgainButton').classList.remove('hidden');
                this.startTimerButton.classList.add('hidden');
            }
        }, 1000);
    },

    updateTimerDisplay() {
        let m = Math.floor(this.timeRemaining / 60);
        let s = this.timeRemaining % 60;
        this.timerDisplay.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
};

/* =============================================
   GAME 3: WEREWORDS LOGIC (UPDATED)
   ============================================= */
/* =============================================
   GAME 3: WEREWORDS LOGIC (แก้ไข: แสดงบทบาทหน้าแรกให้ชัวร์ขึ้น)
   ============================================= */
const WerewordsGame = {
    rolesInfo: {
        "Mayor": { desc: "นายก: เลือกคำ ตอบคำถาม (ใช่/ไม่/อาจจะ) *อาจมีบทแฝง*", team: "ชาวบ้าน" },
        "Werewolf": { desc: "หมาป่า: รู้คำลับ ต้องทำให้ชาวบ้านทายผิด", team: "หมาป่า" },
        "Seer": { desc: "ผู้หยั่งรู้: รู้คำลับ ต้องช่วยเนียนๆ", team: "ชาวบ้าน" },
        "Major": { desc: "Major (ชาวบ้าน): ไม่รู้คำ ช่วยกันถาม", team: "ชาวบ้าน" },
        "Minion": { desc: "สมุนปีศาจ: ไม่รู้คำ รู้ตัวหมาป่า", team: "หมาป่า" },
        "Beholder": { desc: "ผู้เฝ้ามอง: รู้ตัว Seer ไม่รู้คำ", team: "ชาวบ้าน" },
        "Apprentice Seer": { desc: "ศิษย์: รู้หมวดหมู่/ตัวอักษรแรก", team: "ชาวบ้าน" },
        "Hunchback": { desc: "คนบ้า: ขวางไม่ให้ทายถูก เพื่อชนะคนเดียว", team: "คนบ้า" }
    },
    wordCategories: [
        ["แอปเปิ้ล", "ภูเขา", "รองเท้า", "โทรศัพท์", "ประเทศไทย", "ซุปเปอร์แมน"],
        ["โรงเรียน", "ช้าง", "นาฬิกา", "แม่น้ำ", "พิซซ่า", "โดราเอมอน"],
        ["เครื่องบิน", "ทะเล", "หนังสือ", "ไมโครเวฟ", "ญี่ปุ่น", "สไปเดอร์แมน"],
        ["คอมพิวเตอร์", "ป่าไม้", "แว่นตา", "ตู้เย็น", "โรงพยาบาล", "แฮร์รี่ พอตเตอร์"],
        ["รองเท้าแตะ", "ดาวอังคาร", "จักรยาน", "หมวก", "สถานีตำรวจ", "ลูฟี่"],
        ["ไอศกรีม", "ถ้ำ", "ปากกา", "พัดลม", "สวนสัตว์", "นารูโตะ"],
        ["เค้ก", "น้ำตก", "กุญแจ", "ทีวี", "ตลาดนัด", "เอลซ่า"],
        ["สุนัข", "ทะเลทราย", "ร่ม", "หม้อหุงข้าว", "วัด", "โคนัน"],
        ["แมว", "เกาะ", "แก้วน้ำ", "เครื่องซักผ้า", "สนามบิน", "มิกกี้เมาส์"]
    ],
    currentRoles: [],
    currentPlayerIndex: 0,
    playerCount: 0,
    timerInterval: null,

    // Elements
    homeScreen: document.getElementById('wd-homeScreen'),
    setupScreen: document.getElementById('wd-setupScreen'),
    revealScreen: document.getElementById('wd-revealScreen'),
    gameScreen: document.getElementById('wd-gameScreen'),
    ruleModal: document.getElementById('wd-ruleModal'),

    init() {
        // เรียกใช้ฟังก์ชันสร้างรายการครั้งแรก
        this.renderHomeRoles();
    },

    // [ใหม่] ฟังก์ชันสำหรับสร้างรายการบทบาทหน้าแรกโดยเฉพาะ
    renderHomeRoles() {
        const list = document.getElementById('wd-role-intro-list-home');
        // ถ้าหา element เจอ และข้างในยังว่างเปล่า ให้สร้างรายการ
        if(list && list.innerHTML.trim() === "") {
            let htmlContent = "";
            for (const [role, info] of Object.entries(this.rolesInfo)) {
                // กำหนดสีให้สวยงามตามทีม
                let colorStyle = "color: #eee;"; // สีขาวหม่น
                if (info.team === "หมาป่า") colorStyle = "color: #ff6b6b;"; // แดงอ่อน
                if (info.team === "คนบ้า") colorStyle = "color: #feca57;"; // ส้มอ่อน

                htmlContent += `
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 0; text-align: left;">
                        <span style="${colorStyle} font-weight: bold; font-size: 1.1rem;">${role}</span>
                        <div style="color: #aaa; font-size: 0.9rem; margin-top: 4px;">${info.desc}</div>
                    </div>`;
            }
            list.innerHTML = htmlContent;
        }
    },

    // Navigation
    goToSetup() {
        this.homeScreen.classList.add('hidden');
        this.setupScreen.classList.remove('hidden');
    },

    goBackToHome() {
        this.setupScreen.classList.add('hidden');
        this.homeScreen.classList.remove('hidden');
    },

    setupGame(count) {
        this.playerCount = count;
        this.currentRoles = [];
        if (count === 7) this.currentRoles = ["Mayor", "Werewolf", "Werewolf", "Seer", "Major", "Major", "Minion"];
        else if (count === 8) this.currentRoles = ["Mayor", "Werewolf", "Werewolf", "Seer", "Major", "Major", "Minion", "Beholder"];
        else if (count === 9) this.currentRoles = ["Mayor", "Werewolf", "Werewolf", "Seer", "Major", "Major", "Minion", "Beholder", "Apprentice Seer"];
        else if (count === 10) this.currentRoles = ["Mayor", "Werewolf", "Werewolf", "Seer", "Major", "Major", "Minion", "Beholder", "Apprentice Seer", "Hunchback"];
        
        shuffleArray(this.currentRoles);
        this.currentPlayerIndex = 0;
        
        this.setupScreen.classList.add('hidden');
        this.revealScreen.classList.remove('hidden');
        this.resetRevealScreen();
    },

    resetRevealScreen() {
        document.getElementById('wd-player-number').innerText = "1";
        document.getElementById('wd-card-area').style.display = "none";
        document.getElementById('wd-btn-show-role').style.display = "inline-block";
        document.getElementById('wd-btn-next-player').style.display = "none";
        document.getElementById('wd-btn-start-play').style.display = "none";
    },

    showRole() {
        const roleName = this.currentRoles[this.currentPlayerIndex];
        const roleData = this.rolesInfo[roleName];
        
        document.getElementById('wd-role-title').innerText = roleName;
        document.getElementById('wd-role-desc').innerText = roleData.desc;
        
        const titleEl = document.getElementById('wd-role-title');
        if(roleData.team === "หมาป่า") titleEl.style.color = "var(--danger-color)";
        else if(roleData.team === "คนบ้า") titleEl.style.color = "orange";
        else titleEl.style.color = "var(--secondary-color)";

        document.getElementById('wd-card-area').style.display = "block";
        document.getElementById('wd-btn-show-role').style.display = "none";

        if (this.currentPlayerIndex < this.playerCount - 1) {
            document.getElementById('wd-btn-next-player').style.display = "inline-block";
        } else {
            document.getElementById('wd-btn-start-play').style.display = "inline-block";
        }
    },

    nextPlayer() {
        this.currentPlayerIndex++;
        document.getElementById('wd-player-number').innerText = this.currentPlayerIndex + 1;
        document.getElementById('wd-card-area').style.display = "none";
        document.getElementById('wd-btn-show-role').style.display = "inline-block";
        document.getElementById('wd-btn-next-player').style.display = "none";
    },

    startGamePlay() {
        this.revealScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.refreshWords();
        document.getElementById('wd-word-table-area').style.display = "none";
        document.getElementById('wd-timer').innerText = "00:00";
    },

    toggleTable() {
        const area = document.getElementById('wd-word-table-area');
        area.style.display = (area.style.display === "none") ? "block" : "none";
    },

    refreshWords() {
        const randomSet = this.wordCategories[Math.floor(Math.random() * this.wordCategories.length)];
        const tbody = document.getElementById('wd-word-table-body');
        tbody.innerHTML = "";
        randomSet.forEach((word, index) => {
            tbody.innerHTML += `<tr>
                <td class="dice-col">${index + 1}</td>
                <td>${word}</td>
            </tr>`;
        });
    },

    startTimer(min) {
        this.stopTimer();
        let time = min * 60;
        const display = document.getElementById('wd-timer');
        const update = () => {
            let m = Math.floor(time/60);
            let s = time%60;
            display.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        };
        update();
        this.timerInterval = setInterval(() => {
            time--;
            update();
            if(time <= 0) {
                this.stopTimer();
                alert("หมดเวลา!");
            }
        }, 1000);
    },

    stopTimer() {
        if(this.timerInterval) clearInterval(this.timerInterval);
    },

    resetGame() {
        this.stopTimer();
        this.gameScreen.classList.add('hidden');
        this.setupScreen.classList.add('hidden');
        this.homeScreen.classList.remove('hidden');
        App.showScreen('hub');
    },

    openRules() { this.ruleModal.style.display = "block"; },
    closeRules() { this.ruleModal.style.display = "none"; }
};

/* =============================================
   APP CONTROLLER (MAIN)
   ============================================= */
const App = {
    hubScreen: document.getElementById('hubScreen'),
    wwContainer: document.getElementById('werewolfGameContainer'),
    sfContainer: document.getElementById('spyfallGameContainer'),
    wdContainer: document.getElementById('werewordsGameContainer'),

    showScreen(screenName) {
        // 1. Hide All Containers
        const allScreens = [this.hubScreen, this.wwContainer, this.sfContainer, this.wdContainer];
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        // 2. Show Selected Container
        if (screenName === 'hub') {
            this.hubScreen.classList.remove('hidden');
            this.hubScreen.classList.add('active');
        } 
        else if (screenName === 'werewolf') {
            WerewolfGame.resetGame();
            this.wwContainer.classList.remove('hidden');
            this.wwContainer.classList.add('active');
        }
        else if (screenName === 'spyfall') {
            SpyfallGame.resetGame();
            this.sfContainer.classList.remove('hidden');
            this.sfContainer.classList.add('active');
        }
                else if (screenName === 'werewords') {
            this.wdContainer.classList.remove('hidden');
            this.wdContainer.classList.add('active');
            
            // ตั้งค่าให้แสดงหน้า Home ก่อน
            WerewordsGame.homeScreen.classList.remove('hidden');
            WerewordsGame.setupScreen.classList.add('hidden');
            WerewordsGame.gameScreen.classList.add('hidden');
            
            // [สำคัญ] บังคับให้สร้างรายการบทบาททุกครั้งที่กดเข้ามาหน้านี้ เพื่อแก้ปัญหาจอดำ
            WerewordsGame.renderHomeRoles(); 
        }

    },

    init() {
        // Navigation Buttons (Hub)
        document.getElementById('gotoWerewolfBtn').addEventListener('click', () => this.showScreen('werewolf'));
        document.getElementById('gotoSpyfallBtn').addEventListener('click', () => this.showScreen('spyfall'));
        document.getElementById('gotoWerewordsBtn').addEventListener('click', () => this.showScreen('werewords'));
        
        // Back Buttons
        document.getElementById('ww-backToHubBtn').addEventListener('click', () => this.showScreen('hub'));
        document.getElementById('sf-backToHubBtn').addEventListener('click', () => this.showScreen('hub'));
        document.getElementById('wd-backToHubBtn').addEventListener('click', () => this.showScreen('hub'));

        // Init Sub-Games
        WerewolfGame.init(); // รันเพื่อสร้าง List หน้าแรก
        SpyfallGame.init();
        
        // Close Modal Event (Werewords Rules)
        window.onclick = function(event) {
            if (event.target == document.getElementById('wd-ruleModal')) {
                WerewordsGame.closeRules();
            }
        }
    }
};

// Start App
App.init();

