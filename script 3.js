
const sentence = document.getElementById("sentence");
const answer = document.getElementById("answer");
const result = document.getElementById("result");
const playerName = document.getElementById("playerName");

const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOver = document.getElementById("gameOver");

let level = "basic"; // basic, intermediate, advanced
let score = 0;
let questionStartTime = Date.now();

let time = 60; 
let timer;
let best = 0;

const savedName = localStorage.getItem("playerName");
if(savedName && playerName){
    playerName.value = savedName;
}

// 📚 단어 데이터 세트
const words = {
    basic:{
        1:[
            { ar:"أب", ko:"아버지" }, { ar:"أم", ko:"어머니" }, { ar:"أخ", ko:"형제" }, { ar:"أخت", ko:"자매" },
            { ar:"بيت", ko:"집" }, { ar:"باب", ko:"문" }, { ar:"قلم", ko:"펜" }, { ar:"كتاب", ko:"책" },
            { ar:"ماء", ko:"물" }, { ar:"مرحبًا", ko:"안녕하세요" }, {ar:"عين",ko:"눈"}, {ar:"يد",ko:"손"},
            {ar:"قدم",ko:"발"}, {ar:"أذن",ko:"귀"}, {ar:"فم",ko:"입"}, {ar:"قلب",ko:"심장"},
            {ar:"قمر",ko:"달"}, {ar:"شمس",ko:"태양"}, {ar:"نهر",ko:"강"}, {ar:"بحر",ko:"바다"}
        ],
        2:[
            {ar:"سيارة",ko:"자동차"}, {ar:"مدرسة",ko:"학교"}, {ar:"جامعة",ko:"대학교"}, {ar:"طبيب",ko:"의사"},
            {ar:"مستشفى",ko:"병원"}, {ar:"نافذة",ko:"창문"}, {ar:"كرسي",ko:"의자"}, {ar:"طاولة",ko:"탁자"},
            {ar:"هاتف",ko:"휴대전화"}, {ar:"مطار",ko:"공항"}, {ar:"طعام",ko:"음식"}, {ar:"شراب",ko:"음료"},
            {ar:"صديق",ko:"친구"}, {ar:"عائلة",ko:"가족"}, {ar:"رسالة",ko:"편지"}, {ar:"حديقة",ko:"정원"},
            {ar:"ملابس",ko:"옷"}, {ar:"مفتاح",ko:"열쇠"}, {ar:"ساعة",ko:"시계"}, {ar:"حديقة",ko:"공원"}
        ],
        3:[
            {ar:"مدرسة",ko:"학교"}, {ar:"جامعة",ko:"대학교"}, {ar:"مستشفى",ko:"병원"}, {ar:"سيارة",ko:"자동차"},
            {ar:"طائرة",ko:"비행기"}, {ar:"حديقة",ko:"공원"}, {ar:"مدينة",ko:"도시"}, {ar:"قرية",ko:"마을"},
            {ar:"مكتبة",ko:"도서관"}, {ar:"حقيبة",ko:"가방"}, {ar:"نافذة",ko:"창문"}, {ar:"طاولة",ko:"탁자"},
            {ar:"كرسي",ko:"의자"}, {ar:"هاتف",ko:"전화기"}, {ar:"مطبخ",ko:"부엌"}, {ar:"غرفة",ko:"방"},
            {ar:"دراجة",ko:"자전거"}, {ar:"مكتب",ko:"사무실"}, {ar:"مطعم",ko:"식당"}, {ar:"فندق",ko:"호텔"},
            {ar:"شارع",ko:"거리"}, {ar:"مسجد",ko:"موسك"}, {ar:"كنيسة",ko:"교회"}, {ar:"صندوق",ko:"상자"},
            {ar:"حدود",ko:"국경"}, {ar:"قهوة",ko:"커피"}, {ar:"شجرة",ko:"나무"}, {ar:"طعام",ko:"음식"}, {ar:"سوق",ko:"시장"}
        ],  
        4:[
            {ar:"صباح الخير",ko:"좋은 아침"}, {ar:"مساء الخير",ko:"좋은 저녁"}, {ar:"إلى اللقاء",ko:"안녕히 가세요"},
            {ar:"شكرًا",ko:"감사합니다"}, {ar:"عفوًا",ko:"천만에요"}, {ar:"من فضلك",ko:"부탁합니다"},
            {ar:"آسف",ko:"죄송합니다"}, {ar:"نعم",ko:"네"}, {ar:"لا",ko:"아니요"}, {ar:"ثلاجة",ko:"냉장고"},
            {ar:"حاسوب",ko:"컴퓨터"}, {ar:"نافذة",ko:"창문"}, {ar:"مساعدة",ko:"도움"}, {ar:"استراحة",ko:"휴식"},
            {ar:"معلومات",ko:"정보"}, {ar:"احتياجات",ko:"필요한 것들"}, {ar:"برمجة",ko:"프로그래밍"},
            {ar:"اقتصاد",ko:"경제"}, {ar:"جيد",ko:"좋습니다"}
        ],
        5:[
            {ar:"كِتَابٌ",ko:"책"}, {ar:"قَلَمٌ",ko:"펜"}, {ar:"بَيْتٌ",ko:"집"}, {ar:"مَاءٌ",ko:"물"},
            {ar:"بَابٌ",ko:"문"}, {ar:"وَلَدٌ",ko:"소년"}, {ar:"بِنْتٌ",ko:"소녀"}, {ar:"رَجُلٌ",ko:"남자"},
            {ar:"اِمْرَأَةٌ",ko:"여자"}, {ar:"مُعَلِّمٌ",ko:"선생님"}, {ar:"طَالِبٌ",ko:"학생"}, {ar:"مَدْرَسَةٌ",ko:"학교"},
            {ar:"جَامِعَةٌ",ko:"대학교"}, {ar:"سَيَّارَةٌ",ko:"자동차"}, {ar:"مُسْتَشْفًى",ko:"병원"}, {ar:"شَجَرَةٌ",ko:"나무"},
            {ar:"زَهْرَةٌ",ko:"꽃"}, {ar:"قَهْوَةٌ",ko:"커피"}, {ar:"غُرْفَةٌ",ko:"방"}, {ar:"حَقِيبَةٌ",ko:"가방"}
        ]
    },
    intermediate:{
        1:[
            {ar:"صَبَاحُ الْخَيْرِ",ko:"좋은 아침"}, {ar:"مَسَاءُ الْخَيْرِ",ko:"좋은 저녁"}, {ar:"أَهْلًا وَسَهْلًا",ko:"환영합니다"},
            {ar:"مَرْحَبًا بِكَ",ko:"환영합니다(남성)"}, {ar:"مَرْحَبًا بِكِ",ko:"환영합니다(여성)"}, {ar:"شُكْرًا لَكَ",ko:"고마워요(남성에게)"},
            {ar:"شُكْرًا لَكِ",ko:"고마워요(여성에게)"}, {ar:"عَفْوًا لَكَ",ko:"천만에요(남성에게)"}, {ar:"عَفْوًا لَكِ",ko:"천만에요(여성에게)"},
            {ar:"إِلَى اللِّقَاءِ",ko:"다음에 만나요"}, {ar:"صَبَاحًا سَعِيدًا",ko:"행복한 아침"}, {ar:"مَسَاءً سَعِيدًا",ko:"행복한 저녁"},
            {ar:"حَيَّاكَ اللَّهُ",ko:"환영합니다(남성)"}, {ar:"حَيَّاكِ اللَّهُ",ko:"환영합니다(여성)"}, {ar:"بِكُلِّ سُرُورٍ",ko:"기쁜 마음으로"},
            {ar:"كُلُّ شَيْءٍ",ko:"모든 것"}, {ar:"يَوْمٌ جَمِيلٌ",ko:"아름다운 하루"}, {ar:"وَقْتٌ طَيِّبٌ",ko:"좋은 시간"},
            {ar:"أَلْفُ شُكْرٍ",ko:"정말 감사합니다"}, {ar:"مَعَ السَّلَامَةِ",ko:"안녕히 가세요"}
        ],
        2:[
            {ar:"أَنَا بِخَيْرٍ",ko:"저는 잘 지냅니다"}, {ar:"كَيْفَ حَالُكَ",ko:"잘 지내세요?"}, {ar:"شُكْرًا لَكَ",ko:"고마워요"},
            {ar:"مِنْ فَضْلِكَ",ko:"부탁합니다"}, {ar:"إِلَى غَدٍ",ko:"내일 봐요"}, {ar:"لَا بَأْسَ",ko:"괜찮습니다"},
            {ar:"صَبْرٌ جَمِيلٌ",ko:"آ름다운 인내"}, {ar:"بِكُلِّ سُرُورٍ",ko:"기쁜 마음으로"}, {ar:"أَلْفُ شُكْرٍ",ko:"정말 감사합니다"},
            {ar:"نَعَمْ أَعْرِفُ",ko:"네, 압니다"}, {ar:"لَا أَعْرِفُ",ko:"모르겠습니다"}, {ar:"أَنَا جَاهِزٌ",ko:"준비되었습니다"},
            {ar:"أَنَا مَشْغُولٌ",ko:"저는 바쁩니다"}, {ar:"هَذَا جَمِيلٌ",ko:"이것은 아름답습니다"}, {ar:"ذَلِكَ صَحِيحٌ",ko:"그것은 맞습니다"},
            {ar:"أُحِبُّهُ كَثِيرًا",ko:"정말 좋아합니다"}, {ar:"لَا مُشْكِلَةَ",ko:"문제없습니다"}, {ar:"هَيَّا بِنَا",ko:"갑시다"},
            {ar:"أَحْسَنْتَ جِدًّا",ko:"아주 잘했습니다"}, {ar:"بِإِذْنِ اللَّهِ",ko:"신의 뜻이라면"}
        ],
        3:[
            {ar:"أنا هنا",ko:"저는 여기 있습니다"}, {ar:"هو هنا",ko:"그는 여기 있습니다"}, {ar:"هي هنا",ko:"그녀는 여기 있습니다"},
            {ar:"أنا طالب",ko:"저는 학생입니다"}, {ar:"أنا سعيد",ko:"저는 행복합니다"}, {ar:"هو طبيب",ko:"그는 의사입니다"},
            {ar:"هي معلمة",ko:"그녀는 선생님입니다"}, {ar:"هذا قلمي",ko:"이것은 제 펜입니다"}, {ar:"هذا بيتي",ko:"이것은 제 집입니다"},
            {ar:"أين بابك",ko:"당신의 문은 어디입니까?"}, {ar:"هذا أخي",ko:"이 사람은 제 형제입니다"}, {ar:"هذه أمي",ko:"이 사람은 제 어머니입니다"},
            {ar:"ذلك بيتي",ko:"저것은 제 집입니다"}, {ar:"أنا وحدي",ko:"저는 혼자입니다"}, {ar:"هو معي",ko:"그는 저와 함께 있습니다"},
            {ar:"هي معي",ko:"غ녀는 저와 함께 있습니다"}, {ar:"هذا جيد",ko:"좋습니다"}, {ar:"ذلك جميل",ko:"저것은 아름답습니다"},
            {ar:"أنا جاهز",ko:"준비되었습니다"}, {ar:"كل شيء",ko:"모든 것"}
        ],
        4:[
            {ar:"أنا أحب القهوة",ko:"저는 커피를 좋아합니다"}, {ar:"أنا أحب الشاي",ko:"저는 차를 좋아합니다"},
            {ar:"هذا بيت جميل",ko:"이것은 아름다운 집입니다"}, {ar:"هذا كتاب جديد",ko:"이것은 새 책입니다"},
            {ar:"هذا قلم جديد",ko:"이것은 새 펜입니다"}, {ar:"اليوم جو جميل",ko:"오늘 날씨가 좋습니다"},
            {ar:"أريد هذا الكتاب",ko:"이 책을 원합니다"}, {ar:"أريد كوب ماء",ko:"물 한 잔 주세요"},
            {ar:"هو طالب جيد",ko:"그는 좋은 학생입니다"}, {ar:"هي بنت ذكية",ko:"그녀는 똑똑한 소녀입니다"},
            {ar:"القهوة ساخنة جدا",ko:"커피가 매우 뜨겁습니다"}, {ar:"الماء بارد جدا",ko:"물이 매우 차갑습니다"},
            {ar:"هذا طريق طويل",ko:"이 길은 깁니다"}, {ar:"أنا داخل البيت",ko:"저는 집 안에 있습니다"},
            {ar:"هو أمام الباب",ko:"그는 문 앞에 있습니다"}, {ar:"هي في البيت",ko:"그녀는 집에 있습니다"},
            {ar:"أحب قراءة الكتب",ko:"저는 책 읽기를 좋아합니다"}, {ar:"أنا أشرب الماء",ko:"저는 물을 마십니다"},
            {ar:"هو يكتب الآن",ko:"그는 지금 씁니다"}, {ar:"أنا في سيول",ko:"저는 서울에 있습니다"}
        ],
        5:[
            {ar:"أَنَا بِخَيْرٍ",ko:"저는 잘 지냅니다"}, {ar:"هَلْ أَنْتَ؟",ko:"당신은요?"}, {ar:"هَذَا جَمِيلٌ",ko:"이것은 아름답습니다"},
            {ar:"ذَلِكَ صَحِيحٌ",ko:"그것은 맞습니다"}, {ar:"لَا مُشْكِلَةَ",ko:"문제없습니다"}, {ar:"أَنَا جَاهِزٌ",ko:"준비되었습니다"},
            {ar:"أَنَا مَشْغُولٌ",ko:"저는 바쁩니다"}, {ar:"أُحِبُّهُ جِدًّا",ko:"정말 좋아합니다"}, {ar:"هَيَّا بِنَا",ko:"갑시다"},
            {ar:"كُلُّ شَيْءٍ",ko:"모든 것"}, {ar:"هَذَا بَيْتِي",ko:"이것은 제 집입니다"}, {ar:"تِلْكَ سَيَّارَةٌ",ko:"저것은 자동차입니다"},
            {ar:"أَيْنَ كِتَابِي؟",ko:"제 책은 어디 있나요?"}, {ar:"أُرِيدُ مَاءً",ko:"물을 원합니다"}, {ar:"شُكْرًا جَزِيلًا",ko:"정말 감사합니다"},
            {ar:"أَهْلًا بِكَ",ko:"환영합니다"}, {ar:"مَعَ السَّلَامَةِ",ko:"안녕히 가세요"}, {ar:"إِلَى غَدٍ",ko:"내일 봐요"},
            {ar:"بِكُلِّ سُرُورٍ",ko:"기쁜 마음으로"}, {ar:"أَلْفُ شُكْرٍ",ko:"정말 감사합니다"}
        ]
    },
    advanced:{
        1:[
            {ar:"أنا أحب اللغة العربية",ko:"저는 아랍어를 좋아합니다"}, {ar:"هو يذهب إلى المدرسة",ko:"그는 학교에 갑니다"},
            {ar:"هي تقرأ كتابا جديدا",ko:"그녀는 새 책을 읽습니다"}, {ar:"نحن ندرس كل يوم",ko:"우리는 매일 공부합니다"},
            {ar:"أين تقع الجامعة",ko:"대학교는 어디에 있나요?"}, {ar:"أريد شراء سيارة",ko:"자동차를 사고 싶습니다"},
            {ar:"الجو جميل اليوم",ko:"오늘 날씨가 좋습니다"}, {ar:"القهوة ساخنة جدا",ko:"커피가 매우 뜨겁습니다"},
            {ar:"الماء بارد جدا",ko:"물이 매우 차갑습니다"}, {ar:"أخي يعمل هنا",ko:"형은 여기서 일합니다"},
            {ar:"أختي تدرس الطب",ko:"여동생은 의학을 공부합니다"}, {ar:"هذا الطريق طويل",ko:"이 길은 깁니다"},
            {ar:"ذلك المنزل كبير",ko:"저 집은 큽니다"}, {ar:"أعيش في سيول",ko:"저는 서울에 삽니다"},
            {ar:"هو يحب السفر",ko:"그는 여행을 좋아합니다"}, {ar:"هي تكتب بسرعة",ko:"그녀는 빨리 씁니다"},
            {ar:"أفتح الباب الآن",ko:"지금 문을 엽니다"}, {ar:"أغلق النافذة",ko:"창문을 닫습니다"},
            {ar:"الدرس سهل جدا",ko:"수업이 매우 쉽습니다"}, {ar:"الوقت يمر بسرعة",ko:"시간이 빨리 갑니다"}
        ]
    }
};

let currentWord = null;
let remainingWords = [];
let currentStage = 1;
let solvedCount = 0;
let totalQuestions = 10;

function startGame(){
    if(playerName.value.trim()===""){
        alert("이름을 입력해주세요!");
        return;
    }
    localStorage.setItem("playerName", playerName.value);
    startScreen.style.display="none";
    menuScreen.style.display="block";
}

function selectLevel(lv){
    level = lv;
    currentStage = 1;
    solvedCount = 0;
    score = 0;
    scoreEl.textContent = score;

    if(level === "basic") totalQuestions = 10;
    else if(level === "intermediate") totalQuestions = 20;
    else totalQuestions = 30;

    remainingWords = [];
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";

    best = localStorage.getItem(`bestScore_${level}`) || 0;
    if(document.getElementById("best")) {
        document.getElementById("best").textContent = best;
    }

    newSentence();
    resetTimer();
}

function backToMenu(){
    clearInterval(timer);
    gameScreen.style.display = "none";
    gameOver.style.display = "none";
    menuScreen.style.display = "block";
}

function goToStartScreen(){
    menuScreen.style.display = "none";
    startScreen.style.display = "block";
}

function setTheme(t){
    document.body.className = t;
}

function newSentence(){
    let stageData = words[level][currentStage];
    if(!stageData) {
        stageData = words[level][1];
        currentStage = 1;
    }

    if(remainingWords.length===0){
        remainingWords=[...stageData];
    }
    const randomIndex=Math.floor(Math.random()*remainingWords.length);
    currentWord=remainingWords[randomIndex];
    remainingWords.splice(randomIndex,1);

    sentence.innerHTML = [...currentWord.ar]
    .map(char => `<span class="char">${char}</span>`)
    .join("");

    document.getElementById("meaning").textContent = currentWord.ko;
    answer.value = "";
    document.getElementById("questionInfo").textContent = `문제 ${solvedCount+1} / ${totalQuestions}`;
    questionStartTime = Date.now();
}

function resetTimer(){
    clearInterval(timer);
    if(level === "basic") time = 60;
    else if(level === "intermediate") time = 40;
    else time = 20;

    timeEl.textContent = time;

    timer = setInterval(()=>{
        time--;
        timeEl.textContent = time;
        if(time <= 0) endGameProcess();
    },1000);
}

answer.addEventListener("input", () => {
    const value = answer.value;
    const chars = document.querySelectorAll(".char");

    chars.forEach((char, i) => {
        if (!value[i]) {
            char.classList.remove("correct", "incorrect");
            return;
        }
        if (value[i] === char.textContent) {
            char.classList.add("correct");
            char.classList.remove("incorrect");
        } else {
            char.classList.add("incorrect");
            char.classList.remove("correct");
        }
    });

    if (value === currentWord.ar) {
        score += calculateLevelScore();
        scoreEl.textContent = score;
        solvedCount++;

        if (solvedCount >= totalQuestions) {
            endGameProcess();
        } else {
            newSentence();
            resetTimer();
        }
    }
});

function calculateLevelScore() {
    const sec = (Date.now() - questionStartTime) / 1000;

    // 초급 기준: 5초 내 15점 / 20초 내 10점 / 그 외 5점
    let baseScore = 5;
    if (sec <= 5) baseScore = 15;
    else if (sec <= 20) baseScore = 10;

    if (level === "intermediate") {
        return baseScore + 5;  // 중급은 전부 +5점
    } else if (level === "advanced") {
        return baseScore + 10; // 고급은 전부 +10점
    }

    return baseScore;
}

function endGameProcess(){
    clearInterval(timer);
    gameScreen.style.display = "none";
    gameOver.style.display = "block";
    document.getElementById("finalScore").textContent = score;

    if(score > best){
        best = score;
        localStorage.setItem(`bestScore_${level}`, best);
    }

    saveRanking(playerName.value || "Anonymous", score, level);

    if(solvedCount >= totalQuestions && currentStage < 5 && level === "basic"){
        document.getElementById("resultTitle").textContent = `Level ${currentStage} Complete!`;
        document.getElementById("continueBtn").style.display = "inline-block";
    } else {
        document.getElementById("resultTitle").textContent = `종료 (최종 점수)`;
        document.getElementById("continueBtn").style.display = "none";
    }
}

function nextStage(){
    currentStage++;
    solvedCount = 0;
    remainingWords = [];
    gameOver.style.display = "none";
    gameScreen.style.display = "block";
    newSentence();
    resetTimer();
}

// 💡 [수정] 랭킹을 최대 20위까지 저장하도록 변경
function saveRanking(name, score, currentLevel) {
    checkWeeklyReset(); // 저장하기 전 주간 리셋 체크

    let rankData = JSON.parse(localStorage.getItem(`rankings_${currentLevel}`)) || [];
    const existingPlayerIndex = rankData.findIndex(player => player.name === name);
    
    if (existingPlayerIndex !== -1) {
        if (score > rankData[existingPlayerIndex].score) {
            rankData[existingPlayerIndex].score = score;
            rankData[existingPlayerIndex].date = new Date().toLocaleDateString();
        }
    } else {
        rankData.push({ name: name, score: score, date: new Date().toLocaleDateString() });
    }
    
    rankData.sort((a, b) => b.score - a.score);
    rankData = rankData.slice(0, 20); // 💡 기존 10에서 20위로 확장
    localStorage.setItem(`rankings_${currentLevel}`, JSON.stringify(rankData));
}

function toggleRankingModal() {
    const modal = document.getElementById("rankingModal");
    if(modal.style.display === "none") {
        modal.style.display = "flex";
        showRankList(level);
    } else {
        modal.style.display = "none";
    }
}

// 💡 [수정] 1, 2, 3위 메달 전용 템플릿 처리 및 20위 출력 지원
function showRankList(targetLevel) {
    checkWeeklyReset(); // 열람하기 전 주간 리셋 체크

    document.querySelectorAll(".rank-tab").forEach(tab => tab.classList.remove("active-tab"));
    document.getElementById(`tab-${targetLevel}`).classList.add("active-tab");

    const listArea = document.getElementById("rankingListArea");
    const rankData = JSON.parse(localStorage.getItem(`rankings_${targetLevel}`)) || [];

    if(rankData.length === 0) {
        listArea.innerHTML = `<p style="text-align:center; color:#999; margin-top:50px;">등록된 랭킹 정보가 없습니다.</p>`;
        return;
    }

    listArea.innerHTML = rankData.map((player, index) => {
        let rankBadge = "";
        const rankNum = index + 1;

        // 1, 2, 3위 메달 분기 처리
        if (rankNum === 1) rankBadge = `🥇 ${player.name}`;
        else if (rankNum === 2) rankBadge = `🥈 ${player.name}`;
        else if (rankNum === 3) rankBadge = `🥉 ${player.name}`;
        else rankBadge = `<span class="rank-number">${rankNum}위</span> <span class="rank-name">${player.name}</span>`;

        return `
            <div class="rank-item">
                <div>
                    ${rankBadge}
                </div>
                <span class="rank-score">${player.score}점</span>
            </div>
        `;
    }).join("");
}

// 💡 [신규 기능] 일주일(7일) 마다 랭킹 자동 초기화 시스템 구현
function checkWeeklyReset() {
    const lastReset = localStorage.getItem("lastRankingResetDate");
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000; // 7일을 밀리초로 환산

    if (!lastReset) {
        // 처음 실행하는 경우 오늘 날짜를 기준일로 세팅
        localStorage.setItem("lastRankingResetDate", now);
    } else if (now - parseInt(lastReset) >= oneWeekMs) {
        // 마지막 리셋으로부터 7일 이상 지났을 때 모든 난이도 랭킹 삭제
        localStorage.removeItem("rankings_basic");
        localStorage.removeItem("rankings_intermediate");
        localStorage.removeItem("rankings_advanced");
        
        // 내 개인 베스트 스코어들도 같이 리셋하려면 아래 주석을 풀어주세요
        // localStorage.removeItem("bestScore_basic");
        // localStorage.removeItem("bestScore_intermediate");
        // localStorage.removeItem("bestScore_advanced");

        // 새로운 리셋 기준 시간 갱신
        localStorage.setItem("lastRankingResetDate", now);
        console.log("주간 랭킹 데이터가 성공적으로 리셋되었습니다.");
    }
}

function toggleInfoModal() {
    const infoModal = document.getElementById("infoModal");
    if(infoModal.style.display === "none") {
        infoModal.style.display = "flex";
    } else {
        infoModal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkWeeklyReset(); // 앱 구동 시 주간 리셋 체크
    const startBtn = document.getElementById("startBtn");
    if(startBtn) startBtn.addEventListener("click", startGame);
});
