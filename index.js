$(document).ready(function() {
    // Das DOM ist bereit, um mit JavaScript zu interagieren
  
    // Event-Handler für das Absenden des Formulars
    $('form').submit(function(event) {
      event.preventDefault(); // Verhindert das Neuladen der Seite nach dem Absenden des Formulars
  
      var searchQuery = $('input[name="search"]').val(); // Suchbegriff aus dem Eingabefeld abrufen
  
      searchPosts(searchQuery);
    });
  
    // Funktion zum Suchen der Posts
    function searchPosts(searchQuery) {
      // AJAX-Anfrage an die Dummy JSON-API senden
      $.ajax({
        url: 'https://dummyjson.com/api/posts',
        method: 'GET',
        dataType: 'json',
        data: { search: searchQuery },
        success: function(response) {
            // Erfolgreiche Antwort von der API erhalten -> Ergebnisse anzeigen
            var posts = response.posts;
          
            // Container für die Suchergebnisse
            var searchResultsContainer = $('#searchResults');
            searchResultsContainer.empty(); // Vorherige Suchergebnisse löschen
          
            // Schleife über die gefundenen Posts
            for (var i = 0; i < posts.length; i++) {
              var post = posts[i];
          
              // HTML-Elemente für den Post und seine Kommentare erstellen
              var postElement = $('<div class="post"></div>');
              var postTitle = $('<h2>' + post.title + '</h2>');
              var postContent = $('<p>' + post.content + '</p>');
          
              // Füge den Post-Titel und den Inhalt zum Post-Element hinzu
              postElement.append(postTitle);
              postElement.append(postContent);
          
              // Überprüfe, ob der Post Kommentare hat
              if (post.comments && post.comments.length > 0) {
                var commentsContainer = $('<div class="comments"></div>');
          
                // Schleife über die Kommentare des Posts
                for (var j = 0; j < post.comments.length; j++) {
                  var comment = post.comments[j];
                  var commentElement = $('<div class="comment"></div>');
                  var commentText = $('<p>' + comment.text + '</p>');
          
                  // Füge den Kommentar zum Kommentar-Element hinzu
                  commentElement.append(commentText);
                  commentsContainer.append(commentElement);
                }
          
                // Füge den Kommentar-Container zum Post-Element hinzu
                postElement.append(commentsContainer);
              }
          
              // Füge den fertigen Post zur Suchergebnis-Anzeige hinzu
              searchResultsContainer.append(postElement);
            }
          },
          error: function() {
            // Fehler beim Abrufen der Daten von der API
            // Hier wird eine Fehlermeldung auf der Webseite angezeigt
            var errorMessage = $('<p>Es ist ein Fehler beim Abrufen der Daten aufgetreten. Bitte versuchen Sie es später erneut.</p>');
            $('#errorContainer').empty().append(errorMessage);
          }
      });
    }
  
    // Funktion zum Anzeigen der Suchergebnisse
    function showSearchResults(posts) {
      var searchResultsContainer = $('#searchResults');
      searchResultsContainer.empty(); // Vorherige Suchergebnisse löschen
  
      // Schleife über die gefundenen Posts
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
  
        // HTML-Elemente für den Post und seine Kommentare erstellen
        var postElement = $('<div class="post"></div>');
        var postTitle = $('<h2>' + post.title + '</h2>');
        var postContent = $('<p>' + post.content + '</p>');
  
        // Füge den Post-Titel und den Inhalt zum Post-Element hinzu
        postElement.append(postTitle);
        postElement.append(postContent);
  
        // Überprüfe, ob der Post Kommentare hat
        if (post.comments && post.comments.length > 0) {
          var commentsContainer = $('<div class="comments"></div>');
  
          // Schleife über die Kommentare des Posts
          for (var j = 0; j < post.comments.length; j++) {
            var comment = post.comments[j];
            var commentElement = $('<div class="comment"></div>');
            var commentText = $('<p>' + comment.text + '</p>');
  
            // Füge den Kommentar zum Kommentar-Element hinzu
            commentElement.append(commentText);
            commentsContainer.append(commentElement);
          }
  
          // Füge den Kommentar-Container zum Post-Element hinzu
          postElement.append(commentsContainer);
        }
  
        // Füge den fertigen Post zur Suchergebnis-Anzeige hinzu
        searchResultsContainer.append(postElement);
      }
    }
  });