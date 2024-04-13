const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  contentName: {
    type: String,
    required: true
  },
  pdfFile: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
