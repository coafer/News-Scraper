$(document).ready(function() {
  var articleContainer = $(".article-container");

  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  //Run the init page function
  initPage();

  function initPage() {
    //Empty the article container, run an Ajax request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      //if there are headlines render them
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    //Appends HTML containing the article data to de the page
    //The array goes with a JSON containing all available articles in the db
    var articlePanels = [];
    //We pass ecah article to createPanels function wich returns a bootstrap panel with the aricles inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }

  function handleArticleDelete() {
    var articleToDelete = $(this)
      .parents(".panel")
      .data();

    $.ajax({
      method: "DELETE",
      url: "/api/headlines" + articleToDelete._id
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    //this function handle openning the notes modal and displaying our notes
    var currentArticle = $(this)
      .parents(".panel")
      .data();
    //grab any note withi this id
    $.get("/api/notes" + currentArticle._id).then(function(data) {
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes for article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");

      botbox.dialog({
        message: modalText,
        closeButton: true
      });

      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

      $(".btn.save").data("article", noteData);

      renderNotesList(noteData);
    });
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        "No notes for this article",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    } else {
      for (let i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>Close</button>",
            "</li>"
          ].join("")
        );
        currentNote.children("button").data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    $(".note-container").append(notesToRender);
  }

  function createPanel(article) {
    //this function construct a jQuery element for the articles panel
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    //We attach the article's id to the jQuery element
    panel.data("_id", article._id);
    //we return the constructed panel jQuery element
    return panel;
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
      });
    }
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>We don't have any new artcles</h4>",
        "</div>"
      ].join("")
    );

    articleContainer.append(emptyAlert);
  }
});

function handleNoteDelete() {
  var noteToDelete = $(this).data("_id");
  $.ajax({
    url: "/api/notes/" + noteToDelete,
    method: "DELETE"
  }).then(function() {
    bootbox.hideAll();
  });
}
