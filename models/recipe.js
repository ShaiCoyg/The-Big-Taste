const mongoose = require("mongoose");

const recipesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  prepTime: {
    type: String,
    required: true,
  },
  cookTime: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  posterImage: {
    type: Buffer,
    required: true,
  },
  posterImageType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

recipesSchema.virtual("posterImagePath").get(function () {
  if (this.posterImage != null && this.posterImageType != null) {
    return `data:${
      this.posterImageType
    };charset=utf-8;base64,${this.posterImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Recipe", recipesSchema);
