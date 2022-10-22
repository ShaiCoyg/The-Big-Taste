if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const recipeRouter = require("./routes/recipes");

const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use("/", indexRouter);
app.use("/recipes", recipeRouter);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => console.error(error));
db.once("open", (err) => console.log("Connected to Mongoose"));

app.listen(process.env.PORT || 3000);
