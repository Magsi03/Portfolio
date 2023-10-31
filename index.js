
const router = new Router();

// Routen definieren
router.addRoute("/", searchPage);
router.addRoute("/results", resultsPage);
router.addRoute("/detail", detailPage);


function searchPage() {
  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = searchForm.search.value;

    try {
      const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
      const data = await response.json();

      if (data.length > 0) {
        showSearchResults(data);
      } else {
        showError("Keine Ergebnisse gefunden.");
      }
    } catch (error) {
      showError("Fehler beim Abrufen der Suchergebnisse.");
    }
  });
}
function resultsPage(results) {
  const resultsTitle = document.getElementById("resultsTitle");
  const searchResults = document.getElementById("searchResults");

  resultsTitle.textContent = "Suchergebnisse";
  searchResults.innerHTML = "";

  results.forEach((result) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    const title = document.createElement("h3");
    title.textContent = result.title;

    const description = document.createElement("p");
    description.textContent = result.description;

    resultItem.appendChild(title);
    resultItem.appendChild(description);

    searchResults.appendChild(resultItem);
  });
}
/*
function showSearchResults(results) {
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";

  results.forEach((result) => {
    const resultLink = document.createElement("a");
    resultLink.href = `#detail?id=${result.id}`;
    resultLink.textContent = result.title;

    searchResultsContainer.appendChild(resultLink);
    searchResultsContainer.appendChild(document.createElement("br"));
  });
}*/

// Funktion für die Detailseite
async function detailPage(matches) {
  const detailPageContainer = document.getElementById("detailPage");
  detailPageContainer.innerHTML = "";

  const postId = matches.params.id;

  try {
    const postResponse = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await postResponse.json();

    const commentsResponse = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
    const commentsData = await commentsResponse.json();

    showPostDetails(postData, commentsData);
  } catch (error) {
    showError("Fehler beim Abrufen der Detaildaten.");
  }
}

function showPostDetails(post, comments) {
  const detailPageContainer = document.getElementById("detailPage");

  const detailTitle = document.createElement("h2");
  detailTitle.textContent = post.title;

  const detailContent = document.createElement("p");
  detailContent.textContent = post.content;

  const commentList = document.createElement("ul");
  comments.forEach((comment) => {
    const commentItem = document.createElement("li");
    commentItem.textContent = comment.text;
    commentList.appendChild(commentItem);
  });

  detailPageContainer.appendChild(detailTitle);
  detailPageContainer.appendChild(detailContent);
  detailPageContainer.appendChild(document.createElement("hr"));
  detailPageContainer.appendChild(commentList);
}

// Funktion zum Anzeigen von Fehlermeldungen
function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = message;
}

// Event-Listener für das Laden der Seite und das Ändern der URL
window.addEventListener("DOMContentLoaded", router.handleRouting.bind(router));
window.addEventListener("hashchange", router.handleRouting.bind(router));