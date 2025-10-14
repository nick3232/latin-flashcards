# Latin Flashcards App — Developer Notes

A lightweight, dependency-free web application for learning Latin vocabulary through interactive flashcards.

---

## 🚀 Overview
This project provides a no-install, offline-friendly flashcard tool designed to help you study Latin vocabulary. It runs entirely in the browser using just **HTML, CSS, and JavaScript**, making it perfect for local use or easy sharing (e.g., via Google Drive, GitHub Pages, or Netlify).

---

## 🧩 File Structure
```
latin-flashcards/
│
├── index.html      # Layout and structure for all screens
├── styles.css      # Visual design, layout, and transitions
└── script.js       # Logic for navigation, interactivity, and data
```
All three files must stay in the same folder. Opening `index.html` in any modern browser (desktop or mobile) launches the app.

---

## 🧠 App Features
- **Home screen** with three main categories:
  - Beginner Latin
  - Roman Philosophy
  - Roman Literature
- **Subcategory menus** divide each category into smaller sets (e.g., Beginner 1–4, each with ~25 words).
- **Interactive flashcards** that flip between Latin and English.
- **Shuffle and navigation controls** for easy study.
- **Word List view** that displays all words in the current subset.
- **Keyboard shortcuts:**
  - `Space` → flip card
  - `←` / `→` → move between cards

---

## 🧭 How to Run
1. Save all three files in the same folder.
2. Open `index.html` directly in your browser.
3. The app runs offline — no installation or server required.

**Mobile Tip:** You can add the page to your home screen for a native app feel.

---

## 🛠️ Editing & Expansion
### Adding a New Subset
To add new sets of words:
1. Open `script.js`.
2. Locate the `const decks = { ... }` object.
3. Add a new array inside a category, for example:
```js
decks.beginner.push([
  { latin: "domus", pron: "DOH-moos", english: "home" },
  { latin: "flos", pron: "floss", english: "flower" }
]);
```
4. Save and refresh the app — a new “Beginner 5” button will appear automatically.

### Adding a New Category
You can also add entirely new categories:
```js
decks.history = [
  [
    { latin: "imperium", pron: "im-PEH-ree-oom", english: "empire" },
    { latin: "urbs", pron: "oorbs", english: "city" }
  ]
];
```
The app will automatically generate a “History” button on the home screen.

---

## 💾 Deployment Options
- **Local use:** Open `index.html` directly.
- **Google Drive:** Upload the three files, then open `index.html`.
- **GitHub Pages:** Push to a GitHub repo → enable Pages → get a free web URL.
- **Netlify or Cloudflare Pages:** Drag & drop the folder for instant deployment.

---

## 📚 Future Enhancements (optional ideas)
- Add localStorage to remember study progress.
- Include audio pronunciation files.
- Add progress indicators for each subset.
- Implement spaced repetition scheduling.
- Support for custom decks via local JSON import.

---

### Created With
- HTML5
- CSS3 (no frameworks)
- Vanilla JavaScript

**Philosophy:** Minimalist, educational, and portable — an app that can live forever on a USB stick.

---

**Author:** You — guided through ChatGPT collaboration.

Enjoy your studies, and vale discipule!
