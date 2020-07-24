let express = require('express')
let router = express.Router()
let Like = require("../database/likes.js")

router.get("/", async (req, res) => {
  let docs = await Like.find({}).exec()
  res.send(docs)
})

router.put("/add_like/:id", async (req, res) => {
  let id = req.params.id
  let post = req.body
  let findPost = await Like.findOne({postId: post._id}).exec()
  if (!findPost) {
    let like = new Like({
      authorId: id,
      postId: post._id,
      date: post.date,
      id: Math.floor(Math.random() * (999999 - 9999) + 9999)
    })
    like.save()
    res.send("1")
  }
  else {
    findPost.remove()
    res.send("-1")
  }
})

router.delete("/remove_likes/:id", async (req, res) => {
  try {
    let likes = await Like.deleteMany({postId: req.params.id}).exec()
    res.send(likes)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;