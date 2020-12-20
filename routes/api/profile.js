const express  = require("express")
const router = express.Router()

//@router GET/api/profile
//@des test route
//@access public

router.get("/", (req,res)=>res.send("route"))

module.exports = router