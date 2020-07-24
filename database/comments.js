let mongoose = require('mongoose')
let { Schema } = mongoose

let Comment = new Schema({
  authorName: String, 
  authorLastName: String, 
  authorImage: String,
  authorId: String,
  commentId: String,
  toAuthorId: String,
  img: String, 
  text: String, 
  id: String, 
  postId: String,
  date: Schema.Types.Mixed
})

module.exports = mongoose.model("Comment", Comment)