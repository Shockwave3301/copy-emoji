const searchEl = document.getElementById("search");
const statusEl = document.getElementById("status");
const gridEl = document.getElementById("grid");

let allEmoji = [];
let copyTimer = null;
let debounceTimer;

const flashCopied = (cell) => {
  cell.classList.add("copied");
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => cell.classList.remove("copied"), 900);
};

const onCellClick = ({ currentTarget: cell }) => {
  navigator.clipboard
    .writeText(cell.dataset.char)
    .then(() => flashCopied(cell));
};

const renderGrid = (emoji) => {
  gridEl.replaceChildren(
    ...emoji.map(({ char, name }) => {
      const cell = document.createElement("div");

      cell.className = "cell";
      cell.dataset.char = char;
      cell.title = name;
      cell.innerHTML = `<span class="emoji">${char}</span><span class="label">${name}</span><span class="toast">Copied!</span>`;
      cell.addEventListener("click", onCellClick);

      return cell;
    }),
  );
};

const filter = (query) => {
  const normalizedQuery = query.trim().toLowerCase();

  return normalizedQuery
    ? allEmoji.filter((e) => e.name.includes(normalizedQuery))
    : allEmoji;
};

searchEl.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => renderGrid(filter(searchEl.value)), 80);
});

fetch("./emoji.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((data) => {
    allEmoji = data;
    statusEl.hidden = true;
    gridEl.hidden = false;
    searchEl.focus();
    renderGrid(allEmoji);
  })
  .catch((err) => {
    statusEl.textContent = `Failed to load emoji: ${err.message}`;
    statusEl.classList.add("error");
  });
