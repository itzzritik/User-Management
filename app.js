const express = require("express"), app = express(),
      bodyparser = require("body-parser"),
      git = require('simple-git/promise')(), ip = require("ip"),
      sqlCon = require('express-myconnection');

require('dotenv').config();

let dbOptions = {
  host : process.env.host,
  port : process.env.port,
  user : process.env.user,
  password : process.env.password,
  database : process.env.database,
},
    call = 0;

app.use(sqlCon(require('mysql'), dbOptions, 'pool'));
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/git", function(req, res) {
  var m = req.query.m;
  console.log("\n" + ++call + ") " +
              "Pushing to Github");
  git.add('.').then(
      (addSuccess) => {
        console.log(">  Changes Successfully Added to Stack");
      },
      (failedAdd) => {
        console.log(">  Changes Adding Failed\n   >  " + failedAdd);
      });
  git.commit(m).then(
      (successCommit) => {
        console.log(">  Changes Successfully Commited\n   >  Message : \"" + m +
                    "\"");
      },
      (failed) => { console.log(">  Changes Commit Failed\n>  " + failed); });
  git.push('master', 'master')
      .then(
          (success) => {
            console.log(">  Changes Successfully Pushed to Origin Master");
          },
          (failed) => {
            console.log(">  Changes Push Failed\n   >  " + failed);
          });
  res.send("1");
});

app.post("/login", function(req, res) {
  var email = req.body.email, pass = req.body.pass;
  console.log("\n" + ++call + ") " +
              "Authentication Started\n   >  Email: " + email);
  req.getConnection(function(error, sql) {
    sql.query(
        "SELECT password FROM userData WHERE emailId = \"" + email + "\"",
        function(e, result, fields) {
          if (e) {
            res.send("0");
            console.log(">  Error occured while logging in :\n   >  " + e);
          } else {
            if (result.length == 0) {
              res.send("2");
              console.log(">  Authentication Terminated : User doesn't exist");
            } else if (result[0].password == pass) {
              res.send("1");
              console.log(">  Authentication Successfull");
            } else {
              res.send("0");
              console.log(">  Authentication Terminated : Invalid Password");
            }
          }
        });
  });
});
app.post("/signup", function(req, res) {
  var userdata = {
    userName : req.body.username,
    emailId : req.body.email,
    password : req.body.pass,
    phoneNo : req.body.ph
  };
  console.log("\n" + ++call + ") " +
              "User Creation Started");
  req.getConnection(function(error, sql) {
    sql.query(
        "SELECT password FROM userData WHERE emailId = \"" + userdata.emailId +
            "\"",
        function(e, result, fields) {
          if (e) {
            res.send("0");
            console.log(">  Error occured while logging in :\n   >  " + e);
          } else {
            if (result.length == 0) {
              sql.query("INSERT INTO userData SET ?", userdata, function(e) {
                if (e) {
                  res.send("0");
                  console.log(">  Error While Creating Account\n   >  " + e);
                } else {
                  res.send("1");
                  console.log(userdata);
                }
              });
            } else {
              res.send("2");
              console.log(
                  ">  Account Creation Terminated : User Already Exists");
            }
          }
        });
  });
});

app.post("/profile", function(req, res) {
  var email = req.body.email, pass = req.body.pass;
  console.log("\n" + ++call + ") " +
              "Profile Details Requested\n   >  Email: " + email);
  req.getConnection(function(error, sql) {
    sql.query("SELECT * FROM userData WHERE emailId = \"" + email + "\"",
              function(e, result, fields) {
                if (e) {
                  res.send("0");
                  console.log(
                      ">  Error occured while fetching profile :\n   >  " + e);
                } else {
                  res.render("index", {
                    login : 0,
                    email : result[0].emailId,
                    pass : pass,
                    username : result[0].userName,
                    ph : result[0].phoneNo
                  });
                }
              });
  });
});

app.post("/delete", function(req, res) {
  var email = req.body.email, pass = req.body.pass;
  console.log("\n" + ++call + ") " +
              "Delete Account Requested\n   >  Email: " + email);
  req.getConnection(function(error, sql) {
    sql.query(
        "SELECT password FROM userData WHERE emailId = \"" + email + "\"",
        function(e, result, fields) {
          if (e) {
            res.send("0");
            console.log(">  Error occured while logging in :\n   >  " + e);
          } else {
            if (result.length == 0) {
              res.send("0");
            } else if (result[0].password == pass) {
              sql.query(
                  "DELETE FROM userData WHERE emailId = \"" + email + "\"",
                  function(e, result) {
                    if (e) {
                      res.send("0");
                      console.log(
                          ">  Error occured while Deleting account :\n   >  " +
                          e);
                    } else {
                      res.send("1");
                      console.log(">  Account successfully deleted");
                    }
                  });
            } else {
              res.send("0");
            }
          }
        });
  });
});

app.post("/table", function(req, res) {
  console.log("\n" + ++call + ") " +
              "User Data Requested in Admin Panel");
  req.getConnection(function(error, sql) {
    sql.query("SELECT * FROM userData ORDER BY dateTime", function(e, result,
                                                                   fields) {
      if (e) {
        res.send("0");
        console.log("  > Error occured while fetching table :\n   >  " + e);
      } else {
        res.json(result);
        console.log("  > Fetched and sent successfully");
      }
    });
  });
});

app.post("/admin", function(req, res) { res.render("admin"); });

app.get("/login", function(req, res) { res.render("index", {login : 1}); });

app.get("*", function(req, res) { res.redirect("login"); });

app.listen(process.env.PORT || 8080, function() {
  console.log("\033c");
  console.log("\n" + ++call + ") " +
              "Starting Server");
  console.log(">  Server is running at http://" +
              (ip.address() || "localhost") + ":" +
              (process.env.PORT || "8080"));
});
