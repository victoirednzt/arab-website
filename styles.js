// =========================================================
//  Attend que le HTML soit complètement chargé avant tout
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    //  MENU DÉROULANT
    // =========================================================
    const dropdown = document.querySelector(".dropdown");
    const toggle = document.querySelector(".dropdown-toggle");

    if (toggle && dropdown) {
        // Clic sur le bouton → ouvre/ferme
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });

        // Clic ailleurs → ferme
        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
            }
        });

        // Touche Echap → ferme
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                dropdown.classList.remove("open");
            }
        });
    }

    // =========================================================
    //  DÉTECTION DE LA PAGE ACTIVE
    // =========================================================
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".dropdown-menu a").forEach((link) => {
        const href = link.getAttribute("href");
        if (
            href &&
            (href.endsWith(currentPage) ||
                (currentPage === "" && href.endsWith("index.html")))
        ) {
            link.classList.add("active");
            const num = link.querySelector(".menu-num");
            const label = link.querySelector(".menu-label");
            const currentNum = document.querySelector(".current-num");
            const currentLabel = document.querySelector(".current-label");
            if (currentNum && num) currentNum.textContent = num.textContent;
            if (currentLabel && label) currentLabel.textContent = label.textContent;
        }
    });

    // =========================================================
    //  MINI-JEU D'ASSOCIATION (page jeu.html uniquement)
    // =========================================================
    const gameCards = document.querySelectorAll(".game-card");
    let firstPick = null;

    gameCards.forEach((card) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("matched")) return;

            if (!firstPick) {
                firstPick = card;
                card.style.outline = "2px solid var(--gold)";
                return;
            }

            if (firstPick === card) {
                card.style.outline = "";
                firstPick = null;
                return;
            }

            if (firstPick.dataset.pair === card.dataset.pair) {
                firstPick.classList.add("matched");
                card.classList.add("matched");
            }

            firstPick.style.outline = "";
            firstPick = null;
        });
    });

});


const PAIRS = [
    { id: 1, singular: "كِتاب", plural: "كُتُب" },
    { id: 2, singular: "طالِب", plural: "طُلّاب" },
    { id: 3, singular: "بَيت", plural: "بُيوت" },
    { id: 4, singular: "قَلَم", plural: "أَقلام" },
    { id: 5, singular: "وَلَد", plural: "أَولاد" },
    { id: 6, singular: "بِنت", plural: "بَنات" },
];

const grid = document.getElementById("game-grid");
const scoreEl = document.getElementById("score");
const successEl = document.getElementById("game-success");
const resetBtn = document.getElementById("reset-btn");

let firstPickGame = null;
let score = 0;
let canClick = true;

function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildGame() {
    if (!grid) return;

    grid.innerHTML = "";
    score = 0;
    if (scoreEl) scoreEl.textContent = "0";
    if (successEl) successEl.hidden = true;
    firstPickGame = null;

    const cards = [];
    PAIRS.forEach((p) => {
        cards.push({ pair: p.id, type: "مفرد", word: p.singular });
        cards.push({ pair: p.id, type: "جمع", word: p.plural });
    });

    shuffle(cards).forEach((c) => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.dataset.pair = c.pair;
        card.innerHTML = `
      <span class="card-type">${c.type}</span>
      <span>${c.word}</span>
    `;
        card.addEventListener("click", () => handleClick(card));
        grid.appendChild(card);
    });
}

function handleClick(card) {
    if (!canClick) return;
    if (card.classList.contains("matched")) return;
    if (card === firstPickGame) {
        card.classList.remove("selected");
        firstPickGame = null;
        return;
    }

    if (!firstPickGame) {
        firstPickGame = card;
        card.classList.add("selected");
        return;
    }

    // Deuxième carte cliquée
    const isMatch = firstPickGame.dataset.pair === card.dataset.pair;

    if (isMatch) {
        firstPickGame.classList.remove("selected");
        firstPickGame.classList.add("matched");
        card.classList.add("matched");
        firstPickGame = null;
        score++;
        if (scoreEl) scoreEl.textContent = score;
        if (score === PAIRS.length && successEl) {
            successEl.hidden = false;
        }
    } else {
        canClick = false;
        firstPickGame.classList.add("wrong");
        card.classList.add("wrong");
        const previousFirst = firstPickGame;
        setTimeout(() => {
            previousFirst.classList.remove("wrong", "selected");
            card.classList.remove("wrong");
            firstPickGame = null;
            canClick = true;
        }, 600);
    }
}

if (resetBtn) resetBtn.addEventListener("click", buildGame);

buildGame();
