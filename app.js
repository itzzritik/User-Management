const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const clear = require('clear');
const git = require('simple-git/promise')();
const sql = require('mysql').createConnection(require("./sql"));


sql.connect((e) => {
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
                console.log("  > Changes Successfully Added to Stack");
            }, (failedAdd) => {
                console.log("  > Changes Adding Failed\n>  " + failedAdd);
            });
    git.commit(m)
        .then(
            (successCommit) => {
                console.log("  > Changes Successfully Commited\n   >  Message : \"" + m + "\"");
            }, (failed) => {
                console.log("  > Changes Commit Failed\n>  " + failed);
            });
    git.push('master', 'master')
        .then((success) => {
            console.log("  > Changes Successfully Pushed to Origin Master");
        }, (failed) => {
            console.log("  > Changes Push Failed\n>  " + failed);
        });
    res.send("1");
});

app.post("/login", function(req, res) {
    var email = req.body.email,
        pass = req.body.pass;
    console.log("\n" + ++call + ") Authentication Started\n  > Email: " + email);
    sql.query("SELECT password from userData WHERE emailId = \"" + email + "\"", function(e, result) {
        if (e) {
            res.send("0");
            console.log("  > Error occured while logging in :\n>  " + e);
        }
        else {
            if (result.length == 0) {
                res.send("2");
                console.log("  > Authentication Terminated : User doesn't exist");
            }
            else if (result[0].password == pass) {
                res.send("1");
                console.log("  > Authentication Successfull");
            }
            else {
                res.send("0");
                console.log("  > Authentication Terminated : Invalid Password");
            }
        }
    });
});
app.post("/signup", function(req, res) {
    var userdata = {
        userName: req.body.username,
        emailId: req.body.email,
        password: req.body.pass,
        phoneNo: req.body.ph,
        dateTime: new Date()
    };
    console.log("\n" + ++call + ") User Creation Started");
    sql.query("SELECT password from userData WHERE emailId = \"" + userdata.emailId + "\"", function(e, result) {
        if (e) {
            res.send("0");
            console.log("  > Error occured while logging in :\n>  " + e);
        }
        else {
            if (result.length == 0) {
                sql.query("INSERT INTO userData SET ?", userdata, function(e) {
                    if (e) {
                        res.send("0");
                        console.log("  > Error While Creating Account\n>  " + e);
                    }
                    else {
                        res.send("1");
                        console.log(userdata);
                    }
                });
            }
            else {
                res.send("2");
                console.log("  > Account Creation Terminated : User Already Exists");
            }
        }
    });
});

app.post("/profile", function(req, res) {
    var email = req.body.email,
        pass = req.body.pass;
    console.log("\n" + ++call + ") Profile Details Requested\n  > Email: " + email);
    sql.query("SELECT * from userData WHERE emailId = \"" + email + "\"", function(e, result) {
        if (e) {
            res.send("0");
            console.log("  > Error occured while fetching profile :\n>  " + e);
        }
        else {
            res.render("index", {
                login: 0,
                email: result[0].emailId,
                pass: pass,
                username: result[0].userName,
                ph: result[0].phoneNo
            });
        }
    });
});

app.post("/delete", function(req, res) {
    var email = req.body.email,
        pass = req.body.pass;
    console.log("\n" + ++call + ") Delete Account Requested\n  > Email: " + email);
    sql.query("SELECT password from userData WHERE emailId = \"" + email + "\"", function(e, result) {
        if (e) {
            res.send("0");
            console.log("  > Error occured while logging in :\n>  " + e);
        }
        else {
            if (result.length == 0) { res.send("0"); }
            else if (result[0].password == pass) {
                sql.query("DELETE FROM userData WHERE emailId = \"" + email + "\"", function(e, result) {
                    if (e) {
                        res.send("0");
                        console.log("  > Error occured while Deleting account :\n>  " + e);
                    }
                    else {
                        res.send("1");
                        console.log("  > Account successfully deleted");
                    }
                });
            }
            else { res.send("0"); }
        }
    });
});

app.get("/login", function(req, res) {
    res.render("index", { login: 1 });
});

app.get("/table", function(req, res) {
    console.log("\n" + ++call + ") Table Data Requested");
    sql.query("SELECT * from userData ", function(e, result) {
        if (e) {
            res.send("0");
            console.log("  > Error occured while fetching table :\n>  " + e);
        }
        else {
            var output = "";
            for (var i = 0; i < result.length; i++) {
                output += "<br>============================================================";
                output += "<br>Username > " + result[i].userName;
                output += "<br>Email > " + result[i].emailId;
                output += "<br>Password > " + result[i].password;
                output += "<br>Phone No. > " + result[i].phoneNo;
                output += "<br>Timestamp > " + result[i].dateTime;
                output += "<br>============================================================";
            }
            res.send(output);
        }
    });
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
