//Server routes

//Bring the scrape function
var scrape = require("../scripts/scrape");

//Bring headline and notes from the controllers
var headLineController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router){
    //home page
    router.get("/", function(req, res){
        res.render("home");
    });

    //Saved page
    router.get("/saved", function(req, res){
        res.render("/saved");
    });

    router.get("/api/fetch", function(req, res){
        headLineController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0){
                rs.json({
                    message: "No new articles today. Check out later"
                });
            } else {
                res.json({
                    message: "Added" + docs.insertedCount + "new artcles"
                });
            }
        });
    });

    router.get("/api/headlines", function(req, res){
        var query = {};
        if (req.query.saved){
            query = req.query;
        }

        headLineController.get(query, function(data){
            res.json(data);
        });
    });

    router.delete("/api/healines/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        headLineController.delete(query, function(err, data){
            res.json(data);
        });
    });

    router.patch("/api/headlines", function(req, res){
        headLineController.update(req.body, function(err, data){
            res.json(data);
        })
    });

    router.get("/api/notes/:headline_id?", function(req, res){
        var query ={};
        if (req.params.headline_id){
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        })
    });

    router.delete("/api/notes/:id", function(req, res){
        var query ={};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        })
    })
} 