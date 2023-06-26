const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


// Connect to the MongoDB database
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yt-users');
  console.log("connection success with database !");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().catch(err => console.log("database connection error", err));



// Define a schema for the data model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Create a mongoose model based on the schema
const User = mongoose.model('User', userSchema);

async function createUser(name,email,age) {
  // Create a new user document
  const user = new User({
    name: name,
    email: email,
    age: age
  });

  // Save the user document to the database
  const savedUser = await user.save();
  console.log('User created:', savedUser);
}

async function readUsers() {
  // Retrieve all users from the database
  const users = await User.find();
  console.log('All users:', users);
}

async function updateUser(userId) {
  // Find a user by ID and update their age
  const updatedUser = await User.findByIdAndUpdate(userId, { age: 30 }, { new: true });
  console.log('User updated:', updatedUser);
}

async function deleteUser(id) {
  // Find a user by ID and delete them
  const deletedUser = await User.findByIdAndDelete(id);
  console.log('User deleted:', deletedUser);
}



async function deleteUserByName(name) {
  try {
    const result = await User.deleteOne({ name:name });
    
    if (result.deletedCount > 0) {
      console.log(`User "${name}" deleted successfully.`);
    } else {
      console.log(`User "${name}" not found.`);
    }
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
  }
}



// createUser().catch(console.error);
readUsers().catch(console.error);
updateUser('60ac63a3b137f5119c8d69cd').catch(console.error); // Provide the appropriate user ID
// deleteUser('646f09d0fd284c3d9f8f76f8').catch(console.error); // Provide the appropriate user ID
  


const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res) => {
  res.render("home");
});



app.post("/",(req,res)=>{

  let name = req.body.Name;
  let email = req.body.Email;
  let age = req.body.Age;
  if(name && email && age)
    createUser(name,email,age).catch(console.error);
  res.redirect("/");
});



app.get("/delete",(req,res) => {
  res.render("delete");
});



app.post("/delete",(req,res)=>{

  let name = req.body.Name;
  deleteUserByName(name).catch(console.error);
  res.redirect("/");
});



app.listen(PORT, () => {
    console.log("server started on port no. :",PORT);
})