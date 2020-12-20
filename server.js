const express = require("express")
const dbConnect = require("./config/db")

dbConnect()

const app = express()

const PORT = process.env.PORT || 5000;

app.use(express.json({extended:false}))

//define routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/auth", require("./routes/api/auth"))




app.get("/",(req,res)=>{
    res.send("Server running")
})

app.listen(PORT,()=>{
    console.log("Server running on port ", PORT)
})