const express = require('express')
const app = express()
require("./db/db.js")

const bodyParser = require('body-parser');

const hbs = require ('hbs')
const path = require('path')

const userdata = require("./model/model.js")
const contactdata = require("./model/model2.js")
const Member = require("./model/model3.js")

const template_path = path.join(__dirname,"../template/views")

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,"../template/views")));//for css file
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','hbs')
app.set('views',template_path)


// app.get("",(req,res)=>{
//     res.send("Hello world")
// })

app.get("",(req,res)=>{
    res.render("home")
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
  
  app.get('/members', (req, res) => {
    const numMembers = parseInt(req.query.num);
    let inputsHTML = '';
    for (let i = 0; i < numMembers; i++) {
      inputsHTML += `<input type="text" name="member${i+1}" placeholder="Member ${i+1}"><br>`;
    }
    res.send(inputsHTML);
  });

  // API endpoint to submit member names
app.post('/submitMembers', (req, res) => {
  const memberNames = req.body;
  
  // Delete existing members
  Member.deleteMany({}, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting existing members');
    }
    
    // Insert new members
    Member.insertMany(memberNames.map(name => ({ name })))
      .then(() => {

        const Data = userinfo.save()
        res.send(Data)

        console.log('Members added to database');
        res.redirect('/memberTable');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error adding members to database');
      });
  });

  
});


  app.get('/memberTable', (req, res) => {
    Member.find({}, (err, members) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        let tableHTML = '<h2>Member Table</h2><table border="1"><tr><th>Name</th><th>Paid Money</th><th>Total Money Paid</th></tr>';
        members.forEach(member => {
          tableHTML += `<tr><td>${member.name}</td><td><input type="number" name="paidMoney" id="${member._id}" value="${member.paidMoney}" onchange="updatePaidMoney('${member._id}')"></td><td>${calculateTotalMoneyPaid(member._id)}</td></tr>`;
        });
        tableHTML += '</table>';
        res.send(tableHTML);
      }
    });
  });

  function calculateTotalMoneyPaid(memberId) {
    return Member.findById(memberId)
      .then(member => {
        let total = 0;
        member.paidMoney = parseInt(member.paidMoney);
        total += member.paidMoney;
        return total;
      })
      .catch(err => console.error(err));
  }


// ------------------------------------------budget page---------------------------------------------------------
app.get("*",(req,res)=>{
    res.render("404")
})
//----------------------------------------ERROR page-----------------------------------------------------------



app.listen(3000,()=>{
    console.log(`listening to port 3000`)
})