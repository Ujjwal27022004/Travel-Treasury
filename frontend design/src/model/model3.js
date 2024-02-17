const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    name: String,
    paidMoney: Number
  });

  const budgetdata = new mongoose.model('budgetdata',memberSchema)
module.exports = budgetdata