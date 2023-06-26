require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')


const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());

app.use(passport.session());


const uri = "mongodb://127.0.0.1:27017/userDB";

main().catch(err => console.log("database connection error", err));

async function main(){
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connection success with database !");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});




passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken);
    User.findOrCreate({ googleId: profile.id }, {email:profile.displayName, username:profile.displayName}, function (err, user) {
        return cb(err, user);
    });
  }
));



app.use(passport.initialize());
app.use(passport.session());



app.get("/", (req, res) => {
    res.render("home");
});


app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
);


app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });


app.get("/register", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/secrets");
    }else{
        res.render("register");
    }
});


app.get("/login", (req, res) => {

    if(req.isAuthenticated()){
        res.redirect("/secrets");
    }else{
        res.render("login");
    }
});

app.get("/secrets", async (req, res) => {
    // Get all users with a secret
    const usersWithSecret = await User.find({ "secret": { "$ne": null } });
  
    // Render the secrets view with the list of users
    res.render("secrets", { usersWithSecrets : usersWithSecret });
});



app.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) {
          console.log('Error occurred during logout:', err);
        }
        res.redirect('/');
      });
  });



app.get("/submit", async (req, res) => {
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
});





app.post("/register", async (req,res) => {
    User.register({username: req.body.username}, req.body.password, async function(err, savedUser){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    })
});




app.post("/login", async (req,res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
      });
    
      req.login(user, function(err){
        if (err) {
          console.log(err);
        } else {
          passport.authenticate("local")(req, res, function(){
            res.redirect("/secrets");
          });
        }
      });
});



app.post("/submit", async (req, res) => {
    const submittedSecret = req.body.secret;
  
    const foundUser = await User.findById(req.user.id);
  
    if (!foundUser) {
      res.status(404).send("User not found");
      return;
    }
  
    foundUser.secret = submittedSecret;
    await foundUser.save();
  
    res.redirect("/secrets");
  });





app.listen(PORT, () => {
    console.log("server started at port :", PORT);
});




