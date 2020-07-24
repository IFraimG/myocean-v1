let express = require('express')
let router = express.Router()
let Comment = require('../database/comments.js')

router.get('/', async (req, res) => {
  try {
    let docs = await Comment.find({}).exec()    
    res.send(docs)
  } catch (error) {
    res.send(error)
  }
})

router.put('/add_comment', async (req, res) => {
  try {
    let comment = req.body
    let newComment = new Comment(comment)
    newComment.save()
    res.send(newComment)
  } catch (error) {
    res.send(error)
  }
})

router.get('/find_comments/:id', async (req, res) => {
  let id = req.params.id
  let comments = await Comment.find({postId: id}).exec()
  res.send(comments)
})
router.delete("/del_comment/:id", async (req, res) => {
  let id = req.params.id
  let comment = await Comment.deleteOne({commentId: id}).exec()
  res.send(comment)
})
router.delete("/remove_comments/:id", async (req, res) => {
  try {
    let comment = await Comment.deleteMany({postId: req.params.id}).exec()
    res.send(comment)
  } catch (error) {
    res.send(error)
  }
})
router.put("/info_replace/:id", async (req, res) => {
  try {
    let id = req.params.id
    let comments = await Comment.updateMany({authorId: id}, 
      {$set: {authorName: req.body.firstname, authorLastName: req.body.lastname,
      authorImage: "uploads/" + req.file.filename}}).exec()
    comments.save()
    res.send(comments)
  } catch (error) {
    res.send(error)
  }
})

router.put("/add_author_comment", async (req, res) => {
  try {
    res.send(await Comment.create({text: req.body.text, authorId: req.body.author,
    date: req.body.date, toAuthorId: req.body.toAuthor, commentId: req.body.id}))
  } catch (error) {
    res.send(error)
  }
})

router.get("/get_author_comments/:id", async (req, res) => {
  try {
    let docs = await Comment.find({toAuthorId: req.params.id}).exec()
    res.send(docs)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router