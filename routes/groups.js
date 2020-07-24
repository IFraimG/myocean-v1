let express = require("express")
let router = express.Router()
let Group = require("../database/groups.js")

router.post("/group_create", async (req, res) => {
  let group = req.body.group
  let isGroup = await Group.findOne({id: group.id}).exec()
  if (!isGroup) {
    let dataGroup = await Group.create(group)
    res.send(dataGroup)
  } else {
    res.send("Такой id уже используется")
  }
})

router.get("/get_subscritions/:groups", async (req, res) => {
  let groups = req.params.groups.split(',')
  let arr = []
  if (groups.length > 0) {
    for (let i of groups) {
      let isGroup = await Group.findOne({id: i}).exec()
      arr.push(isGroup)
    }
    res.send(arr)
  }
  else res.send("-")
})

module.exports = router;