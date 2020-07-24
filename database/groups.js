const mongoose = require("mongoose")
const { Schema } = mongoose

let Group = new Schema({
  title: String,
  id: Schema.Types.Mixed,
  creatorId: Schema.Types.Mixed,
  helpers: Array,
  groupType: {
    type: String,
    default: "Открытая",
    required: true
  },
  users: Array,
  date: Schema.Types.Mixed,
  tematic: String,
  subscrises: Array,
  status: String,
  logo: String,
  fone: String,
  site: String,
  info: {
    description: {
      type: String,
      default: "Описание отсутствует"
    },
    rules: {
      type: String,
      default: "Правила отсутствуют"
    },
    country: String,
    city: String,
    phone: Number
  },
  posts: Array,
  gallery: Array,
  audios: Array
})

module.exports = mongoose.model("Group", Group)