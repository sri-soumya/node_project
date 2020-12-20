const mongoose = require ("mongoose")
const config = require ("config")

const db = config.get("mongoURI")

const dbConnect = async ()=>{
    try{
        await mongoose.connect(db,
            {
                useNewUrlParser:true
            })
    
        console.log("Running mongodb server")
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
   
}

module.exports = dbConnect