const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const day = require(__dirname +"/getdate");



const app = express();
const PORT = 3300;


const uri = "mongodb://127.0.0.1:27017/todolistDB";
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));


main().catch(err => console.log("database connection error", err));


async function main(){
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connection success with database !");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
  



const itemsSchema = {
    Name:String,
}


const Item = mongoose.model("Item",itemsSchema);




listSchema = {
    Name:String,
    items: [itemsSchema],
}


const List = mongoose.model("List", listSchema);



app.get("/", async (req, res) => {
    try {
      let list_items = await readItems();
      res.render("list", { listTitle: day.currDate(), items: list_items });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});




app.get("/lists/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists", { listTitle: "All Lists", items: lists });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
});



app.get("/about", (req, res) => {
    res.render("about");
});



app.get("/lists/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    try {
      const foundList = await List.findOne({ Name: customListName });
  
        if (!foundList) {
        //create a new list
            const list = new List({
                Name: customListName,
                items: [],
            });
            list.save();
            res.redirect("/lists/"+customListName);
        } else {
            res.render("customList",{listTitle: foundList.Name, items: foundList.items});
        }

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});





app.post("/",async (req,res)=>{

    const newItem = req.body.newItem;
    createItem(newItem).catch(err => {console.log(err)});
    res.redirect("/");  
});


app.post("/lists/",async (req,res)=>{
    const customListName = _.capitalize(req.body.newItem);
    console.log(customListName);
    try {
      const foundList = await List.findOne({ Name: customListName });
  
        if (!foundList) {
        //create a new list
            const list = new List({
                Name: customListName,
                items: [],
            });
            list.save();
            
        }
        res.redirect("/lists/");

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});





app.post("/lists/customList", (req,res) => {

    const newItem = req.body.newItem;
    const listName = req.body.list;
    createCustomListItem(newItem,listName).catch(err => {console.log(err)});
    res.redirect("/lists/"+listName);
});



app.post("/lists/customList/delete", (req,res) => {
    console.log(req.body);
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    deletecustomListItem(itemId,listName).catch(err => {console.log("item not found :( ", err)});
    res.redirect("/lists/"+listName);
})





app.post("/delete", (req,res) => {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    deleteItem(itemId,listName).catch(err => {console.log("item not found :( ", err)});
    res.redirect("/");
});





app.post("/lists/delete", async (req,res) => {
    const itemId = req.body.checkbox;
    console.log(req.body);
    try{
        const deletedItems = await List.findByIdAndDelete(itemId);
        console.log('Item deleted !');
        res.redirect("/lists");
    }catch(err){
        console.log(err);
        res.redirect("/lists");
    }
});






async function readItems() {
    // Retrieve all items from the database
    const items = await Item.find({});
    console.log('Total Items count is : ', items.length);
    return items;
}







async function deleteItem(id) {
    // Find a user by ID and delete them
    const deletedItems = await Item.findByIdAndDelete(id);
    console.log('Item deleted !');
}



async function deletecustomListItem(id,listName){
    const foundList = await List.findOneAndUpdate(
        { Name: listName },
        { $pull: { items: { _id: id } } }
      );
      console.log('Item deleted !');
}


async function createItem(name) {
    // Create a new item document
    const item = new Item({
      Name: name,
    });

    const savedItem = await item.save();
    console.log('Item created:', savedItem);
}



async function createCustomListItem(name,list) {
    // Create a new item document
    const item = new Item({
      Name: name,
    });
    const foundList = await List.findOne({ Name: list });
    foundList.items.push(item);

    const savedList = await foundList.save();
    console.log('Item created:', savedList);
}





app.listen(PORT, () => {
    console.log("server started on port no. :",PORT);
})