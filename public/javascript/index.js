$(document).ready(function(){
    //Setting the container for articles
    var articleContainer = $(".article-container");
    //Add event listeners for saving and scraping
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    //Run the init page function
    initPage();

    function initPage(){
        //Empty the article container, run an Ajax request for any unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data){
                //if there are headlines render them
                if (data && data.length){
                    renderArticles(data);
                } else {
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles){
        //Appends HTML containing the article data to de the page
        //The array goes with a JSON containing all available articles in the db
        var articlePanels = [];
        //We pass ecah article to createPanels function wich returns a bootstrap panel with the aricles inside
        for (var i = 0; i < articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article){
        //this function construct a jQuery element for the articles panel
        var panel = 
        $(["<div class='panel panel-default'>",
          "<div class='panel-heading'>", "<h3>",
        article.headline,
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"].join(""));
        //We attach the article's id to the jQuery element
        panel.data("_id", article._id);
        //we return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty(){
        var emptyAlert = 
            $([
                "<div class='alert alert-warning text-center'>",
                "<h4>We don't have any new artcles</h4>",
                "</div>"
            ].join(""));

        articleContainer.append(emptyAlert);
    }

    function handleArticleSave(){
        //This function is triggered when the user wants to save an article
        //When we rendered the article we attached a javascript object containing the headline id
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        //Using the patch method to be semantic since this is an update to an existing record
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data){
            if(data.ok){
                initPage();
            }
        });
    }

    function handleArticleScrape(){
        $.get("/api/fetch")
        .then(function(data){
            initPage();
            botbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
        });
    }
})