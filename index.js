

//Router konfigurieren und starten
window.addEventListener("load", () => {
  const router = new Router([
    {
      url: "^/$",
      show: searchPage,
    },
    {
      url: "^/results$",
      show: resultsPage,
    },
    {
      url: "^/detail/(.*)$",
      show: detailPage,
    }
  ]);
  
  router.start();  
});


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

//Funktion für die Suchseite (Startseite)
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

//Funktion um zur Detailseite navigieren zu können
function navigateToDetail(id) {
  location.hash = `/detail/${id}`;
}

// Funktion zum Zurücknavigieren zur Suchseite
function navigateToSearch() {
  location.hash = "/"; // oder die entsprechende Route für die Suchseite
}

// Event-Listener für den Zurück-Button
const backButton = document.getElementById("backButton");
if (backButton) {
  backButton.addEventListener("click", navigateToSearch);
}

//Funktion für die Ergebnisseite
function resultsPage() {
  switchVisibleSection("resultPage");

  const resultsTitle = document.getElementById("resultsTitle");
  const resultContainer = document.getElementById("resultContainer");

  resultsTitle.textContent = "Hier die passenden Ergebnisse (weitere Infos durch Auswählen eines Posts):";
  resultContainer.innerHTML = "";

  results.forEach((result) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    const title = document.createElement("h3");
    title.classList.add("result-title");
    title.textContent = result.title;

    const description = document.createElement("p");
    description.classList.add("result-description");
    description.textContent = result.description;

    resultItem.appendChild(title);
    resultItem.appendChild(description);

    // Klick-Event für den Detail-Link hinzufügen
    resultItem.addEventListener("click", () => {
      navigateToDetail(result.id);
    });

    resultContainer.appendChild(resultItem);
  });
  /*createBackButton(); // Button erstellen und anzeigen

  const resultPage = document.getElementById("resultPage");
  resultPage.classList.remove("hidden");*/

}
async function detailPage(matches) {
  switchVisibleSection("detailPage");

  const detailTitle = document.getElementById("detailTitle");
  const detailContent = document.getElementById("detailContent");
  const commentList = document.getElementById("commentList");

  const postId = matches[1];

  try {
    const postResponse = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await postResponse.json();

    const commentsResponse = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
    const commentsData = await commentsResponse.json();

    detailTitle.textContent = postData.title;
    detailContent.innerHTML = `
      <p>${postData.body}</p>
      <p>Tags: ${postData.tags.join(", ")}</p>
      <p>Nutzer-ID: ${postData.userId}</p>
      <p>Reaktionen: ${postData.reactions}</p>
    `;

    /*commentList.innerHTML = "";
    commentsData.forEach((comment) => {
      const commentItem = document.createElement("li");
      const commentId = document.createElement("p");
      commentId.textContent = `ID: ${comment.id}`;
      const commentBody = document.createElement("p");
      commentBody.textContent = `Body: ${comment.body}`;
      const commentUsername = document.createElement("p");
      commentUsername.textContent = `Benutzername: ${comment.user.username}`;

      commentItem.appendChild(commentId);
      commentItem.appendChild(commentBody);
      commentItem.appendChild(commentUsername);

      commentList.appendChild(commentItem);
    });*/
    commentList.innerHTML = "";
    commentsData.forEach((comment) => {
      const commentItem = document.createElement("li");
      commentItem.innerHTML = `
      <p>ID: ${comment.id}</p>
      <p>Body: ${comment.body}</p>
      <p>Benutzername: ${comment.user.username}</p> 
      `;
      //commentItem.textContent = comment.text;
      commentList.appendChild(commentItem);
    });

    createBackButton(); // Button erstellen und anzeigen
  } catch (error) {
    showError("Fehler beim Abrufen der Detaildaten.", error);
  }
}
//
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

// Funktion zum Anzeigen des Fehlercontainers
function showError(message, error) {
  const errorContainer = document.getElementById("errorContainer");
  const errorText = document.createElement("p");
  errorText.textContent = message;

  errorContainer.innerHTML = "";
  errorContainer.appendChild(errorText);

  // Fehlercontainer ein- oder ausblenden
  if (message) {
    errorContainer.style.display = "block";
  } else {
    errorContainer.style.display = "none";
  }
}