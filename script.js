/* ============================= */
/* Latin Flashcards - script.js  */
/* ============================= */

let decks = {};
let currentDeck = [];
let currentIndex = 0;

/* View Elements */
const homeView = document.getElementById("homeView");
const flashcardView = document.getElementById("flashcardView");
const allWordsView = document.getElementById("allWordsView");

/* Flashcard Elements */
const card = document.getElementById("card");
const latinWord = document.getElementById("latin-word");
const latinPron = document.getElementById("latin-pron");
const latinWordBack = document.getElementById("latin-word-back");
const latinPronBack = document.getElementById("latin-pron-back");
const englishWord = document.getElementById("english-word");
const progress = document.getElementById("progress");
const toast = document.getElementById("toast");

/* Buttons */
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const revealBtn = document.getElementById("revealBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const showListBtn = document.getElementById("showListBtn");
const homeBtn = document.getElementById("homeBtn");
const backToFlashcards = document.getElementById("backToFlashcards");

/* ============================= */
/* View Handling                 */
/* ============================= */
function showView(view) {
  homeView.classList.add("hidden");
  flashcardView.classList.add("hidden");
  allWordsView.classList.add("hidden");
  view.classList.remove("hidden");
}

/* ============================= */
/* Flashcard Logic               */
/* ============================= */
function renderCard() {
  const word = currentDeck[currentIndex];
  if (!word) return;

  latinWord.textContent = word.latin;
  latinPron.textContent = word.pron;
  latinWordBack.textContent = word.latin;
  latinPronBack.textContent = word.pron;
  englishWord.textContent = word.english;

  card.classList.remove("revealed");
  progress.textContent = `${currentIndex + 1} / ${currentDeck.length}`;
}

function nextCard() {
  currentIndex = (currentIndex + 1) % currentDeck.length;
  renderCard();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + currentDeck.length) % currentDeck.length;
  renderCard();
}

function revealCard() {
  card.classList.toggle("revealed");
}

function shuffleDeck() {
  for (let i = currentDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
  }
  currentIndex = 0;
  renderCard();
  showToast("Shuffled successfully!");
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

/* ============================= */
/* Word List View                */
/* ============================= */
function populateWordList() {
  const tbody = document.getElementById("wordsTableBody");
  tbody.innerHTML = "";

  currentDeck.forEach((word, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${word.latin}</td>
      <td>${word.pron}</td>
      <td>${word.english}</td>
    `;

    // Add click event to jump back to flashcard
    row.addEventListener("click", () => {
      currentIndex = i;
      renderCard();
      showView(flashcardView);
    });

    tbody.appendChild(row);
  });
}


/* ============================= */
/* Load Deck                     */
/* ============================= */
function loadDeck(levelKey) {
  console.log("Loading deck:", levelKey);
  const deck = decks[levelKey];
  if (!deck) {
    console.error("No deck found for:", levelKey);
    return;
  }

  currentDeck = deck;
  currentIndex = 0;
  renderCard();
  showView(flashcardView);
}

/* ============================= */
/* Event Listeners               */
/* ============================= */
document.querySelectorAll("#homeView .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = btn.dataset.level;
    loadDeck(level);
  });
});

nextBtn.addEventListener("click", nextCard);
prevBtn.addEventListener("click", prevCard);
revealBtn.addEventListener("click", revealCard);
shuffleBtn.addEventListener("click", shuffleDeck);
showListBtn.addEventListener("click", () => {
  populateWordList();
  showView(allWordsView);
});
backToFlashcards.addEventListener("click", () => showView(flashcardView));
homeBtn.addEventListener("click", () => showView(homeView));

/* ============================= */
/* Card Click-to-Reveal Feature  */
/* ============================= */
card.addEventListener("click", () => {
  card.classList.toggle("revealed");
});

/* ============================= */
/* Initialization                */
/* ============================= */
fetch("words.json")
  .then(res => res.json())
  .then(data => {
    decks = data;
    console.log("Decks loaded:", Object.keys(decks));
  })
  .catch(err => console.error("Error loading JSON:", err));
