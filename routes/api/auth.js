const express  = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const {check, validationResult} = require("express-validator/check")
const config = require("config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


//@router GET/api/auth
//@des test route
//@access public

router.get("/", auth, async (req,res)=>{

    try{
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    }catch(e){
        console.error(e.message)
        res.status(500).send("Server error")
    }

})

//@router POST/api/auth
//@des auth user and login
//@access public

router.post("/",[

    check("email", "Email is not valid").isEmail(),
    check("password", "Password is not valid").exists()
], async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
       
    }

    try{
        const {email, password} = req.body
        let user = await User.findOne({email})
        if(!user)
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})

        

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,config.get("jwtToken"),{expiresIn:360000},(err,token)=>{
            if(err)
                throw err

            res.json({token})
        })

        //res.send("User registered")

    }catch(e)
    {
        console.error(e.message)
        res.status(500).send("Server error")
    }
})

module.exports = router