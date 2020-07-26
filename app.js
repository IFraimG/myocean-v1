let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser')

let usersRouter = require('./routes/users');
let postsRouter = require('./routes/posts');
let commentsRouter = require('./routes/comments');
let likesRouter = require('./routes/likes');
let groupsRouter = require("./routes/groups")
let authRouter = require('./routes/auth');
let chatRouter = require('./routes/chat');

let Message = require("./database/messages.js");
let Chat = require("./database/chats.js");
let User = require("./database/users.js");
let Posts = require("./database/posts.js");
const { route } = require('./routes/users');

require('./database')

let app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

let ghpages = require('gh-pages');
ghpages.publish('public', {
  branch: "gh-pages",
  repo: "https://github.com/IFraimG/myocean.github.io.git"
}, function(){});

io.on("connection", socket => {
  console.log("конэктыд")
  
  socket.on("disconnect", () => {
    console.log("дисконэктэд")
  })
  socket.on("getMessages", async data => {
    let messages = await Message.find({ chatId: data }).exec()
    for (let msg of messages) {
      msg.author = await User.findOne({ id: msg.authorId }).exec()
    }
    if (messages) io.emit("getMessages", messages)
  })
  socket.on("sendMessages", async data => {
    await Message.create(data.data)
    let messages = await Message.find({ chatId: data.chatId })
    for (let msg of messages) {
      msg.author = await User.findOne({ id: msg.authorId }).exec()
    }
    io.emit("messageAdd", messages)
  })
  socket.on("deleteMessage", async data => {
    await Message.deleteOne({ id: data.msg }).exec()
    let messages = await Message.find({ chatId: data.chatId }).exec()
    for (let msg of messages) {
      msg.author = await User.findOne({ id: msg.authorId }).exec()
    }
    io.emit("getMessages", messages)
  })
  socket.on("addUser", async data => {
    let chat = await Chat.findOne({ charId: data.charId }).exec()
    if (chat.users.includes(data.user.id) == false) chat.users.push(data.user.id)
    await chat.save()
    io.emit("addUser", chat)
  })
  socket.on("getPostsNews", async data => {
    try {
      let posts = []
      for (let id of data) {
        let post = await Posts.find({ authorId: id }).exec()
        for (let item of post) {
          item.author = await User.findOne({ id: id }).exec()
        }
        if (post) posts.push(post)
      }
      io.emit("getPostsNews", [].concat(...posts))
    } catch(err) { console.log(err) }
  })
  socket.on("lastMessage", async data => {
    if (data) io.emit("lastMessage", data)
  })
  socket.on("userOnline", async data => {
    let user = await User.findOne({ id: data.user.id }).exec()
    user.online = data.online
    await user.save()
    io.emit("userOnline", user)
  })
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'uploads')))

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use("/likes", likesRouter)
app.use("/auth", authRouter)
app.use("/group", groupsRouter)
app.use("/chat", chatRouter)

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use("/api/likes", likesRouter)
app.use("/api/auth", authRouter)
app.use("/api/group", groupsRouter)
app.use("/api/chat", chatRouter)

module.exports = { app, server: http };
