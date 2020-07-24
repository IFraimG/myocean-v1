const mongoose = require("mongoose");
const { Schema } = mongoose;

let message = new Schema({
  authorId: String,
  id: String,
  chatId: String,
  text: String,
  author: Object,
  msgDate: Schema.Types.Mixed,
  typeMessage: {
    type: String,
    default: "text"
  }
})

module.exports = mongoose.model("Message", message)