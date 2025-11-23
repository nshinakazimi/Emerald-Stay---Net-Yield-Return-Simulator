const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Commission rates
const COMMISSION_YEAR_1 = 0.30; // 30%
const COMMISSION_YEAR_2 = 0.25; // 25%
const COMMISSION_YEAR_3_PLUS = 0.20; // 20%

/**
 * Calculate net yield return for 3 years
 */
function calculateNetYield(purchasePrice, monthlyRent, annualRentalFee) {
  // Calculate monthly net income (monthly rent - commission)
  // For monthly, we use year 1 commission rate
  const monthlyCommission = monthlyRent * COMMISSION_YEAR_1;
  const monthlyNetIncome = monthlyRent - monthlyCommission;

  // Calculate annual returns for 3 years
  const annualRent = monthlyRent * 12;
  
  // Year 1: 30% commission
  const year1GrossIncome = annualRent;
  const year1Commission = year1GrossIncome * COMMISSION_YEAR_1;
  const year1NetIncome = year1GrossIncome - year1Commission - annualRentalFee;
  const year1Return = (year1NetIncome / purchasePrice) * 100;

  // Year 2: 25% commission
  const year2GrossIncome = annualRent;
  const year2Commission = year2GrossIncome * COMMISSION_YEAR_2;
  const year2NetIncome = year2GrossIncome - year2Commission - annualRentalFee;
  const year2Return = (year2NetIncome / purchasePrice) * 100;

  // Year 3: 20% commission
  const year3GrossIncome = annualRent;
  const year3Commission = year3GrossIncome * COMMISSION_YEAR_3_PLUS;
  const year3NetIncome = year3GrossIncome - year3Commission - annualRentalFee;
  const year3Return = (year3NetIncome / purchasePrice) * 100;

  // Total 3-year return
  const total3YearNetIncome = year1NetIncome + year2NetIncome + year3NetIncome;
  const total3YearReturn = (total3YearNetIncome / purchasePrice) * 100;

  return {
    monthlyNetIncome: parseFloat(monthlyNetIncome.toFixed(2)),
    year1Return: parseFloat(year1Return.toFixed(2)),
    year2Return: parseFloat(year2Return.toFixed(2)),
    year3Return: parseFloat(year3Return.toFixed(2)),
    total3YearReturn: parseFloat(total3YearReturn.toFixed(2)),
    year1NetIncome: parseFloat(year1NetIncome.toFixed(2)),
    year2NetIncome: parseFloat(year2NetIncome.toFixed(2)),
    year3NetIncome: parseFloat(year3NetIncome.toFixed(2))
  };
}

/**
 * Predict yield based on historical data from dataset.csv
 * Uses simple linear regression based on price per unit and location factors
 */
async function predictYield(purchasePrice, monthlyRent) {
  return new Promise((resolve, reject) => {
    const datasetPath = path.join(__dirname, '..', 'dataset.csv');
    const data = [];
    
    // Check if dataset exists
    if (!fs.existsSync(datasetPath)) {
      console.warn('Dataset file not found, skipping prediction');
      resolve(null);
      return;
    }

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.listing_price && row.location_score) {
          data.push({
            price: parseFloat(row.listing_price),
            locationScore: parseFloat(row.location_score),
            isBooked: parseInt(row.is_booked) === 1,
            bedrooms: parseInt(row.bedrooms) || 1,
            surface: parseFloat(row.surface_m2) || 0
          });
        }
      })
      .on('end', () => {
        try {
          if (data.length === 0) {
            resolve(null);
            return;
          }

          // Calculate average occupancy rate from historical data
          const bookedCount = data.filter(d => d.isBooked).length;
          const occupancyRate = bookedCount / data.length;

          // Calculate average location score
          const avgLocationScore = data.reduce((sum, d) => sum + d.locationScore, 0) / data.length;

          // Calculate price per square meter from dataset
          const avgPricePerSqm = data
            .filter(d => d.surface > 0)
            .reduce((sum, d) => sum + (d.price / d.surface), 0) / 
            data.filter(d => d.surface > 0).length;

          // Estimate property characteristics based on purchase price
          // Assuming a typical property based on price range
          const estimatedSurface = purchasePrice / (avgPricePerSqm || 100);
          
          // Calculate annual rent potential
          const annualRentPotential = monthlyRent * 12 * occupancyRate;

          // Predict yield based on historical patterns
          // Adjust for location score (normalize to dataset average)
          const locationAdjustment = avgLocationScore / 10; // Scale to 0-1
          
          // Estimated annual return (simplified model)
          // Based on average yields from similar properties
          const estimatedAnnualNetReturn = (annualRentPotential * 0.75) / purchasePrice * 100; // 75% net after expenses
          
          // Apply location adjustment
          const adjustedPrediction = estimatedAnnualNetReturn * locationAdjustment;

          // Return 3-year prediction
          const threeYearPrediction = adjustedPrediction * 3;

          resolve(parseFloat(Math.max(0, threeYearPrediction).toFixed(2)));
        } catch (error) {
          console.error('Error calculating prediction:', error);
          resolve(null);
        }
      })
      .on('error', (error) => {
        console.error('Error reading dataset:', error);
        resolve(null);
      });
  });
}

module.exports = {
  calculateNetYield,
  predictYield
};

