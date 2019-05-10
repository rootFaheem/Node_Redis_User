const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

// Creating Redis client
const client = redis.createClient();

client.on("connect", () => {
    console.log("redis connected");
});

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

// search page
app.get("/", (req, res, next) => {
    res.render("searchUsers");
});

// search processing
app.post("/user/search", (req, res, next) => {
    let id = req.body.id;

    client.hgetall(id, (err, obj) => {
        if (!obj) {
            res.render("searchUsers", {
                error: "user does not exists"
            });
        } else {
            obj.id = id;
            res.render("details", {
                user: obj
            });
        }
    });
});

// add user form
app.get("/user/add", (req, res, next) => {
    res.render("addusers");
});

// add user processing
app.post("/user/add", (req, res, next) => {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hmset(
        id,
        [
            "first_name",
            first_name,
            "last_name",
            last_name,
            "email",
            email,
            "phone",
            phone
        ],
        (err, reply) => {
            if (err) {
                console.log(err);
            }
            console.log(reply);
            res.redirect("/");
        }
    );
});

app.delete("/user/delete/:id", (req, res, next) => {
    client.del(req.params.id);
    res.redirect("/");
});

app.listen(PORT, () => console.log("server running at port: " + PORT));
