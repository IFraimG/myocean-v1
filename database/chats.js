const mongoose = require("mongoose");
const { Schema } = mongoose;

let chat = new Schema({
  users: Array,
  chatId: String,
  title: {
    type: String,
    default: "Имя не указано"
  },
  description: String,
  img: String,
  lastMsg: String,
  dateMsg: String,
  date: Schema.Types.Mixed
})

module.exports = mongoose.model("Chat", chat)