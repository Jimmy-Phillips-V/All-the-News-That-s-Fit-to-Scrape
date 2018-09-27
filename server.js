var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")
// Initialize Express
var app = express();
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}))
app.set("view engine", "handlebars")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");
var Article = require("./models/article")
var Comments = require("./models/comments")

var PORT = 3000;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/week18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.npr.org/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var array = []
    // console.log(response.data)
    // Now, we grab every h3 within an article tag, and do the following:
    $("h3.title").each(function(i, element) {
      // Save an empty result object
      var result = {};
      console.log(element)

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .text();
      result.link = $(this)
        .parent("a")
        .attr("href");
      result.teaser = $(this)
        .parent("a")
        .attr("href")

      array.push(result)

      var article = new Article(result)
      article.save()
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send(array);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/", function(req, res) {
  Article.find().then(function(data){
    res.render("index", { items: data })
  })
});


app.post("/add-comment", function(req, res){
    res.send(comment)
    var comment = new Comments (req.body)
    comment.save()
})

app.get("/comments", function(req, res) {
  Comments.find().then(function(data){
    res.send(data)
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
