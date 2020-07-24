let express = require('express');
let router = express.Router();
let User = require('../database/users.js');
let passport = require("../passport.js")
let upload = require("../upload.js")
let moment = require("moment");

router.get('/', async (req, res, next) => {
  try {
    let docs = await User.find({}).exec()
    res.send(docs)
  } catch(error) {
    res.send(error)
  }
});

router.get('/find_user/:id', 
  async (req, res, next) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  res.send(user)
})

router.get("/find_email/:email", async (req, res) => {
  let email = req.params.email
  let user = await User.findOne({email: email}).exec()
  res.send(user)
})

router.put('/info_add/:id', upload.single("img"), async (req, res) => {
  try {
    let id = req.params.id
    let info = req.body
    let user = await User.findOne({id: id}).exec()
    user.additionally.gender = info.gender
    user.additionally.country = info.country
    user.additionally.city = info.city
    user.additionally.phone = info.phone
    user.additionally.about = info.about
    user.firstname = info.firstname
    user.lastname = info.lastname
    if (req.file) user.additionally.img = "uploads/" + req.file.filename
    await user.save()
    res.send(user)
  } catch(err) {
    res.send(err)
  }
})

router.put("/geo-add", async (req, res) => {
  let user = await User.findOne({ id: req.body.id }).exec()
  console.log(req.body)
  user.geolocation.push({ lat: req.body.lat, lon: req.body.lon })
  await user.save()
  res.send(user)
})

router.put("/additionally_add/:id", async (req, res) => {
  try {
    let id = req.params.id
    let info = req.body
    let user = await User.findOne({id: id}).exec()
    if (user.additionally.age != "") 
      user.additionally.age = info.additionally.age
    if (user.additionally.development != "") 
      user.additionally.development = info.additionally.development
    if (user.additionally.interesting != "") 
      user.additionally.interesting = info.additionally.interesting
    if (user.additionally.music != "") 
      user.additionally.music = info.additionally.music
    if (user.additionally.films != "") 
      user.additionally.films = info.additionally.films
    user.additionally.categories = info.additionally.categories
    await user.save()
    res.send(user)
  } catch (error) {
    res.send(error)
  }
})

router.post("/get_friends", async (req, res) => {
  try {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let users = await User.find({firstname: firstname, lastname: lastname}).exec()
    res.send(users)
  } catch (error) {
    res.send(error)
  }
})

router.put("/friend_add/:id/:myid", async (req, res) => {
  try {
    let friendId = req.params.id
    let user = await User.findOne({id: friendId}).exec()
    let docs = user.subscrise.indexOf(req.params.myid)
    if (docs == -1) {
      user.subscrise.push(req.params.myid)
      await user.save()
      res.send(user)
    } else res.send(user)
  } catch (error) {
    res.send(error)
  }
})

router.post("/subs_find", async (req, res) => {
  let user = await User.findOne({id: req.body.userId.id}).exec()
  let isUser = user.subscrise.includes(req.body.myId.id)
  res.send(isUser)
})

router.delete("/friend_cancel/:id/:myid", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let isUser = user.subscrise.indexOf(req.params.myid)
  if (isUser != 1) {
    user.subscrise.splice(isUser, 1)
  }
  await user.save()
  res.send(user)
})

router.get("/get_subscrises/:id", async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  res.send(user.subscrise)
})

router.put("/blacklist_add/:id/:myid", async (req, res) => {
  let userId = req.params.id
  let myId = req.params.myid
  // мой аккаунт
  let user = await User.findOne({id: myId}).exec()

  // поиск в чс
  let isUser = user.blackList.indexOf(userId)
  // поиск в подписчиках
  let isSubUser = user.subscrise.indexOf(userId)
  let isFriendUser = user.friends.indexOf(userId)

  if (isUser == -1) user.blackList.push(userId)
  if (isSubUser != -1) user.subscrise.splice(isSubUser, 1)
  if (isFriendUser != -1) user.friends.splice(isFriendUser, 1)

  // аккаунт пользователя
  let userBan = await User.findOne({id: userId})
  // проверка и удаление из подписчиков
  let isUserBan = userBan.subscrise.indexOf(myId)
  // проверка и удаление из друзей
  let isUserFriendBan = userBan.friends.indexOf(myId)

  if (isUserBan != -1) userBan.subscrise.splice(isUserBan, 1)
  if (isUserFriendBan != -1) userBan.friends.splice(isUserFriendBan, 1)

  await user.save()
  await userBan.save()
  res.send(user)
})

router.delete("/blacklist_delete/:id/:myid", async (req, res) => {
  let id = req.params.id
  let myid = req.params.myid
  let user = await User.findOne({id: myid}).exec()
  let isUser = user.blackList.indexOf(id)
  if (isUser != -1) user.blackList.splice(isUser, 1)
  await user.save()
  res.send(user)
})

router.put("/friend_accept/:id/:myid", async (req, res) => {
  let id = req.params.id
  let myId = req.params.myid

  let myUser = await User.findOne({id: myId}).exec()
  let user = await User.findOne({id: id}).exec()

  myUser.friends.push(id)
  user.friends.push(myId)
  
  let isUser = myUser.subscrise.indexOf(id)
  if (isUser != -1) myUser.subscrise.splice(isUser, 1)

  await myUser.save()
  await user.save()

  res.send(myUser)
})

router.get("/find_friends/:array", async (req, res) => {
  let friends = []
  let arr = req.params.array.split(',')
  for (let friend of arr) {
    let fr = await User.findOne({id: friend}).exec()
    friends.push(fr)
  }
  if (friends.length > 0) res.send(friends)
  else res.send("")
})

router.get("/find_friend/:myid/:firstname/:lastname", async (req, res) => {
  let id = req.params.myid
  let firstname = req.params.firstname
  let lastname = req.params.lastname
  let friends = []
  let myUser = await User.findOne({id: id}).exec()
  let users = await User.find({firstname: firstname, lastname: lastname}).exec()
  if (users) {
    for (let fr of users) {
      let isUser = myUser.friends.indexOf(fr.id)
      if (isUser != -1) friends.push(fr)
    }
    res.send(friends)
  } else res.sendStatus(404)
})

router.delete("/friend_remove/:id/:myid", async (req, res) => {
  let id = req.params.id
  let myId = req.params.myid
  let myUser = await User.findOne({id: myId}).exec()
  let user = await User.findOne({id: id}).exec()

  let isMyUser = myUser.friends.indexOf(id)
  let isUser = user.friends.indexOf(myId)

  if (isMyUser != -1) myUser.friends.splice(isMyUser, 1)
  if (isUser != -1) user.friends.splice(isUser, 1)
  myUser.subscrise.push(id)

  await myUser.save()
  await user.save()
  res.send(myUser)
})

router.put("/post_save", async (req, res) => {
  let myId = req.body.myId
  let postId = req.body.postId
  
  let user = await User.findOne({id: myId}).exec()
  let isPost = user.bookmarks.indexOf(postId)
  if (isPost == -1) user.bookmarks.unshift(postId)

  await user.save()
  res.send(user)
})
router.delete("/post_delete/:id/:myid", async (req, res) => {
  let myId = req.params.myid
  let postId = req.params.id
  
  let user = await User.findOne({id: myId}).exec()
  let isPost = user.bookmarks.indexOf(postId)
  if (isPost != -1) user.bookmarks.splice(isPost, 1)

  await user.save()
  res.send(user)
})

router.get("/get_authors/:id", async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  if (user) res.send(user)
})

router.get("/get_categories/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  res.send(user.additionally.categories)
})

router.put("/subscritions_add/:id/:groupId", async (req, res) => {
  let group = req.params.groupId
  let user = await User.findOne({id: req.params.id}).exec()
  user.groups.push(group)
  await user.save()
  res.send(user)
})

router.delete("/describe/:groupId/:id", async (req, res) => {
  let groupId = req.params.groupId
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  let isGroup = user.groups.indexOf(groupId)
  if (isGroup != -1) user.groups.splice(isGroup, 1)
  await user.save()
  res.send(user)
})

router.put("/put_fone/:id", upload.single("fone"), async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  user.additionally.fone = "uploads/" + req.file.filename
  await user.save()
  res.send(user)
})

router.put("/image_save/:id", upload.single("img"), async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  if (req.file) user.gallery.unshift({ source: "uploads/" + req.file.filename,
    date: moment().format("lll") })
  await user.save()
  res.send(user)
})

router.get("/get_gallery/:id", async (req, res) => {
  try {
    let user = await User.findOne({id: req.params.id}).exec()
    res.send(user.gallery)
  } catch(err) {
    res.send(err)
  }
})

router.put("/image_edit/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let info = req.body
  let image = await user.gallery.find(img => img.source === info.source)
  if (image) {
    image.name = info.name
    image.description = info.description
  }
  await user.save()
  res.send(user)
})

router.delete("/image_delete/:id", async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()
  let image = await user.gallery.findIndex(img => img.source === req.body.image)
  if (image != -1) {
    user.gallery.splice(image, 1) 
    await user.save()
    res.send(user)
  }
})

router.get("/get_albums/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  res.send(user.albums)
})

router.put("/album_create/:id", async (req, res) => {
  let id = req.params.id
  let user = await User.findOne({id: id}).exec()

  user.albums.unshift({ title: req.body.name, description: req.body.description,
  date: moment().format("lll"), images: [], id: Math.floor(Math.random() * 99999)})
  await user.save()
  res.send(user)
})

router.get("/get_album/:id/:album", async (req, res) => {
  let id = req.params.id
  let albumId = req.params.album
  let user = await User.findOne({id: id}).exec()
  let isAlbum = await user.albums.find(album => album.id === albumId)
  if (isAlbum) res.send(isAlbum)
})

router.put("/image-album-save/:id/:albumId", upload.single("image"), async (req, res) => {
  let img = "uploads/" + req.file.filename
  let user = await User.findOne({id: req.params.id}).exec()
  let album = await user.albums.find(item => req.params.albumId === item.id)

  album.images.unshift(img)
  user.gallery.unshift({ date: moment().format("lll"), source: img })
  await user.save()
  res.send(user)
})

router.get("/get_images/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let arr = req.query.album
  let images = []
  if (arr) {
    arr.map(key => {
      let isImg = user.gallery.find(img => img.source === key)
      images.push(isImg)
    })
    res.send(images)
  } else res.send("-")
})

router.delete("/album_delete/:id/:albumId", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let isAlbum = await user.albums.findIndex(item => item.id === req.params.albumId)
  if (isAlbum != -1) user.albums.splice(isAlbum, 1)
  await user.save()
  res.send(user)
})

router.put("/audio_save/:id", upload.single("audio"), async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  user.audio.unshift({ source: "audio/" + req.file.filename })
  await user.save()
  res.send(user)
})

router.get("/get_audios/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  if (user.audio) res.send(user.audio)
  else res.status(404).send("-")
})

router.delete("/audio-delete/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let audio = req.query.audio
  let isAudio = await user.audio.findIndex(item => audio === item.source)
  console.log(isAudio)
  if (isAudio != -1) user.audio.splice(isAudio, 1)
  await user.save()
  res.send(user)
})

router.put("/sound-replace/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let isAudio = user.audio.find(item => req.body.source == item.source)
  if (isAudio != -1) {
    isAudio.title = req.body.title
    isAudio.author = req.body.author
  }
  await user.save()
  res.send(user)
})

router.get("/get-friends/:id", async (req, res) => {
  let user = await User.findOne({id: req.params.id}).exec()
  let arr = []
  if (user.friends.length > 0) {
    for await (let friend of user.friends) {
      let isFriend = User.findOne({id: friend})
      if (isFriend) arr.push(isFriend)
    }
    res.send(arr)
  } else res.send("-")
})

router.get("/getNewUsers/:myId", async (req, res) => {
  let users = await User.find({}).exec()
  users = users.reverse()
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === req.params.myId) users.splice(i, 1); break
  }
  let firstUsers = users.slice(0, 3)
  let fullUsers = users.slice(0, 10)

  res.send({ firstUsers: firstUsers, fullUsers: fullUsers })
})

router.put("/add_image", async (req, res) => {
  try {
    let isImage = false
    let user = await User.findOne({ id: req.body.user }).exec()
    for (let image of user.gallery) {
      if (req.body.img == image.source) isImage = true; break
    }
    if (!isImage) user.gallery.unshift({ source: req.body.img, date: moment().format("lll") })
    await user.save()
    res.send(user)
  } catch(err) {
    console.log(err)
  }
})


module.exports = router;