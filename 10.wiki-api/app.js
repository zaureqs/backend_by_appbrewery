const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));


const uri = "mongodb://127.0.0.1:27017/wikiDB";

main().catch(err => console.log("database connection error", err));

async function main(){
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connection success with database !");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const articleSchema = {
    title: String,
    content:String
};

const Article = mongoose.model("Article", articleSchema);






app.route("/articles").get( async (req, res) => {
    try {
        const articles = await Article.find({});
        console.log('Total Items count is : ', articles.length);
        res.send(articles);
    } catch (error) {
        console.log("there is an error ",error);
        res.send("there is an internal server error :(");
    }
}).post(async (req, res) => {
    
    try {
        const newArticle = Article({
            title: req.body.title,
            content: req.body.content
          });
      
          const savedArticle = await newArticle.save();
          console.log('Item created:', savedArticle);
          res.send("article posted");
    } catch (error) {
        console.log("error found");
        res.send("internal server error");
    }
}).delete(async (req, res) => {

    try {
        const articles = await Article.find({});
        articles.forEach(async (article) => {
            await article.deleteOne();
        });
        res.send("Successfully deleted all the articles in wikiDB.");
    } catch (error) {
        console.log(error);
        res.send("there is an error ");
    }
});







app.listen(PORT, () => {
    console.log("server started on port :",PORT);
})