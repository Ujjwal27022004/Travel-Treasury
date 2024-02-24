// Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: String,
  totalSpent: Number
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
