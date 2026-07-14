/* ==========================================================
                CRIMELENS
      AI DETECTIVE INVESTIGATION SYSTEM
              SCRIPT.JS - PART 1
========================================================== */

/* ==========================================================
                    DOM ELEMENTS
========================================================== */

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");

const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");

const detectiveNameInput = document.getElementById("detectiveName");
const badgeNumberInput = document.getElementById("badgeNumber");

const detectiveDisplay = document.getElementById("detectiveDisplay");

const scoreDisplay = document.getElementById("score");
const clueCountDisplay = document.getElementById("clueCount");
const timerDisplay = document.getElementById("timer");
const progressLabel = document.getElementById("progressLabel");

const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");

/* ==========================================================
                    GAME VARIABLES
========================================================== */

let score = 0;

let cluesFound = 0;

let timerMinutes = 10;

let timerSeconds = 0;

let gameStarted = false;

let investigationFinished = false;

let timerInterval = null;

let currentTheme = "dark";

/* ==========================================================
                    LOADER
========================================================== */

const loadingMessages = [

    "Initializing Investigation...",

    "Loading Crime Database...",

    "Scanning CCTV Records...",

    "Collecting Evidence...",

    "Preparing Detective Dashboard...",

    "Connecting Secure Server...",

    "Mission Ready..."

];

let loadingIndex = 0;

const loadingAnimation = setInterval(() => {

    loaderText.textContent = loadingMessages[loadingIndex];

    loadingIndex++;

    if (loadingIndex >= loadingMessages.length) {

        loadingIndex = 0;

    }

}, 450);

window.addEventListener("load", () => {

    setTimeout(() => {

        clearInterval(loadingAnimation);

        loader.style.opacity = "0";

        loader.style.pointerEvents = "none";

        setTimeout(() => {

            loader.style.display = "none";

        }, 600);

    }, 3500);

});

/* ==========================================================
                    TOAST
========================================================== */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2500);

}

/* ==========================================================
                    LOGIN
========================================================== */

function saveDetective(){

    const detective = detectiveNameInput.value.trim();

    const badge = badgeNumberInput.value.trim();

    if(detective === ""){

        showToast("Enter Detective Name");

        return;

    }

    if(badge === ""){

        showToast("Enter Badge Number");

        return;

    }

    localStorage.setItem("detectiveName", detective);

    localStorage.setItem("badgeNumber", badge);

    detectiveDisplay.textContent = detective;

    loginModal.style.display = "none";

    gameStarted = true;

    startTimer();

    showToast("Welcome Detective " + detective);

}

loginBtn.addEventListener("click", saveDetective);

/* ==========================================================
                LOAD SAVED DETECTIVE
========================================================== */

window.addEventListener("DOMContentLoaded",()=>{

    const savedName = localStorage.getItem("detectiveName");

    const savedBadge = localStorage.getItem("badgeNumber");

    if(savedName && savedBadge){

        detectiveDisplay.textContent = savedName;

        detectiveNameInput.value = savedName;

        badgeNumberInput.value = savedBadge;

        loginModal.style.display = "none";

        gameStarted = true;

        startTimer();

    }

});

/* ==========================================================
                    SCORE
========================================================== */

function addScore(points){

    score += points;

    scoreDisplay.textContent = score;

    localStorage.setItem("score",score);

}

function loadScore(){

    const savedScore =

    Number(localStorage.getItem("score"));

    if(savedScore){

        score = savedScore;

        scoreDisplay.textContent = score;

    }

}

loadScore();

/* ==========================================================
                    CLUES
========================================================== */

function addClue(){

    cluesFound++;

    clueCountDisplay.textContent =

    cluesFound + " / 6";

    progressLabel.textContent =

    Math.floor(

    cluesFound/6*100

    ) + "%";

}

/* ==========================================================
                    TIMER
========================================================== */

function updateTimer(){

    const m =

    String(timerMinutes).padStart(2,"0");

    const s =

    String(timerSeconds).padStart(2,"0");

    timerDisplay.textContent =

    `${m}:${s}`;

}

function startTimer(){

    if(timerInterval) return;

    timerInterval = setInterval(()=>{

        if(investigationFinished){

            clearInterval(timerInterval);

            return;

        }

        if(timerSeconds===0){

            if(timerMinutes===0){

                clearInterval(timerInterval);

                timerDisplay.textContent="TIME UP";

                timerDisplay.style.color="#ff4d6d";

                showToast("Mission Failed!");

                investigationFinished=true;

                return;

            }

            timerMinutes--;

            timerSeconds=59;

        }

        else{

            timerSeconds--;

        }

        updateTimer();

    },1000);

}

/* ==========================================================
                    THEME
========================================================== */

themeBtn.addEventListener("click",()=>{

    if(currentTheme==="dark"){

        document.documentElement.style.setProperty(

        "--dark","#f3f7ff"

        );

        document.documentElement.style.setProperty(

        "--card","#ffffff"

        );

        document.documentElement.style.setProperty(

        "--card2","#eef3fb"

        );

        document.documentElement.style.setProperty(

        "--text","#111"

        );

        document.body.style.background=

        "#eef4fb";

        themeBtn.innerHTML=

        '<i class="fa-solid fa-sun"></i>';

        currentTheme="light";

    }

    else{

        document.documentElement.style.setProperty(

        "--dark","#07111f"

        );

        document.documentElement.style.setProperty(

        "--card","#121D31"

        );

        document.documentElement.style.setProperty(

        "--card2","#1A2943"

        );

        document.documentElement.style.setProperty(

        "--text","#ffffff"

        );

        document.body.style.background=

        "linear-gradient(180deg,#07111f,#09182d,#07111f)";

        themeBtn.innerHTML=

        '<i class="fa-solid fa-moon"></i>';

        currentTheme="dark";

    }

});

/* ==========================================================
                INTRO MODAL
========================================================== */

const introBtn = document.getElementById("introBtn");

const introModal = document.getElementById("introModal");

const closeIntro = document.getElementById("closeIntro");

introBtn.addEventListener("click",()=>{

    introModal.style.display="flex";

});

closeIntro.addEventListener("click",()=>{

    introModal.style.display="none";

});

window.addEventListener("click",(e)=>{

    if(e.target===introModal){

        introModal.style.display="none";

    }

});

/* ==========================================================
            START MISSION BUTTON
========================================================== */

const startMission =

document.getElementById("startMission");

startMission.addEventListener("click",()=>{

    document

    .getElementById("locations")

    .scrollIntoView({

        behavior:"smooth"

    });

    showToast(

    "Mission Started"

    );

});
/* ==========================================================
                SCRIPT.JS - PART 2A
          FETCH CLUES + INVESTIGATION SYSTEM
========================================================== */

let clues = [];

const evidenceBoard = document.getElementById("evidenceBoard");
const notebook = document.getElementById("notebook");
const progressFill = document.getElementById("progressFill");

const investigateButtons =
document.querySelectorAll(".investigateBtn");

const investigatedLocations = new Set();

/* ==========================================================
                    LOAD CLUES
========================================================== */

async function loadClues(){

    try{

        const response = await fetch("clues.json");

        if(!response.ok){

            throw new Error("Unable to load clues.");

        }

        clues = await response.json();

        console.log("Clues Loaded", clues);

    }

    catch(error){

        console.error(error);

        showToast("Unable to load clues.json");

    }

}

loadClues();

/* ==========================================================
                PROGRESS UPDATE
========================================================== */

function updateProgress(){

    const percent = Math.floor(

        (cluesFound / 6) * 100

    );

    progressFill.style.width = percent + "%";

    progressLabel.textContent = percent + "%";

}

/* ==========================================================
                ADD EVIDENCE
========================================================== */

function addEvidence(location, clue){

    const empty =
    evidenceBoard.querySelector(".empty");

    if(empty){

        empty.remove();

    }

    const card =
    document.createElement("div");

    card.className = "evidence";

    card.innerHTML = `

        <h4>${location}</h4>

        <p>${clue}</p>

    `;

    evidenceBoard.appendChild(card);

}

/* ==========================================================
                ADD NOTEBOOK ENTRY
========================================================== */

function addNotebook(location){

    const empty =
    notebook.querySelector(".empty");

    if(empty){

        empty.remove();

    }

    const note =
    document.createElement("div");

    note.className = "note";

    note.innerHTML = `

        <h4>${location}</h4>

        <p>

        Location investigated successfully.

        Detective observation recorded.

        </p>

    `;

    notebook.appendChild(note);

}

/* ==========================================================
            SAVE INVESTIGATION
========================================================== */

function saveProgress(){

    localStorage.setItem(

        "investigated",

        JSON.stringify(

            [...investigatedLocations]

        )

    );

}

/* ==========================================================
            RESTORE INVESTIGATION
========================================================== */

function restoreProgress(){

    const saved =

    JSON.parse(

        localStorage.getItem(

            "investigated"

        )

    ) || [];

    saved.forEach(id=>{

        investigatedLocations.add(id);

    });

}

restoreProgress();

/* ==========================================================
            INVESTIGATE LOCATION
========================================================== */

investigateButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const card =
        button.closest(".location-card");

        const id =
        Number(card.dataset.id);

        if(

            investigatedLocations.has(id)

        ){

            showToast(

                "Already Investigated"

            );

            return;

        }

        const clue = clues.find(

            c => c.id === id

        );

        if(!clue){

            showToast(

                "Clue Not Found"

            );

            return;

        }

        investigatedLocations.add(id);

        button.disabled = true;

        button.textContent =

        "Completed";

        card.classList.add(

            "completed"

        );

        addEvidence(

            clue.location,

            clue.clue

        );

        addNotebook(

            clue.location

        );

        addClue();

        addScore(100);

        updateProgress();

        saveProgress();

        showToast(

            "New Evidence Collected"

        );

    });

});
/* ==========================================================
                SCRIPT.JS - PART 2B
        ACHIEVEMENTS + INVENTORY + RESTORE
========================================================== */

/* ==========================================================
                    INVENTORY
========================================================== */

const inventory =
document.getElementById("inventory");

function addInventoryItem(item){

    const exists =

    [...inventory.querySelectorAll("li")]

    .some(li => li.textContent === item);

    if(exists) return;

    const li = document.createElement("li");

    li.textContent = item;

    li.style.opacity = "0";

    inventory.appendChild(li);

    setTimeout(()=>{

        li.style.transition = ".4s";

        li.style.opacity = "1";

    },100);

}

/* ==========================================================
                ACHIEVEMENTS
========================================================== */

function unlockAchievement(id){

    const card =

    document.getElementById(id);

    if(!card) return;

    if(card.classList.contains("active")) return;

    card.classList.add("active");

    showToast(

        "🏆 Achievement Unlocked!"

    );

}

function checkAchievements(){

    if(cluesFound >= 1){

        unlockAchievement("achievement1");

    }

    if(cluesFound >= 6){

        unlockAchievement("achievement2");

    }

}

/* ==========================================================
            UPDATE INVESTIGATION STATS
========================================================== */

function updateStats(){

    clueCountDisplay.textContent =

    cluesFound + " / 6";

    updateProgress();

    checkAchievements();

}

/* ==========================================================
            ENHANCE INVESTIGATION
========================================================== */

investigateButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const card =

        button.closest(".location-card");

        const id =

        Number(card.dataset.id);

        if(

            !investigatedLocations.has(id)

        ){

            return;

        }

        switch(id){

            case 1:

                addInventoryItem(

                "🔪 Bloody Knife"

                );

                break;

            case 2:

                addInventoryItem(

                "📜 Torn Letter"

                );

                break;

            case 3:

                addInventoryItem(

                "💳 Financial Records"

                );

                break;

            case 4:

                addInventoryItem(

                "🚗 Tire Impressions"

                );

                break;

            case 5:

                addInventoryItem(

                "🧤 Fingerprints"

                );

                break;

            case 6:

                addInventoryItem(

                "⛵ Witness Statement"

                );

                break;

        }

        updateStats();

    });

});

/* ==========================================================
                RESTORE UI
========================================================== */

window.addEventListener("DOMContentLoaded",()=>{

    investigatedLocations.forEach(id=>{

        const card =

        document.querySelector(

        `.location-card[data-id="${id}"]`

        );

        if(!card) return;

        card.classList.add("completed");

        const btn =

        card.querySelector(

        ".investigateBtn"

        );

        btn.disabled = true;

        btn.textContent =

        "Completed";

    });

});

/* ==========================================================
            AUTO SAVE SCORE
========================================================== */

setInterval(()=>{

    localStorage.setItem(

        "score",

        score

    );

    localStorage.setItem(

        "cluesFound",

        cluesFound

    );

},3000);

/* ==========================================================
            RESTORE SCORE
========================================================== */

window.addEventListener("DOMContentLoaded",()=>{

    const savedClues =

    Number(

        localStorage.getItem(

        "cluesFound"

        )

    ) || 0;

    cluesFound = savedClues;

    clueCountDisplay.textContent =

    cluesFound + " / 6";

    updateProgress();

});

/* ==========================================================
            SCROLL TO NEW EVIDENCE
========================================================== */

const evidenceObserver =

new MutationObserver(()=>{

    evidenceBoard.scrollTo({

        top:evidenceBoard.scrollHeight,

        behavior:"smooth"

    });

});

evidenceObserver.observe(

    evidenceBoard,

    {

        childList:true

    }

);

/* ==========================================================
                NOTEBOOK SCROLL
========================================================== */

const notebookObserver =

new MutationObserver(()=>{

    notebook.scrollTo({

        top:notebook.scrollHeight,

        behavior:"smooth"

    });

});

notebookObserver.observe(

    notebook,

    {

        childList:true

    }

);
/* ==========================================================
                SCRIPT.JS - PART 2C
        SUSPECT INTERROGATION + HINT SYSTEM
========================================================== */

/* ==========================================================
                    RANDOM KILLER
========================================================== */

const suspectNames = [

    "John Carter",

    "Emma Wilson",

    "Robert Miles",

    "Olivia Brown"

];

let killer =

localStorage.getItem("killer");

if(!killer){

    killer =

    suspectNames[

        Math.floor(

            Math.random() *

            suspectNames.length

        )

    ];

    localStorage.setItem(

        "killer",

        killer

    );

}

/* ==========================================================
                SUSPECT DIALOGUES
========================================================== */

const suspectDialogues = {

    "John Carter":[

        "I was discussing business with Richard.",

        "Someone wanted his fortune.",

        "I heard strange footsteps upstairs."

    ],

    "Emma Wilson":[

        "I stayed inside the office all evening.",

        "The victim looked worried.",

        "Someone deleted important files."

    ],

    "Robert Miles":[

        "I only handled legal papers.",

        "The will was changed recently.",

        "Money changes people."

    ],

    "Olivia Brown":[

        "I was cleaning the dining hall.",

        "I heard a loud scream.",

        "I saw someone running outside."

    ]

};

/* ==========================================================
            INTERROGATION BUTTONS
========================================================== */

const questionButtons =

document.querySelectorAll(".questionBtn");

questionButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const card =

        button.closest(".suspect-card");

        const suspect =

        card.querySelector("h3").textContent;

        const talks =

        suspectDialogues[suspect];

        const message =

        talks[

            Math.floor(

                Math.random() *

                talks.length

            )

        ];

        addNotebook(

            suspect

        );

        showToast(

            suspect +

            " questioned."

        );

        alert(

            suspect +

            "\n\n" +

            message

        );

        if(

            suspect === killer

        ){

            addScore(50);

        }

    });

});

/* ==========================================================
                    HINT SYSTEM
========================================================== */

const hints = [

"Search every location carefully.",

"Evidence is more reliable than statements.",

"The killer becomes nervous during questioning.",

"Collect all six clues before arresting anyone.",

"The notebook may reveal hidden patterns."

];

const hintBtn =

document.getElementById("hintBtn");

if(hintBtn){

hintBtn.addEventListener("click",()=>{

const hint =

hints[

Math.floor(

Math.random()*

hints.length

)

];

alert(

"💡 Detective Hint\n\n"+

hint

);

});

}

/* ==========================================================
            DETECTIVE NOTE BONUS
========================================================== */

function notebookBonus(){

    const notes =

    notebook.querySelectorAll(".note");

    if(

        notes.length >= 6

    ){

        unlockAchievement(

            "achievement3"

        );

        addScore(200);

    }

}

/* ==========================================================
            CHECK AFTER EACH NOTE
========================================================== */

const notebookWatcher =

new MutationObserver(()=>{

    notebookBonus();

});

notebookWatcher.observe(

    notebook,

    {

        childList:true

    }

);

/* ==========================================================
            HIGHLIGHT PRIME SUSPECT
========================================================== */

function highlightSuspects(){

    const cards =

    document.querySelectorAll(

        ".suspect-card"

    );

    cards.forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform=

            "translateY(-10px) scale(1.03)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform=

            "";

        });

    });

}

highlightSuspects();

/* ==========================================================
            CASE COMPLETION CHECK
========================================================== */

function readyForArrest(){

    if(cluesFound < 6){

        showToast(

        "Collect all clues first!"

        );

        return false;

    }

    return true;

}
/* ==========================================================
                SCRIPT.JS - PART 3A
            ARREST SYSTEM + CASE ENDING
========================================================== */

/* ==========================================================
                    ARREST BUTTON
========================================================== */

const arrestBtn = document.getElementById("arrestBtn");
const arrestModal = document.getElementById("arrestModal");
const closeArrest = document.getElementById("closeArrest");

if(arrestBtn){

    arrestBtn.addEventListener("click",()=>{

        if(!readyForArrest()) return;

        arrestModal.style.display="flex";

    });

}

if(closeArrest){

    closeArrest.addEventListener("click",()=>{

        arrestModal.style.display="none";

    });

}

window.addEventListener("click",(e)=>{

    if(e.target===arrestModal){

        arrestModal.style.display="none";

    }

});

/* ==========================================================
                ARREST OPTIONS
========================================================== */

const arrestOptions =
document.querySelectorAll(".arrest-option");

arrestOptions.forEach(option=>{

    option.addEventListener("click",()=>{

        const selected =
        option.dataset.name;

        arrestModal.style.display="none";

        finishInvestigation(selected);

    });

});

/* ==========================================================
                FINAL CASE LOGIC
========================================================== */

function finishInvestigation(selectedSuspect){

    investigationFinished = true;

    clearInterval(timerInterval);

    if(selectedSuspect===killer){

        addScore(500);

        unlockAchievement("achievement4");

        showVictory(selectedSuspect);

    }

    else{

        showDefeat(selectedSuspect);

    }

}

/* ==========================================================
                VICTORY
========================================================== */

function showVictory(name){

    localStorage.setItem(

        "caseSolved",

        "true"

    );

    alert(

`🎉 CASE SOLVED!

Congratulations Detective!

You arrested:

${name}

The investigation was successful.

Justice has been served.

Final Score : ${score}`

    );

}

/* ==========================================================
                DEFEAT
========================================================== */

function showDefeat(name){

    alert(

`❌ WRONG SUSPECT!

You arrested:

${name}

The real killer was:

${killer}

The criminal escaped.

Better luck next time Detective.`

    );

}

/* ==========================================================
                FINAL BONUS
========================================================== */

function calculateBonus(){

    let bonus = 0;

    if(timerMinutes>=7){

        bonus += 300;

    }

    else if(timerMinutes>=5){

        bonus += 200;

    }

    else{

        bonus += 100;

    }

    addScore(bonus);

}

calculateBonus();

/* ==========================================================
                GAME COMPLETE
========================================================== */

function completeGame(){

    localStorage.setItem(

        "finalScore",

        score

    );

    localStorage.setItem(

        "gameCompleted",

        "true"

    );

}

window.addEventListener("beforeunload",()=>{

    completeGame();

});

/* ==========================================================
                RESTART GAME
========================================================== */

const restartBtn =
document.getElementById("restartBtn");

if(restartBtn){

restartBtn.addEventListener("click",()=>{

const confirmRestart=

confirm(

"Restart Investigation?"

);

if(!confirmRestart) return;

localStorage.removeItem("score");

localStorage.removeItem("cluesFound");

localStorage.removeItem("killer");

localStorage.removeItem("investigated");

localStorage.removeItem("caseSolved");

localStorage.removeItem("gameCompleted");

location.reload();

});

}

/* ==========================================================
            CONSOLE MESSAGE
========================================================== */

console.log(

"%c🕵 CrimeLens Loaded Successfully",

"font-size:22px;color:#00d4ff;font-weight:bold;"

);

console.log(

"%cDesigned by Bhavika",

"font-size:15px;color:#FFD54F;"

);
/* ==========================================================
                SCRIPT.JS - PART 3B
          FINAL ANIMATIONS & GAME POLISH
========================================================== */

/* ==========================================================
                SCROLL ANIMATIONS
========================================================== */

const revealElements = document.querySelectorAll(

".story-card,.location-card,.suspect-card,.achievement-card,.inventory,.timer-box,.evidence,.note"

);

const revealObserver = new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},

{

threshold:0.15

}

);

revealElements.forEach(el=>{

el.style.opacity="0";

el.style.transform="translateY(60px)";

el.style.transition=".7s ease";

revealObserver.observe(el);

});

/* ==========================================================
                FLOATING PARTICLES
========================================================== */

const particlesContainer = document.getElementById("particles");

function createParticle(){

if(!particlesContainer) return;

const particle = document.createElement("span");

particle.className = "particle";

particle.style.left = Math.random()*100 + "%";

particle.style.animationDuration =

5 + Math.random()*5 + "s";

particle.style.opacity =

0.2 + Math.random()*0.6;

particle.style.width =

4 + Math.random()*8 + "px";

particle.style.height =

particle.style.width;

particlesContainer.appendChild(particle);

setTimeout(()=>{

particle.remove();

},9000);

}

setInterval(createParticle,350);

/* ==========================================================
                CONFETTI
========================================================== */

function launchConfetti(){

for(let i=0;i<120;i++){

const confetti =

document.createElement("div");

confetti.className="confetti";

confetti.style.left=

Math.random()*100+"vw";

confetti.style.animationDuration=

2+Math.random()*3+"s";

confetti.style.background=

`hsl(${Math.random()*360},90%,60%)`;

document.body.appendChild(confetti);

setTimeout(()=>{

confetti.remove();

},5000);

}

}

/* ==========================================================
                CASE REPORT
========================================================== */

function generateReport(){

const report =

`

========== CASE REPORT ==========

Detective :

${localStorage.getItem("detectiveName")}

Badge :

${localStorage.getItem("badgeNumber")}

Score :

${score}

Clues Found :

${cluesFound}/6

Real Killer :

${killer}

Solved :

${localStorage.getItem("caseSolved")}

================================

`;

console.log(report);

}

/* ==========================================================
            AFTER WIN
========================================================== */

const originalVictory = showVictory;

showVictory = function(name){

launchConfetti();

generateReport();

originalVictory(name);

};

/* ==========================================================
            FINAL STATISTICS
========================================================== */

function showStatistics(){

console.table({

Detective:

localStorage.getItem("detectiveName"),

Score:score,

Clues:cluesFound,

Killer:killer,

Solved:

localStorage.getItem("caseSolved")

});

}

window.addEventListener(

"beforeunload",

showStatistics

);

/* ==========================================================
            KEYBOARD SHORTCUTS
========================================================== */

document.addEventListener(

"keydown",

(e)=>{

if(e.key==="h"){

if(typeof hintBtn!=="undefined"){

hintBtn.click();

}

}

if(e.key==="a"){

if(typeof arrestBtn!=="undefined"){

arrestBtn.click();

}

}

if(e.key==="r"){

if(typeof restartBtn!=="undefined"){

restartBtn.click();

}

}

}

/* ==========================================================
            RANDOM DETECTIVE QUOTES
========================================================== */

);

const quotes=[

"Every clue tells a story.",

"Trust evidence, not emotions.",

"The smallest detail matters.",

"Justice always leaves footprints.",

"A detective never guesses."

];

setInterval(()=>{

const quote=

quotes[

Math.floor(

Math.random()*quotes.length

)

];

console.log(

"%c"+quote,

"color:#00d4ff;font-size:15px"

);

},30000);

/* ==========================================================
                GAME INITIALIZATION
========================================================== */

window.addEventListener(

"DOMContentLoaded",

()=>{

updateTimer();

updateProgress();

showToast(

"Welcome Detective!"

);

console.log(

"%cMystery Quest Ready",

"font-size:20px;color:#00d4ff;font-weight:bold"

);

});