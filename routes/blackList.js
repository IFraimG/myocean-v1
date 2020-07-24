let express = require('express');
let router = express.Router();
let User = require('../database/users.js');

router.put("/blacklist_add/:id/:myid", async (req, res) => {
  let userId = req.params.id;
  let myId = req.params.myid;
  let user = await User.findOne({ id: myId }).exec();

  let isUser = user.blackList.indexOf(userId);
  let isSubUser = user.subscrise.indexOf(userId);

  if (isUser == -1) user.blackList.push(userId);
  if (isSubUser != -1) user.subscrise.splice(isSubUser, 1);

  let userBan = await User.findOne({ id: userId });
  let isUserBan = userBan.subscrise.indexOf(myId);
  if (isUserBan != -1) userBan.subscrise.splice(isUserBan, 1);

  user.save();
  userBan.save();
  res.send(user);
});

router.delete("/blacklist_delete/:id/:myid", async (req, res) => {
  let id = req.params.id;
  let myid = req.params.myid;
  let user = await User.findOne({ id: myid }).exec();
  let isUser = user.blackList.indexOf(id);
  if (isUser != -1) user.blackList.splice(isUser, 1);
  user.save();
  res.send(user);
});

module.exports = router;