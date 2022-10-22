const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// All Films Route
router.get("/", async (req, res) => {
  let query = Recipe.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.tags != null && req.query.tags != "") {
    query = query.regex("tags", new RegExp(req.query.tags, "i"));
  }

  try {
    const recipes = await query.exec();
    res.render("recipes/index", {
      recipes: recipes,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//  New Film Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Recipe());
});

// Create Film Route
router.post("/", async (req, res) => {
  const recipe = new Recipe({
    title: req.body.title,
    tags: req.body.tags,
    prepTime: req.body.prepTime,
    cookTime: req.body.cookTime,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
  });
  try {
    const arr = req.body.tags.toString();
    recipe.tags = arr;
    savePoster(recipe, req.body.poster);
    const newRecipe = await recipe.save();
    res.redirect(`/recipes/${newRecipe.id}`);
  } catch {
    renderNewPage(res, recipe, true);
  }
});

// show film route
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render("recipes/show", { recipe: recipe });
  } catch {
    res.redirect("/");
  }
});

// edit film route
router.get("/:id/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    renderEditPage(res, recipe);
  } catch {
    res.redirect("/");
  }
});

// Update Film Route
router.put("/:id", async (req, res) => {
  let recipe;
  try {
    recipe = await Recipe.findById(req.params.id);
    recipe.title = req.body.title;
    recipe.tags = req.body.tags;
    recipe.prepTime = req.body.prepTime;
    recipe.cookTime = req.body.cookTime;
    recipe.ingredients = req.body.ingredients;
    recipe.directions = req.body.directions;

    if ((req.body.poster != null) & (req.body.poster != "")) {
      savePoster(recipe, req.body.poster);
    }
    await recipe.save();
    res.redirect(`/recipes/${recipe.id}`);
  } catch {
    if (recipe != null) {
      renderEditPage(res, recipe, true);
    } else {
      redirect("/");
    }
    renderNewPage(res, recipe, true);
  }
});

//delete film route
router.delete("/:id", async (req, res) => {
  let recipe;
  try {
    recipe = await Recipe.findById(req.params.id);
    await recipe.remove();
    res.redirect("/recipes");
  } catch {
    if (recipe != null) {
      res.render("recipes/show", {
        recipe: recipe,
        errorMessage: "Could not remove recipe",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, recipe, hasError = false) {
  renderFormPage(res, recipe, "new", hasError);
}

async function renderEditPage(res, recipe, hasError = false) {
  renderFormPage(res, recipe, "edit", hasError);
}

async function renderFormPage(res, recipe, form, hasError = false) {
  try {
    const params = {
      recipe: recipe,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating recipe";
      } else {
        params.errorMessage = "Error Creating recipe";
      }
    }
    res.render(`recipes/${form}`, params);
  } catch {
    res.redirect("/recipes");
  }
}

function savePoster(recipe, posterEncoded) {
  if (posterEncoded == null) return;
  const poster = JSON.parse(posterEncoded);
  if (poster != null && imageMimeTypes.includes(poster.type)) {
    recipe.posterImage = new Buffer.from(poster.data, "base64");
    recipe.posterImageType = poster.type;
  }
}

module.exports = router;
