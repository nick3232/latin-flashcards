// script.js — Latin Flashcards App
// ================================================================
// This script manages all logic for the Latin Flashcards application.
// It handles navigation between views, card flipping, deck selection,
// and dynamic word list generation. Fully standalone — no dependencies.
// ================================================================

// ========================
// DATA STRUCTURE
// ========================
// Decks are organized by category (beginner, philosophy, literature).
// Each category contains subsets of up to 25 words per array.
const decks = {
  beginner: [
    [
      { latin: "puella", pron: "pweh-lah", english: "girl" },
      { latin: "puer", pron: "poo-er", english: "boy" },
      { latin: "terra", pron: "teh-rah", english: "earth / land" },
      { latin: "amicus", pron: "ah-MEE-koos", english: "friend" },
      { latin: "rex", pron: "reks", english: "king" }
    ],
    [
      { latin: "aqua", pron: "AH-kwah", english: "water" },
      { latin: "ignis", pron: "IG-nees", english: "fire" },
      { latin: "canis", pron: "KAH-nees", english: "dog" },
      { latin: "equus", pron: "EH-kwoos", english: "horse" },
      { latin: "via", pron: "WEE-ah", english: "road / way" }
    ],
    [
      { latin: "casa", pron: "KAH-sah", english: "house" },
      { latin: "mensa", pron: "MEN-sah", english: "table" },
      { latin: "liber", pron: "LEE-ber", english: "book" },
      { latin: "bellum", pron: "BEL-lum", english: "war" },
      { latin: "pax", pron: "paks", english: "peace" }
    ],
    [
      { latin: "corpus", pron: "KOR-poos", english: "body" },
      { latin: "tempus", pron: "TEM-poos", english: "time" },
      { latin: "mare", pron: "MAH-reh", english: "sea" },
      { latin: "sol", pron: "sohl", english: "sun" },
      { latin: "luna", pron: "LOO-nah", english: "moon" }
    ]
  ],
  philosophy: [
    [
      { latin: "virtus", pron: "WEER-toos", english: "virtue / excellence" },
      { latin: "sapientia", pron: "sah-pee-EN-tee-ah", english: "wisdom" },
      { latin: "anima", pron: "AH-nee-mah", english: "soul" },
      { latin: "ratio", pron: "RAH-tee-oh", english: "reason" },
      { latin: "natura", pron: "nah-TOO-rah", english: "nature" }
    ]
  ],
  literature: [
    [
      { latin: "arma", pron: "AHR-mah", english: "arms / weapons" },
      { latin: "amor", pron: "AH-mor", english: "love" },
      { latin: "bellum", pron: "BEL-lum", english: "war" },
      { latin: "fatum", pron: "FAH-toom", english: "fate / destiny" },
      { latin: "dea", pron: "DEH-ah", english: "goddess" }
    ]
  ]
};

// ========================
// STATE MANAGEMENT
// ========================
// Variables that track the app’s current state: deck, index, and views.
let currentDeck = [];
let index = 0;
let revealed = false;
let currentCategory = null;
let currentSubset = 0;

// ========================
// ELEMENT REFERENCES
// ========================
// Cached DOM elements for performance and convenience.
const homeView = document.getElementById('homeView');
const subcategoryView = document.getElementById('subcategoryView');
const flashcardView = document.getElementById('flashcardView');
const allWordsView = document.getElementById('allWordsView');
const cardEl = document.getElementById('card');
const latinEl = document.getElementById('latin-word');
const pronEl = document.getElementById('latin-pron');
const latinBackEl = document.getElementById('latin-word-back');
const pronBackEl = document.getElementById('latin-pron-back');
const englishEl = document.getElementById('english-word');
const progressEl = document.getElementById('progress');
const toastEl = document.getElementById('toast');
const wordsTableBody = document.getElementById('wordsTableBody');

// ========================
// VIEW MANAGEMENT
// ========================
// Switches between main screens: home, category, flashcards, and list.
function showView(viewName) {
  [homeView, subcategoryView, flashcardView, allWordsView].forEach(v => v.classList.add('hidden'));
  if (viewName === 'home') homeView.classList.remove('hidden');
  if (viewName === 'subcategory') subcategoryView.classList.remove('hidden');
  if (viewName === 'flashcards') flashcardView.classList.remove('hidden');
  if (viewName === 'list') allWordsView.classList.remove('hidden');
}

// ========================
// CARD RENDERING
// ========================
// Displays the current card’s content and progress.
function renderCard() {
  const c = currentDeck[index];
  latinEl.textContent = c.latin;
  pronEl.textContent = c.pron;
  latinBackEl.textContent = c.latin;
  pronBackEl.textContent = c.pron;
  englishEl.textContent = c.english;
  progressEl.textContent = `Card ${index + 1} / ${currentDeck.length}`;
  hideTranslation(false);
}

// Handles the flip animation to reveal the English translation.
function showTranslation() {
  revealed = true;
  cardEl.classList.add('revealed');
}

// Resets card to front (Latin only).
function hideTranslation(animate = true) {
  revealed = false;
  cardEl.classList.remove('revealed');
  if (!animate) {
    cardEl.style.transition = 'none';
    void cardEl.offsetWidth;
    requestAnimationFrame(() => (cardEl.style.transition = ''));
  }
}

// Toggles translation visibility when clicking or pressing Space.
function toggleTranslation() {
  revealed ? hideTranslation() : showTranslation();
}

// Moves to the next card in the current deck.
function nextCard() {
  index = (index + 1) % currentDeck.length;
  renderCard();
}

// Moves to the previous card.
function prevCard() {
  index = (index - 1 + currentDeck.length) % currentDeck.length;
  renderCard();
}

// Randomly reorders current deck and restarts from first card.
function shuffleDeck() {
  for (let i = currentDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
  }
  index = 0;
  renderCard();
  showToast('Deck shuffled!');
}

// Shows a temporary on-screen message (e.g., deck shuffled).
function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 1500);
}

// ========================
// WORD LIST TABLE
// ========================
// Builds and displays the table of all words in the current subset.
function populateTable() {
  wordsTableBody.innerHTML = '';
  currentDeck.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${c.latin}</td><td>${c.pron}</td><td>${c.english}</td>`;
    // Clicking a row jumps directly to that card.
    tr.addEventListener('click', () => {
      index = i;
      showView('flashcards');
      renderCard();
    });
    wordsTableBody.appendChild(tr);
  });
}

// ========================
// EVENT HANDLERS
// ========================
// Handles keyboard navigation and button actions.
cardEl.addEventListener('click', toggleTranslation);
document.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); toggleTranslation(); }
  if (e.code === 'ArrowRight') { e.preventDefault(); nextCard(); }
  if (e.code === 'ArrowLeft') { e.preventDefault(); prevCard(); }
});

document.getElementById('nextBtn').onclick = nextCard;
document.getElementById('prevBtn').onclick = prevCard;
document.getElementById('shuffleBtn').onclick = shuffleDeck;
document.getElementById('wordListBtn').onclick = () => {
  populateTable();
  showView('list');
};
document.getElementById('backToFlashcards').onclick = () => showView('flashcards');
document.getElementById('backToHome').onclick = () => showView('home');
document.getElementById('backToSubcategory').onclick = () => showSubcategoryMenu(currentCategory);

// ========================
// CATEGORY & SUBCATEGORY MENUS
// ========================
// Builds dynamic subcategory buttons for each selected category.
const subcategoryTitle = document.getElementById('subcategoryTitle');
const subcategoryButtons = document.getElementById('subcategoryButtons');

document.querySelectorAll('#homeView .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    showSubcategoryMenu(currentCategory);
  });
});

function showSubcategoryMenu(category) {
  showView('subcategory');
  subcategoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Sets`;
  subcategoryButtons.innerHTML = '';
  decks[category].forEach((subset, i) => {
    const b = document.createElement('button');
    b.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} ${i + 1}`;
    b.className = 'btn';
    // Load selected subset and show flashcards view.
    b.addEventListener('click', () => {
      currentSubset = i;
      currentDeck = decks[category][i];
      index = 0;
      showView('flashcards');
      renderCard();
    });
    subcategoryButtons.appendChild(b);
  });
}

// ========================
// INITIAL LOAD
// ========================
// Displays the home screen on first load.
showView('home');
