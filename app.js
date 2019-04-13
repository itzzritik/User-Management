var mysql = require('mysql');
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const clear = require('clear');
const git = require('simple-git/promise')();

var connection = mysql.createConnection({
    host: 'db-intern.ciupl0p5utwk.us-east-1.rds.amazonaws.com',
    user: 'dummyUser',
    password: 'dummyUser01',
    database: 'db_intern'
});
connection.connect((e) => {
    if (e) { console.log(">  Connection Failed \n>  " + e); return; }
    console.log(">  Connection Established");
});

var call = 0;
app.set("view engine", "ejs");
app.use('/public', express.static('public'));


app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/git", function(req, res) {
    var m = req.query.m;
    console.log("\n" + ++call + ") Pushing to Github");
    git.add('.')
        .then(
            (addSuccess) => {
                console.log(">  Changes Successfully Added to Stack");
            }, (failedAdd) => {
                console.log(">  Changes Adding Failed\n>  " + failedAdd);
            });
    git.commit(m)
        .then(
            (successCommit) => {
                console.log(">  Changes Successfully Commited\n   >  Message : \"" + m + "\"");
            }, (failed) => {
                console.log(">  Changes Commit Failed\n>  " + failed);
            });
    git.push('master', 'master')
        .then((success) => {
            console.log(">  Changes Successfully Pushed to Origin Master");
        }, (failed) => {
            console.log(">  Changes Push Failed\n>  " + failed);
        });
    res.send("1");
});

app.post("/login", function(req, res) {
    var email = req.body.email,
        pass = req.body.pass;
});
app.post("/signup", function(req, res) {
    console.log("\n" + ++call + ") User Creation Started");
});

app.get("/login", function(req, res) {
    res.render("login", { login: 1 });
});
app.get("*", function(req, res) {
    res.redirect("login");
});

app.listen(8080, function() {
    clear();
    console.log("\n" + ++call + ") Starting Server");
    console.log(">  Server is Listening");
    console.log("\n" + ++call + ") Connection to MySQL Server");
});
