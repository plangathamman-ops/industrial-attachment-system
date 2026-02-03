// test.js
const mongoose = require('mongoose');

const uri = "mongodb+srv://plangathamman1:Hamp9map@mongodb.axanjbq.mongodb.net/mongodb?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch(err => console.error("❌ Connection error:", err));
