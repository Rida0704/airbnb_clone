if(process.env.NODE_ENV!="production")
{
  require('dotenv').config()
}
console.log(process.env)
const express=require("express");
const app=express();
app.use(express.urlencoded({ extended: true }));
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const listingrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const Review=require("./models/review.js");
  main()
.then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
 });

 async function main()
 {
    await mongoose.connect(dburl);
 }
  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));
  app.engine('ejs', ejsMate);
  app.use(express.static(path.join(__dirname,"/public")));
 
  const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600,
  });


  store.on("error",()=>{
    console.log("error",err);
  });

  const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
  };

 
 
  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
 

app.use((req,res,next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
});




app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000,()=>
{
    console.log("server is listening");
});