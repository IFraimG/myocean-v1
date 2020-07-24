let express = require("express")
let router = express.Router()
let User = require("../database/users.js")
let { jwtsecret } = require("./../jwt")
let jwt = require("jsonwebtoken")
let passport = require("passport")

router.post("/login", async (req, res) => {
  let user = await User.findOne({email: req.body.email}).exec()
  if (!user) return res.status(404).send("Такого пользователя не существует")
  if (!user.checkPassword(req.body.password)) return res.status(400).send("Пароль не верный")
  let token = jwt.sign({
    sub: user.id,
    email: user.email 
  }, jwtsecret)
  res.send(["jwt", "Bearer " + token, user])
})

router.post('/signup', async (req, res, next) => {
  let isUser = await User.findOne({id: req.body.id}).exec()
  let isUserEmail = await User.findOne({ email: req.body.email }).exec()
  if (!isUser && !isUserEmail) {
    let user = await User.create(req.body)
    let token = jwt.sign({
      sub: user.id,
      email: user.email 
    }, jwtsecret)
    res.send(["jwt", "Bearer " + token, user])
  }
  else res.sendStatus(400).send("Такой пользователь уже существует")
})

router.get("/test", passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.send("ы")
})

module.exports = router;