const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
 });

 async function main()
 {
    await mongoose.connect(MONGO_URL);
 }

 const initDB=async()=>{
    Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67decdfeafc67b9e30c54ac5"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

 };

 initDB();