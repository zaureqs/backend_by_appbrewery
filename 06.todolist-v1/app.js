const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));


main().catch(err => console.log("database connection error", err));



async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser:true});
    console.log("connection success with database !");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
  



const itemsSchema = {
    Name:String,
}


const Item = mongoose.model("Item",itemsSchema);




const defaultItems = [new Item({Name:"jdklasjfl"}), new Item({Name:"oerigglds"}), new Item({Name:"vnnviyni"})];



// async function result(){
//     const results = await Item.insertMany(defaultItems);
//     console.log(results);
// }


// result().catch(err => console.log("database connection error", err));




listSchema = {
    Name:String,
    items: [itemsSchema],
}


const List = mongoose.model("List", listSchema);



app.get("/", async (req, res) => {
    try {
      let list_items = await readItems();
      res.render("list", { listTitle: "Today", items: list_items });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});


app.get("/:customListName", async (req, res) => {
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
            res.redirect("/"+customListName);
        } else {
            res.render("list",{listTitle: foundList.Name, items: foundList.items});
        }

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });





app.post("/",async (req,res)=>{

    const newItem = req.body.newItem;
    const listName = req.body.list;
    
    if(listName === "Today"){
        createItem(newItem).catch(err => {console.log(err)});
        res.redirect("/");
    }
    else{
        createList(newItem,listName).catch(err => {console.log(err)});
        res.redirect("/"+listName);
    }
});





app.post("/delete", (req,res) => {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    deleteItem(itemId,listName).catch(err => {console.log("item not found :( ", err)});
    if(listName === "Today"){
        res.redirect("/");
    }else{
        res.redirect("/"+listName);
    }
});






async function readItems() {
    // Retrieve all items from the database
    const items = await Item.find({});
    console.log('Total Items count is : ', items.length);
    return items;
  }



async function deleteItem(id,listName) {
    // Find a user by ID and delete them
    if(listName === "Today")
    {
        const deletedItems = await Item.findByIdAndDelete(id);
        console.log('Item deleted !');
    }else{
        const foundList = await List.findOneAndUpdate(
            { Name: listName },
            { $pull: { items: { _id: id } } }
          );
          console.log('Item deleted !');
    }
}


async function createItem(name) {
    // Create a new item document
    const item = new Item({
      Name: name,
    });

    const savedItem = await item.save();
    console.log('Item created:', savedItem);
}



async function createList(name,list) {
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