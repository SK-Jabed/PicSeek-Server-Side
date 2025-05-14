const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("picSeekDB");
const imageCollection = db.collection("images");
const commentCollection = db.collection("comments");

async function connectDB() {
  return client.connect();
}

module.exports = { connectDB, imageCollection, commentCollection };