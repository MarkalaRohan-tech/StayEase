if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//Set up all the necessary middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser("secretcode"));

//Connecting to Mongodb server
// const mongo_url = "mongodb://127.0.0.1:27017/StayEasedb";
const dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in mongo session store",err);
})

const sessionOptions = {
  secret: process.env.SECRET,
  store: store,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3, //3days
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connection to mongodb successful");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Home page route
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

//Listing router
app.use("/listings", listingRouter);

//Review router
app.use("/listings/:id/reviews", reviewRouter);

//User router
app.use("/", userRouter);

// Catch-all route for 404 (Page Not Found)
app.all("\\*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware (placed after all routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || JSON.stringify(err) || "Something went wrong!";
  res.render("error.ejs", { statusCode, message });
});

// Starting a server
app.listen(3000, () => {
  console.log("Server is listening...");
});
