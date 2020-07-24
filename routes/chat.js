let express = require("express")
let router = express.Router()
let Chat = require("../database/chats.js")
let Message = require("../database/messages.js");
let moment = require("moment")

router.get("/get-chats/:id", async (req, res) => {
  let chats = await Chat.find({}).exec()
  let arr = []
  for (item of chats) {
    if (item.users.includes(req.params.id) == true) {
      let msg = await Message.find({ chatId: item.chatId }).exec()
      if (msg) {
        console.log(msg)
        // msg.map(message => {
        //   item.lastMsg = message[0].text
        //   item.dateMsg = message[0].msgDate
        // })
      }
      arr.push(item)
    }
  }
  res.send(arr)
})

router.get("/get_chat/:id/:myId", async (req, res) => {
  let chat = await Chat.findOne({ chatId: req.params.id }).exec()
  if (chat) {
    let isRule = chat.users.includes(req.params.myId)
    if (!isRule) res.sendStatus(403)
    else res.send(chat)
  } else res.sendStatus(404)
})

router.post("/chat-create", async (req, res) => {
  let chatId = Math.floor(Math.random() * 9999999999)
  let isChat = await Chat.findOne({ chatId: chatId }).exec()
  if (!isChat) {
    console.log(req.body)
    let chat = await Chat.create({ users: [ req.body.myId, req.body.userId ], 
      date: moment().format("LLL"), chatId: chatId })
    res.send(chat)
  }
})

router.put("/data-save", async (req, res) => {
  let chat = await Chat.findOne({ chatId: req.body.chatId }).exec()
  chat.title = req.body.title
  chat.description = req.body.description
  await chat.save()
  res.send(chat)
})

router.delete("/user-delete/:id/:chatId", async (req, res) => {
  let chat = await Chat.findOne({ chatId: req.params.chatId }).exec()
  let isUser = chat.users.indexOf(req.params.id)
  if (isUser != -1) chat.users.splice(isUser, 1)
  await chat.save()
  res.send(chat)
})

router.put("/add-user", async (req, res) => {
  let chat = await Chat.findOne({ chatId: req.body.chatId }).exec()
  if (chat.users.includes(req.body.user) == false) chat.users.push(req.body.user)
  await chat.save()
  res.send(chat)
})

module.exports = router