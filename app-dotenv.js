//jshint esversion:6

//added
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

 console.log(process.env.API_KEY);  //get API_KEY from .env file. this is declaration rule.

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true});

//Changes
 const userSchema = new mongoose.Schema({
   email : String,
   password: String
 });

//added
 userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  });

//For multiple field
 //userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password", "Name"]  });


 const User = new mongoose.model("User", userSchema);


app.get("/",  function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
