import { MongoClient } from "mongodb";
// Replace the uri string with your connection string.
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
async function run() {
  try {
    const database = client.db('shopDB');
    const products = database.collection('products');
    // Query for a movie that has the title 'Back to the Future'
    const query = { _id: 1 };
    const product = await products.findOne(query);
    console.log(product);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
