//jshint esversion:6
const express = require("express");
const app = express();
const parser = require("body-parser");
const mongoose=require("mongoose");
const enc=require("mongoose-encryption");
require('dotenv').config();
app.use(parser.urlencoded({  extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect('mongodb://localhost:27017/secretDB', {useNewUrlParser: true, useUnifiedTopology: true});

const secretSchema= new mongoose.Schema({
  username:{type:String,required:[true,"Give a title"]},
  password:{type:String,required:[true,"Supply Content"]}
});

const secret = process.env.SECRET;

 secretSchema.plugin(enc, { secret:secret, encryptedFields: ['password'] });
const User= mongoose.model("User",secretSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req,res){
  res.render("login");
});

app.get("/submit",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
User.findOne({username:req.body.username},function(err,doc){
  if(doc){
    if(req.body.password===doc.password){
      console.log(doc.password)
      res.render("secrets",{});
    }
  }
});
});

app.post("/register",function(req,res){
  console.log(req.body.password);
const newUser=new User({username:req.body.username,password:req.body.password});
newUser.save().then(function(){

    res.redirect("/login");

});
});




app.listen(3000,function(){
  console.log("server listening on port 3000");
});
