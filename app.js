require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect('mongodb://localhost/userDB', {useUnifiedTopology: true, useNewUrlParser: true});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result === true) {
          res.render("secrets");
        } else {
          res.redirect("/login");
        }
      });
    }
  });
});





app.listen(3000, function(){
  console.log("Succesfully started the server");
})
