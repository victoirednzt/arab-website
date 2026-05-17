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