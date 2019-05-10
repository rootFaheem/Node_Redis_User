const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

// set PORT
const PORT = 5000;

// Initialize express app
const app = express();

// set ciew engine to Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// set body-parser to work with body of req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set method override
app.use(methodOverride("_method"));

app.get("/", (req, res, next) => {
    res.render("searchUsers");
});

app.listen(PORT, () => console.log("server running at port: " + PORT));
