
const router = new Router();

// Routen definieren
router.addRoute("/", searchPage);
router.addRoute("/results", resultsPage);
router.addRoute("/detail", detailPage);

//globale Variable um die Suchergebnisse abzuspeichern
results = [];

/**
 * Alle <section> ausblenden und die <section> mit der übergebenen ID anzeigen.
 * @param {string} idVisible ID der anzuzeigenden <section> 
 */
function switchVisibleSection(idVisible) {
  document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));

  let sectionElement = document.getElementById(idVisible);
  if (sectionElement) sectionElement.classList.remove("hidden");
}

function searchPage() {

  switchVisibleSection("searchPage");

  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = searchForm.search.value;

    try {
      const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
      const data = await response.json();

      if (data?.posts?.length > 0) {
        results = data.posts;
        location.hash = "/results";
      } else {
        showError("Keine Ergebnisse gefunden.");
      }
    } catch (error) {
      showError("Fehler beim Abrufen der Suchergebnisse.", error);
    }
  });
}

//Funktion für die Ergebnisseite
function resultsPage() {
  switchVisibleSection("resultPage");

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

    // Klick-Event für den Detail-Link hinzufügen
    resultItem.addEventListener("click", () => {
      navigateToDetail(result.id);
    });

    searchResults.appendChild(resultItem);
  });
  function navigateToDetail(id) {
    location.hash = `/detail/${id}`;
  }
  
  /*const resultPage = document.getElementById("resultPage");
  resultPage.classList.remove("hidden");*/
}

// Funktion für die Detailseite
async function detailPage(matches) {
  switchVisibleSection("detailPage");

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
    showError("Fehler beim Abrufen der Detaildaten.", error);
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
function showError(message, error) {
  if (error) console.error(error);
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = message;
}

// Event-Listener für das Laden der Seite und das Ändern der URL
window.addEventListener("DOMContentLoaded", router.handleRouting.bind(router));
window.addEventListener("hashchange", router.handleRouting.bind(router));