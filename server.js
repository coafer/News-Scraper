//require dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//set up ports to remote host on Heroku or local
var PORT = process.env.PORT || 3000;

//Instantiate express app
var app = express();
//Instantiate express router
var router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connecting Mongoose to our database
mongoose.connect(
  MONGODB_URI,
  function(error) {
    //Log any errors if exist
    if (error) {
      console.log(error);
    }
    //Log successful connection
    else {
      console.log("mongoose connection was successful");
    }
  }
);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
