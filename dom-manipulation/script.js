const quotes = loadQuotesFromLocalStorage() || [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `${randomQuote.text}   
 - ${randomQuote.category}`;
}

function createAddQuoteForm() {
  const form = document.createElement("form");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Quote";
  submitButton.onclick = addQuote;

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);

  const formContainer = document.createElement("div");
  formContainer.appendChild(form);
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value,
  };
  const categories = getCategories();
  populateCategoryFilter();

  saveQuotes();
  quotes.push(newQuote);
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  showRandomQuote();
}

newQuoteButton.addEventListener("click", displayRandomQuote);

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  return storedQuotes ? JSON.parse(storedQuotes) : [];
}

function exportQuotesToJson() {
  const jsonData = JSON.stringify(quotes);
  const blob = new Blob([jsonData], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(downloadUrl);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
displayRandomQuote();
createAddQuoteForm();

const importFileInput = document.getElementById("importFile");
importFileInput.onchange = importFromJsonFile;

function getCategories() {
  const categories = quotes.map((quote) => quote.category);
  return [...new Set(categories)];
}

function populateCategories() {
  const categories = getCategories();
  const filterSelect = document.getElementById("categoryFilter");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    filterSelect.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  localStorage.setItem("selectedCategory", selectedCategory);
}

function loadLastFilter() {
  const storedCategory = localStorage.getItem("selectedCategory");
  if (storedCategory) {
    document.getElementById("categoryFilter").value = storedCategory;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  localStorage.setItem("selectedCategory", selectedCategory);
}
function loadLastFilter() {
  const storedCategory = localStorage.getItem("selectedCategory");
  if (storedCategory) {
    document.getElementById("categoryFilter").value = storedCategory;
  }
}

loadQuotes();
populateCategories();
loadLastFilter();
filterQuotes();
createAddQuoteForm();

const SYNC_INTERVAL = 5000;

async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const serverQuotes = await response.json();
  return serverQuotes;
}

async function syncData() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    quotes = serverQuotes;
    saveQuotes();
  } catch (error) {
    console.error("Error syncing data:", error);
  }
}

function startSync() {
  syncData();
  setInterval(syncData, SYNC_INTERVAL);
}

startSync();
