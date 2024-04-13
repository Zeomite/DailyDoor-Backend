const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postid: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: [Number],
    required: true
  },
  assigned: {
    type: String,
    default: null
  },
  payment:{
    type: Number,
    default: null
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
