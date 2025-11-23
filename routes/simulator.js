const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Simulation = require('../models/Simulation');
const { calculateNetYield, predictYield } = require('../services/calculationService');

// Display simulator form
router.get('/simulator', (req, res) => {
  res.render('simulator', { 
    errors: null, 
    data: null,
    results: null
  });
});

// Handle simulation submission
router.post('/simulator', [
  body('purchasePrice')
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a positive number'),
  body('monthlyRent')
    .isFloat({ min: 0 })
    .withMessage('Monthly rent must be a positive number'),
  body('annualRentalFee')
    .isFloat({ min: 0 })
    .withMessage('Annual rental fee must be a positive number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('simulator', {
      errors: errors.array(),
      data: req.body,
      results: null
    });
  }

  try {
    const { purchasePrice, monthlyRent, annualRentalFee, email } = req.body;
    
    // Calculate net yield
    const calculations = calculateNetYield(
      parseFloat(purchasePrice),
      parseFloat(monthlyRent),
      parseFloat(annualRentalFee)
    );

    // Get data-driven prediction
    const prediction = await predictYield(
      parseFloat(purchasePrice),
      parseFloat(monthlyRent)
    );

    // Save simulation to database
    const simulation = new Simulation({
      purchasePrice: parseFloat(purchasePrice),
      monthlyRent: parseFloat(monthlyRent),
      annualRentalFee: parseFloat(annualRentalFee),
      email: email,
      monthlyNetIncome: calculations.monthlyNetIncome,
      year1Return: calculations.year1Return,
      year2Return: calculations.year2Return,
      year3Return: calculations.year3Return,
      total3YearReturn: calculations.total3YearReturn,
      dataDrivenPrediction: prediction
    });

    await simulation.save();

    res.render('simulator', {
      errors: null,
      data: req.body,
      results: {
        ...calculations,
        dataDrivenPrediction: prediction,
        saved: true
      }
    });
  } catch (error) {
    console.error('Error processing simulation:', error);
    res.render('simulator', {
      errors: [{ msg: 'An error occurred while processing your simulation. Please try again.' }],
      data: req.body,
      results: null
    });
  }
});

module.exports = router;

