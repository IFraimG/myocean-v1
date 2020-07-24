let express = require('express');
let router = express.Router();
let Post = require('../database/posts.js');
let passport = require("../passport.js")
let upload = require("../upload.js")
let moment = require("moment");

router.get('/', async (req, res, next) => {
  let docs = await Post.find({}).exec()
  res.send(docs)
})

router.get('/get_posts/:id', passport.authenticate("jwt", { session: false }), 
  async (req, res) => {
  try {
    let id = req.params.id
    let docs = await Post.find({authorId: id}).exec()
    res.send(docs)
  } catch(error) {
    res.send(error)
  }
})

router.put('/new_post', upload.array("img"), async (req, res) => {
  try {
    let post = req.body
    let newPost = new Post(post)
    if (req.files) {
      for (let file of req.files) {
        newPost.images.push("uploads/" + file.filename)
      }
    }
    await newPost.save()
    res.send(newPost)
    // else {
    //   while (isId.length != 0) {
    //     let res = Math.random()
    //     isId = Post.findOne({id: res})
    //     if (isId.length == 0) {
    //       req.body.id = res
    //       let newPost = new Post(post)
    //       await newPost.save()
    //       res.send(newPost)
    //       break
    //     }
    //   }
    // }
  } catch (error) {
    res.send(error)
  }
})

router.delete('/remove_post/:id', async (req, res) => {
  try {
    let post = await Post.findOneAndRemove({id: req.params.id}).exec()
    res.send(post)
  } catch (error) {
    res.send(error)
  }
})

router.put('/post_view', async (req, res) => {
  try {
    let docs = await Post.findById(req.body.id).exec()
    let docsId = docs.viewsId.indexOf(req.body.viewsId)
    if (docsId == -1) {
      docs.views += 1
      docs.viewsId.push(req.body.viewsId)
      docs.save()
    }
    res.send(docs)
  } catch (error) {
    res.send(error)
  }
})
router.put("/count_like", async (req, res) => {
  try {
    let count = req.body.count
    let docs = await Post.findById(req.body.post._id)
    docs.countLikes = docs.countLikes + count
    docs.save()
    res.send(docs)
  } catch (error) {
    res.send(error)
  }
})
router.put("/info_replace/:id", async (req, res) => {
  try {
    let id = req.params.id
    let posts = await Post.find({authorId: id}).exec()
    posts.map(x => {
      x.authorName = req.body.firstname
      x.authorLastName = req.body.lastname
    })
    posts.save()
    res.send(posts)
  } catch (error) {
    res.send(error)
  }
})

router.get("/get_bookmarks/:array", async (req, res) => {
  let bookmarks = req.params.array
  bookmarks = bookmarks.split(',')
  arr = []
  for (let info of bookmarks) {
    let res = await Post.findOne({id: info}).exec()
    if (res) arr.push(res)
  }
  res.send(arr)
})

module.exports = router;