//Router konfigurieren und starten
window.addEventListener("load", () => {
  const router = new Router([{
      url: "^/$",
      show: searchPage,
    },
    {
      url: "^/detail/(.*)$",
      show: detailPage,
    },
  ]);

  router.start();
  searchPage();
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


//Funktion um zur Detailseite navigieren zu können
function navigateToDetail(id) {
  location.hash = `/detail/${id}`;
}


//Funktion für die Suchseite (Startseite)
function searchPage() {
  switchVisibleSection("searchPage");

  const searchForm = document.getElementById("searchForm");
  const searchResultsContainer = document.getElementById("searchResults");
  const errorContainer = document.getElementById("errorContainer");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = searchForm.search.value;

    try {

      searchResultsContainer.innerHTML = ""; //vorherige Suchergebnisse entfernen

      const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
      const data = await response.json();

      if (data?.posts?.length > 0) {

        const searchResultsContainer = document.getElementById("searchResults");
        errorContainer.innerHTML = ""; // Leeren Sie den Fehlercontainer
        errorContainer.style.display = "none"; // Verstecken Sie den Fehlercontainer

        // Schleife über die Suchergebnisse um sie zum Container hinzuzufügen
        data.posts.forEach((post) => {
          const resultItem = document.createElement("div");
          resultItem.classList.add("result-item");

          const title = document.createElement("h3");
          title.classList.add("result-title");
          title.textContent = post.title;

          const description = document.createElement("p");
          description.classList.add("result-description");
          description.textContent = post.description;

          resultItem.appendChild(title);
          resultItem.appendChild(description);

          // Klick-Event für den Detail-Link hinzufügen
          resultItem.addEventListener("click", () => {
            navigateToDetail(post.id);
          });

          searchResultsContainer.appendChild(resultItem);
        });

        switchVisibleSection("searchPage"); // Zeigen Sie die Suchergebnisse an
      } else {
        showError("Keine Ergebnisse gefunden.");
      }
    } catch (error) {
      showError("Fehler beim Abrufen der Suchergebnisse.", error);
    }
  });
}

async function detailPage(matches) {
  switchVisibleSection("detailPage");

  const detailTitle = document.getElementById("detailTitle");
  const detailContent = document.getElementById("detailContent");

  const postId = matches[1];

  try {
    const postResponse = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await postResponse.json();

    detailTitle.textContent = postData.title;
    detailContent.innerHTML = `
    <p>Post ${postData.id}:</p> 
    <p>${postData.body}</p>
      <p>Tags: ${postData.tags.join(", ")}</p>
      <p>Nutzer-ID: ${postData.userId}</p>
      <p>Reaktionen: ${postData.reactions}</p>
      <p></p>
    `;


    // Laden der Kommentare
    const commentsResponse = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
    const commentsData = await commentsResponse.json();
    const comments = commentsData.comments;

    console.log(commentsData);
    console.log(comments);

    if (comments.length > 0) {

      const commentList = document.getElementById("commentList");
      commentList.innerHTML = "";

      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment-item");
        commentItem.innerHTML = `
      <p>Kommentar ${comment.id}:</p>
      <p> ${comment.body}</p>
      <p>von: ${comment.user.username}</p>
      `;
        commentList.appendChild(commentItem);
      });
    } else {
      const commentList = document.getElementById("commentList");
      commentList.innerHTML = "";

      const noCommentsMessage = document.createElement("p");
      noCommentsMessage.textContent = "Dieser Post hat keine Kommentare.";
      commentList.appendChild(noCommentsMessage);
    }

  } catch (error) {
    showDetailError("Fehler beim Abrufen der Detaildaten.", error);
  }
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

