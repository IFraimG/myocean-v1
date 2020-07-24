let mongoose = require("mongoose");
let crypto = require("crypto")
let { Schema } = mongoose;

let User = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  online: {
    type: Boolean,
    default: false
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  date: Schema.Types.Mixed,
  id: {
    type: String,
    unique: true,
    index: true,
  },
  level: {
    type: Number,
    default: 1,
    required: true
  },
  target: {
    type: Number,
    default: 100,
    required: true
  },
  rank: {
    type: String,
    default: "Недавно прибывший",
    required: true
  },
  reputations: {
    type: Number,
    default: 0,
    required: true
  },
  geolocation: [{ lat: String, lon: String }],
  additionally: {
    img: String,
    fone: String,
    age: { type: Number, default: 0, required: false },
    gender: { type: String, default: "Не указано", required: false },
    phone: { type: String, default: "Не указано", required: false },
    country: { type: String, default: "Не указано", required: false },
    city: { type: String, default: "Не указано", required: false },
    development: { type: String, default: "Не указано", required: false },
    interesting: { type: String, default: "Не указано", required: false },
    music: { type: String, default: "Не указано", required: false },
    films: { type: String, default: "Не указано", required: false },
    about: { type: String, default: "Не указано", required: false },
    categories: [ { title: String, text: String } ]
  },
  friends: Array,
  subscrise: Array,
  subscriptions: Array,
  blackList: Array,
  groups: Array,
  bookmarks: Array,
  albums: [
    { title: String, description: String, 
      date: Schema.Types.Mixed, id: String, images: Array }
  ],
  audio: [
    { source: String, title: { type: String, default: "Неизвестно" },
      author: { type: String, default: "Автор не указан" } }
  ],
  gallery: [{ name: String, source: String, description: String, date: Schema.Types.Mixed }]
});

User.methods.encryptPassword = function(password) {
  return crypto
    .createHmac("sha1", this.salt)
    .update(password.toString())
    .digest("hex")
}

User.methods.checkPassword = function(password) {
  return this.hashedPassword === crypto
    .createHmac("sha1", this.salt)
    .update(password.toString())
    .digest("hex")
}

User
  .virtual("password")
  .set(function (password) {
    this._plainPassword = password
    this.salt = Math.random().toFixed(6) + ''
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function() { return this._plainPassword })

module.exports = mongoose.model("User", User);