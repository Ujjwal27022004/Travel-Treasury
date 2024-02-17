const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/UV", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(()=>{
    console.log("Connect")
})
.catch((error)=>{
    console.log("connection error",error)
})