let mongoose = require("mongoose")
let { Schema } = mongoose

let Like = new Schema({
  authorId: String,
  postId: String,
  id: String,
  date: Schema.Types.Mixed
})

module.exports = mongoose.model("Like", Like)