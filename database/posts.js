let mongoose = require('mongoose')
let { Schema } = mongoose
let Post = new Schema({
  authorId: String,
  authorLevel: Number,
  author: Schema.Types.Mixed,
  category: String,
  isComments: String,
  images: String,
  text: String,
  id: {
    type: String,
    unique: true,
    required: true
  },
  images: Array,
  postId: String,
  groupId: String,
  viewsId: Array,
  views: {
    type: Number,
    required: true,
    default: 0
  },
  date: Schema.Types.Mixed,
  countLikes: {
    type: Number,
    required: true,
    default: 0
  },
  countComments: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model("Post", Post)