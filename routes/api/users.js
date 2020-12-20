const express  = require("express")
const router = express.Router()
const {check, validationResult} = require("express-validator/check")
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const gravatar = require("gravatar")
const config = require("config")
const jwt = require("jsonwebtoken")

//@router POST/api/users
//@des register user
//@access public

router.post("/",[

    check("name", "Name is not valid").not().isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password is not valid").isLength({min: 6 })
], async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
       
    }

    try{
        const {name, email, password} = req.body
        let user = await User.findOne({email})
        if(user)
            return res.status(400).json({errors:[{msg:"User already exists"}]})

        const avatar = gravatar.url(email,{s:"200",r:"pg",d:"mm"})
        user = new User({name,email,password,avatar})
        

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)

        await user.save()

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