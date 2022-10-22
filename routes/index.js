const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  let query = Recipe.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.tags != null && req.query.tags != "") {
    query = query.regex("tags", new RegExp(req.query.tags, "i"));
  }
  let recipes;
  let recipesNew;
  let popularRecipes;
  let meatRecipes;
  let dairyRecipes;
  try {
    const recipes = await query.exec();
    meatRecipes = Recipe.find();
    meatRecipes = meatRecipes.regex("tags", new RegExp("בשרי", "i"));
    meatRecipes = await meatRecipes.exec();
    dairyRecipes = Recipe.find();
    dairyRecipes = dairyRecipes.regex("tags", new RegExp("חלבי", "i"));
    dairyRecipes = await dairyRecipes.exec();
    recipesNew = await Recipe.find()
      .sort({ createdAt: "desc" })
      .limit(7)
      .exec();
    popularRecipes = await Recipe.find()
      .sort({ score: "desc" })
      .limit(7)
      .exec();
    dairyRecipes = await Recipe.find()
      .regex("tags", new RegExp("חלבי", "i"))
      .sort({ createdAt: "desc" })
      .limit(7)
      .exec();
    meatRecipes = await Recipe.find()
      .regex("tags", new RegExp("בשרי", "i"))
      .sort({ createdAt: "desc" })
      .limit(7)
      .exec();
  } catch {
    console.log("error");
  }
  res.render("index", {
    recipes: recipes,
    searchOptions: req.query,
    recipesNew: recipesNew,
    popularRecipes: popularRecipes,
    meatRecipes: meatRecipes,
    dairyRecipes: dairyRecipes,
  });
});

module.exports = router;
