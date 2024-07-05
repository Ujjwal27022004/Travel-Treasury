const express = require('express')
const mongoose = require('mongoose')
const app = express()
require("./db/db.js")

const bodyParser = require('body-parser');

// const ejs = require ('ejs')
const hbs = require('hbs')
const path = require('path')

const userdata = require("./model/model.js")
const contactdata = require("./model/model2.js")
// const Expense = require("./model/model3.js")

const template_path = path.join(__dirname, "../template/views")

app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, "../template/views")));//for css file

app.use(express.urlencoded({ extended: false }))

// app.set('view engine','ejs')
app.set('view engine', 'hbs')
app.set('views', template_path)


// app.get("",(req,res)=>{
//     res.send("Hello world")
// })

app.get("", (req, res) => {
    res.render("home.hbs")
})
// ------------------------------------------Home------------------------------
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/loginpage", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.passwordnodemn

        const getemail = await userdata.findOne({ email: email })
        // console.log(getemail)
        // res.send(getemail)

        if (getemail.password === password) {
            res.render("home")
        }
        else {
            res.send("Password is incorrect")
        }
    } catch (error) {
        res.send(error)
    }
})
// -----------------------------------------login------------------------------
app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/userinfo", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.cpassword

        if (password === cpassword) {
            const userinfo = new userdata({
                name: req.body.name,
                Email: req.body.Email,
                password: req.body.password,
                cpassword: req.body.cpassword,


            },

            )


            const postData = await userinfo.save()
            res.send(postData)

        }
        else {
            res.send("password are not matching")
        }
    } catch (error) {
        res.send(error)
    }
})
// ----------------------------------------signup-----------------------------------------

app.get("/contact", (req, res) => {
    res.render("contact_us")
})


app.post("/contactinfo", async (req, res) => {
    const contactinfo = new contactdata({
        name: req.body.name,
        email: req.body.email,
        phoneno: req.body.phoneno,
        message: req.body.message
    })

    const postcontactData = await contactinfo.save()
    console.log("Contact data saved:", postcontactData);
    res.send(postcontactData)
})
// .........................................contact userdata....................................................




let currentGroupName = "";
let Expense; // Dynamic model for the current group name

// Modify the schema to include name, amount, and total fields
const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    total: Number
});

// Create a function to generate the model dynamically based on group name
const getExpenseModel = (groupName) => mongoose.model(`${groupName}`, expenseSchema);

app.get('/budget', (req, resp) => {
    resp.render('budget', { currentGroupName });
});

app.post('/set-group-name', (req, res) => {
    const { groupName } = req.body;

    if (!groupName) {
        return res.status(400).json({ error: 'Invalid group name' });
    }

    // Set the current group name
    currentGroupName = groupName;

    // Create the dynamic model for the current group name
    Expense = getExpenseModel(currentGroupName);

    res.status(200).json({ success: true, groupName });
});

app.post('/save-expense', async (req, res) => {
    const { name, amount } = req.body;
    console.log(name, amount)

    if (!name || !amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    try {
        // Create a new expense with name and amount
        const newExpense = new Expense({ name, amount });

        // Save the expense to the database
        await newExpense.save();

        // Calculate and update the total for the current group
        const total = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        await Expense.updateMany({}, { $set: { total: total[0].total } });
        console.log(req.body)

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get-expense-data', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json({ expenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/updateCollection', async (req, res) => {
    try {
        const { group, data } = req.body;

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
// Add a new route to render the page with input for the group name
app.get('/class', (req, res) => {
    res.render('class');
});

// Handle the form submission from the group name input page




// Handle the form submission from the group name input page
app.post('/group-data', async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const Expense = getExpenseModel(groupName);

        if (!Expense) {
            return res.status(404).json({ error: 'Expense model not found for group' });
        }

        // Fetch individual totals
        const aggregateResult = await Expense.aggregate([
            { $group: { _id: '$name', totalAmount: { $sum: '$amount' } } }
        ]);

        // Construct an array to store each person's name, total, equal share, difference, and transactions
        const individualTotals = aggregateResult.map((result) => ({
            name: result._id,
            total: result.totalAmount,
            equalShare: 0, // Placeholder for equal share
            difference: 0, // Placeholder for difference
            diffrence2: 0,
            amountToTransfer: 0,
            transactions: [] // Placeholder for transactions
        }));

        // Calculate total amount spent in the trip
        const totalTripExpense = individualTotals.reduce((acc, person) => acc + person.total, 0);

        // Determine the number of members involved in the trip
        const numMembers = individualTotals.length;

        // Calculate equal share per person
        const equalSharePerPerson = totalTripExpense / numMembers;

        // Calculate difference for each person
        individualTotals.forEach(person => {
            person.equalShare = equalSharePerPerson;
            person.difference = person.total - equalSharePerPerson;
            person.difference2 = person.total - equalSharePerPerson;
            console.log(`Person: ${person.name}, Total: ${person.total}, Equal Share: ${equalSharePerPerson}, Difference: ${person.difference}`);
        });

        // Generate transactions
        const debtors = individualTotals.filter(person => person.difference < 0);
        const creditors = individualTotals.filter(person => person.difference > 0);

        debtors.forEach(debtor => {
            creditors.forEach(creditor => {
                if (debtor.difference < 0 && creditor.difference > 0) {
                    const amountToTransfer = Math.min(Math.abs(debtor.difference), creditor.difference);
                    debtor.transactions.push({
                        from: creditor.name,
                        to: debtor.name,
                        amount: amountToTransfer
                    });
                    creditor.difference -= amountToTransfer;
                    debtor.difference += amountToTransfer;
                    debtor.amountToTransfer += amountToTransfer;


                    console.log(`Amount to transfer from ${creditor.name} to ${debtor.name}: ${debtor.amountToTransfer}`);

                }
            });
        });

        const individualTotals2 = JSON.stringify(individualTotals);

        // Render the group_data view and pass the aggregated data
        res.render('group_data', { individualTotals2, individualTotals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// res.render('group_data', { expenses });










//----------------------------------------class page-----------------------------------------------------------
app.get("*", (req, res) => {
    res.render("404")
})
//----------------------------------------ERROR page-----------------------------------------------------------



app.listen(3000, () => {
    console.log(`listening to port 3000`)
})