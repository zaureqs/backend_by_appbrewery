import * as mongoose from "mongoose";


main().catch(err => console.log("database connection error", err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');
  console.log("connection success with database !");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const fruitSchema = new mongoose.Schema({
  Name: String,
  Rating: Number,
  Review:String
});


const Fruit = mongoose.model("Fruit", fruitSchema); 


const fruit = new Fruit({
  Name:"Apple",
  Rating:7,
  Review: "adskj;flikjads fj sl;dkfj !"
});



// fruit.save();




const kiwi = new Fruit ({
  Name: "Kiwi",
  Rating: 10,
  Review: "The best fruit!"
  });
  const orange = new Fruit ({
  Name : "Orange",
  Rating: 4,
  Review: "Too sour for me"
  });
  const banana = new Fruit ({
  Name: "Banana",
  Rating: 3,
  Review: "Weird texture"
});




// const results = await Fruit.insertMany([kiwi,orange,banana]);

// console.log(results);




const fruits = await Fruit.find();
  console.log('All users:', fruits);

  for(let fruit of fruits){
    console.log(fruit.Name);
  }

