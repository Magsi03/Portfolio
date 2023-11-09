// Router konfigurieren und starten
window.addEventListener("load", () => {
  const searchForm = document.getElementById("searchForm");
  const hintTextContainer = document.getElementById("hintTextContainer");
  const hinweisText = document.getElementById("Hinweistext");
  const untererText = document.getElementById("untererText");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchTerm = searchForm.search.value.trim();
    if (searchTerm !== "") {
      console.log("Suchbegriff:", searchTerm);
      searchPage(searchTerm);
      hintTextContainer.style.display = "none";
      untererText.style.display = "none";
    }
  });

  const router = new Router([
    {
      url: "^/$",
      show: () => searchPage(""),
    },
    {
      url: "^/detail/(.*)$",
      show: detailPage,
    },
  ]);

  router.start();

  // Initial anzeigen
  hintTextContainer.style.display = "block";
  hinweisText.style.display = "block";
  untererText.style.display = "block";
});


// Funktion um zur Detailseite zu navigieren
function navigateToDetail(id) {
  location.hash = `/detail/${id}`;
}


// Alle <section> ausblenden und die <section> mit der übergebenen ID anzeigen.
// @param {string} idVisible ID der anzuzeigenden <section> 
function switchVisibleSection(idVisible) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });

  let sectionElement = document.getElementById(idVisible);
  if (sectionElement) sectionElement.classList.remove("hidden");
}


// Funktion für die Suchseite (Startseite)
async function searchPage(searchTerm) {
  console.log("Suchseite aufgerufen");
  switchVisibleSection("searchPage");

  // Prüfen ob ein Suchbegriff eingegeben wurde
  if (!searchTerm) return;

  // Suchergebnis- und Fehler-Container erstellen
  const searchResultsContainer = document.getElementById("searchResults");
  const errorContainer = document.getElementById("errorContainer");

  try {
    searchResultsContainer.innerHTML = ""; // Vorherige Suchergebnisse entfernen

    // Fetchen, in API suchen
    const response = await fetch(
      `https://dummyjson.com/posts/search?q=${searchTerm}`
    );
    const data = await response.json();

    if (data?.posts?.length > 0) {
      errorContainer.innerHTML = ""; // Fehlercontainer leeren
      errorContainer.style.display = "none"; // Fehlercontainer ausblenden

      // Schleife über die Suchergebnisse um sie zum Container hinzuzufügen
      data.posts.forEach((post) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");

        const title = document.createElement("h3");
        title.classList.add("result-title");
        title.textContent = post.title;

        resultItem.appendChild(title);

        // Klick-Event für den Detail-Link hinzufügen
        resultItem.addEventListener("click", () => {
          console.log("Detail-Link geklickt");
          navigateToDetail(post.id);
        });

        searchResultsContainer.appendChild(resultItem);
      });
    } else {
      showError("Keine Ergebnisse gefunden  😕");
    }
  } catch (error) {
    showError("❗️ Fehler beim Abrufen der Suchergebnisse ❗️", error);
  }
}

// Funktion für die Detailseite
async function detailPage(matches) {
  console.log("detailPage aufgerufen");
  switchVisibleSection("detailPage");

  const detailTitle = document.getElementById("postTitle");
  const detailContent = document.getElementById("postContent");
  const commentList = document.getElementById("commentList");

  // PostId aus URL entnehmen und abspeichern
  const postId = matches[1];

  try {
    // Post laden
    const postResponse = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await postResponse.json();

    // Post anzeigen
    detailTitle.textContent = "Post " + postData.id + ": " + postData.title;
    detailContent.innerHTML = `
      <p>${postData.body}</p>
      <p>Tags: ${postData.tags.join(", ")}</p>
      <p>Nutzer-ID: ${postData.userId}</p>
      <p>Reaktionen: ${postData.reactions}</p>
    `;

    // Laden der Kommentare
    const commentsResponse = await fetch(
      `https://dummyjson.com/posts/${postId}/comments`
    );
    const commentsData = await commentsResponse.json();
    console.log(commentsData);
    const comments = commentsData.comments;

    // Vorhandene Kommentare aus der commentList entfernen
    commentList.innerHTML = "";

    // Schleife über die Kommentare
    if (comments.length > 0) {
      for (const comment of comments) {
        // Anfrage an die Benutzerdaten hinzufügen
        const userResponse = await fetch(
          `https://dummyjson.com/users/filter?key=username&value=${comment.user.username}`
        );
        const userData = await userResponse.json();
        console.log(userData);

        // Kommentar-Element erstellen
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment-item");

        // Kommentar-ID anzeigen
        const commentId = document.createElement("p");
        commentId.textContent = `Kommentar ${comment.id}:`;
        commentItem.appendChild(commentId);

        // Kommentartext anzeigen
        const commentText = document.createElement("p");
        commentText.textContent = comment.body;
        commentItem.appendChild(commentText);

        // Benutzername anzeigen
        const username = document.createElement("p");
        username.textContent = `User: ${comment.user.username}`;
        commentItem.appendChild(username);

        // Benutzerbild anzeigen, wenn verfügbar
        if (userData.users.length > 0 && userData.users[0].image) {
          const userImage = document.createElement("img");
          userImage.src = userData.users[0].image;
          userImage.alt = "Benutzerbild";
          userImage.classList.add("userImg");
          commentItem.appendChild(userImage);
        } else {
          // Wenn kein Benutzerbild gefunden wurde, eine Meldung anzeigen
          const noUserImage = document.createElement("p");
          noUserImage.textContent = "Kein Benutzerbild verfügbar";
          commentItem.appendChild(noUserImage);
        }

        // Kommentar-Element zur Liste hinzufügen
        commentList.appendChild(commentItem);
      }
    } else {
      // Wenn keine Kommentare verfügbar sind, eine Meldung anzeigen
      const noCommentsMessage = document.createElement("p");
      noCommentsMessage.textContent = "Dieser Post hat keine Kommentare";
      commentList.appendChild(noCommentsMessage);
    }
  } catch (error) {
    showDetailError("❗️ Fehler beim Abrufen der Detaildaten ❗️", error);
  }
}

// Funktion zum Anzeigen des Fehlercontainers
function showError(message, error) {
  console.error("Fehler:", message, error);
  const errorContainer = document.getElementById("errorContainer");
  const errorText = document.createElement("p");
  errorText.textContent = message;

  errorContainer.innerHTML = "";
  errorContainer.appendChild(errorText);

  // Fehlercontainer ein- oder ausblenden
  errorContainer.style.display = message ? "block" : "none";
}

// Funktion zum Anzeigen des Detailfehler-Containers
function showDetailError(message, error) {
  console.error("Fehler:", message, error);
  const detailErrorContainer = document.getElementById("detailErrorContainer");
  const errorText = document.createElement("p");
  errorText.textContent = message;

  detailErrorContainer.innerHTML = "";
  detailErrorContainer.appendChild(errorText);

  // Fehlercontainer ein- oder ausblenden
  detailErrorContainer.style.display = message ? "block" : "none";
}