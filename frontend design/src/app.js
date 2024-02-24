const express = require('express')
const mongoose = require('mongoose')
const app = express()
require("./db/db.js")

const bodyParser = require('body-parser');

// const ejs = require ('ejs')
const hbs = require ('hbs')
const path = require('path')

const userdata = require("./model/model.js")
const contactdata = require("./model/model2.js")
const Expense = require("./model/model3.js")

const template_path = path.join(__dirname,"../template/views")

app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname,"../template/views")));//for css file

app.use(express.urlencoded({extended:false}))

// app.set('view engine','ejs')
app.set('view engine','hbs')
app.set('views',template_path)


// app.get("",(req,res)=>{
//     res.send("Hello world")
// })

app.get("",(req,res)=>{
    res.render("home.hbs")
})
// ------------------------------------------Home------------------------------
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/loginpage",async (req,res)=>{
    try {
     const email = req.body.email
     const password = req.body.password
 
     const getemail = await userdata.findOne({email:email})
     // console.log(getemail)
     // res.send(getemail)
 
     if(getemail.password === password)
     {
         res.render("home")
     }
     else{
         res.send("Password is incorrect")
     }
    } catch (error) {
     res.send(error)
    }
 })
// -----------------------------------------login------------------------------
app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/userinfo",async (req,res)=>{
    try {
        const password = req.body.password
        const cpassword = req.body.cpassword
        
    if(password===cpassword){
        const userinfo = new userdata({
            name : req.body.name,
            Email : req.body.Email,
            password : req.body.password,
            cpassword:req.body.cpassword,

            
        },
        
        )
        
        
        const postData = await userinfo.save()
        res.send(postData)
        
    }
    else{
        res.send("password are not matching")
    }
} catch (error) {
    res.send(error)
}
})
// ----------------------------------------signup-----------------------------------------

app.get("/contact",(req,res)=>{
    res.render("contact_us")
})


app.post("/contactinfo",async (req,res)=>{
    const contactinfo = new contactdata({
        name : req.body.name,
        email : req.body.email,
        phoneno : req.body.phoneno,
        message : req.body.message
    })

    const postcontactData = await contactinfo.save()
    console.log("Contact data saved:", postcontactData);
        res.send(postcontactData)
})
// .........................................contact userdata....................................................
app.get('/budget', (req, res) => {
    res.render("budget");
  });
  
  


app.post('/saveData', async (req, res) => {
  try {
    const { group,userData } = req.body;

    if (!group || typeof group !== 'string' || group.trim() === '') {
      return res.status(400).send('Invalid group name');
    }

    if (!Array.isArray(userData) || userData.length === 0) {
      return res.status(400).send('User data must be a non-empty array');
    }

    const GroupExpense = mongoose.model(group, Expense.schema);

    for (let i = 0; i < userData.length; i++) {
      const { name,totalSpent } = userData[i];
      const expense = new GroupExpense({ name,totalSpent });
      await expense.save();
    }

    res.send('Data saved successfully');
    
    console.log('Received data:', userData); // Logging received data
    
    // for (let i = 0; i < userData.length; i++) {
    //   const { name } = userData[i];
    //   const expense = new Expense({ name});
    //   await expense.save();
    //   console.log('Expense saved successfully:', expense); // Logging successful save
    // }
    
    // 
  } catch (error) {
    console.error('Error saving expense:', error); // Logging error
    res.status(500).send('Error saving expense');
  }
});


app.post('/updateCollection', async (req, res) => {
  try {
    const { group,data } = req.body;

    // Assuming each item in 'data' contains name and totalSpent
    for (let i = 0; i < data.length; i++) {
      const { name, totalSpent } = data[i];
      
      // Find the document in the collection and update the totalSpent field
      await Expense.findOneAndUpdate({ name }, { totalSpent });
    }

    res.send('Collection updated successfully');
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).send('Error updating collection');
  }
});
  

 


  

  

// ------------------------------------------budget page---------------------------------------------------------
app.get("*",(req,res)=>{
    res.render("404")
})
//----------------------------------------ERROR page-----------------------------------------------------------



app.listen(3000,()=>{
    console.log(`listening to port 3000`)
})