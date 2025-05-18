const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//Connecting to Mongodb server
const mongo_url = "mongodb://127.0.0.1:27017/StayEasedb";

async function main() { 
    await mongoose.connect(mongo_url);
}

main()
    .then(() => {
        console.log("Connection to mongodb successful")
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({
      ...obj,
      owner: "68260084f521c21081766c97",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized")
}

initDB();