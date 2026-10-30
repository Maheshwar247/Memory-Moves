const cardDeck = [
    {name: "Ghost", face: "👻"},
    {name: "Alien", face: "👾"},
    {name: "Dog", face :"🐶"},
    {name: "Cake", face:"🎂"},
    {name: "Diamond", face:"💎"},
    {name: "World", face:"🌍"}
];
const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const bestDisplay = document.getElementById("best");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedpairs = 0;
let mismatchTimer = null;

function shuffle(array) {
    for (let i = array.length - 1;i>0; i--) {
        const a = Math.floor(Math.random()*(i+1));
        [array[i], array[a]] = [array[a], array[i]];
    }
    return array;
}

function createCard(character) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.name = character.name;
    card.setAttribute("aria-label", "Hidden card")
    card.innerHTML = `
    <span class = "card-inner">
        <span class = "card-face card-back">?</span>
        <span class = "card-face card-front">${character.face}</span>
    </span>
    `;
    card.addEventListener("click", () => flipCard(card));
    return card;
}

function flipCard(card) {
    if(lockBoard) return;
    if (card == firstCard) return;
    if (card.classList.contains("matched"))return;

    card.classList.add("flipped")
    card.setAttribute("aria-label", "Revealed card");
    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    moves++;
    movesDisplay.textContent=moves; 
    verifypair();
}
function verifypair() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        handleMatch();
    } else {
        handleMismatch();
    }

}

function handleMatch() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedpairs++;
    resetTurn();
    if (matchedpairs === cardDeck.length) {
        winGame();
    }
}
function handleMismatch() {
    lockBoard = true;
    mismatchTimer = setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
    }, 900);

}
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
function winGame() {
    message.textContent = `You won in ${moves} moves!`;
    const best = Number(localStorage.getItem("bestScore"));
    if (!best || moves < best) {
        localStorage.setItem("bestScore", moves);
        bestDisplay.textContent = moves;
        message.textContent += " New best score!";
    }
}

function loadBest(){
    const best = localStorage.getItem("bestScore");
    bestDisplay.textContent = best ? best:"-";
}

function startGame() {
    clearTimeout(mismatchTimer);
    board.innerHTML = "";
    message.textContent = "";
    moves = 0;
    matchedpairs = 0; 
    movesDisplay.textContent = moves;
    resetTurn();
    const deck = shuffle([...cardDeck, ...cardDeck]);
    deck.forEach(character => {
        board.appendChild(createCard(character))
    });
    loadBest();
}
restartButton.addEventListener("click", startGame);
startGame();