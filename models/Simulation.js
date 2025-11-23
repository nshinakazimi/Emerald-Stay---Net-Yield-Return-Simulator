const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  purchasePrice: {
    type: Number,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  annualRentalFee: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  monthlyNetIncome: {
    type: Number,
    required: true
  },
  year1Return: {
    type: Number,
    required: true
  },
  year2Return: {
    type: Number,
    required: true
  },
  year3Return: {
    type: Number,
    required: true
  },
  total3YearReturn: {
    type: Number,
    required: true
  },
  dataDrivenPrediction: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Simulation', simulationSchema);

