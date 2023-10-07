require("dotenv").config();

const express = require("express");

const path = require("path");

const app = express();

const cookieParser = require("cookie-parser");

const { restrictToLoggedinUsersOnly, checkAuth, } = require("./middlewares/auth");

const staticRoute = require("./routes/staticRouter");
const redirectRoute = require("./routes/shortid");
const userRoute = require("./routes/user");

const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");



// Set EJS as the view engine
app.set('view engine', 'ejs');

// set path of views
app.set("views", path.resolve("./views"));

const port = process.env.PORT;

//local DB
// connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
//     .then(() => console.log('MongoDB connected'));

connectToMongoDB("mongodb+srv://swapnil:cws123@cluster0.ys61ljb.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log('MongoDB connected'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUsersOnly, urlRoute);
app.use("/id", redirectRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

