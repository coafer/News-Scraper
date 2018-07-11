module.exports = function(router){
    //home page
    router.get("/", function(req, res){
        res.render("home");
    });

    //Saved page
    router.get("/saved", function(req, res){
        res.render("/saved");
    });
} 