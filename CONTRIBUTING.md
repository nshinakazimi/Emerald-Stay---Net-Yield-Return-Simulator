# Contributing to Emerald Stay Net Yield Simulator

## Project Overview

So this is basically a Node.js/Express.js web app I built to calculate net yield returns for property investments. I'm using MongoDB for storing data, EJS for the templates, and Bootstrap 5 for the UI.

## Code Structure

### Backend Architecture

- **Server Entry Point**: `server.js`
  - Sets up Express app
  - Configures middleware
  - Connects to MongoDB
  - Registers routes

- **Models**: `models/Simulation.js`
  - MongoDB schema using Mongoose
  - Defines simulation data structure
  - Includes validation rules

- **Routes**: `routes/`
  - `simulator.js`: Handles simulator form display and submission
  - `admin.js`: Handles admin panel views

- **Services**: `services/calculationService.js`
  - Business logic for calculations
  - Static yield calculations
  - Data-driven prediction algorithm

### Frontend Architecture

- **Templates**: `views/`
  - EJS templates with Bootstrap 5
  - Partials for reusable components (header, footer)
  - Responsive design patterns

- **Static Assets**: `public/`
  - CSS: Custom styles for Emerald Stay brand
  - JavaScript: Form validation and interactivity

## Development Guidelines

### Code Style

I've tried to keep things consistent, so here's what I'm doing:

1. **JavaScript**
   - I use ES6+ syntax
   - I prefer async/await over callbacks for async stuff
   - I try to use meaningful variable names (makes debugging easier)
   - I add comments when the logic gets tricky
   - I indent with 2 spaces

2. **EJS Templates**
   - I use Bootstrap 5 utility classes a lot
   - I made sure everything is responsive (mobile-first approach)
   - I try to use semantic HTML where possible
   - I included error handling in the views

3. **CSS**
   - I use CSS custom properties (variables) for the brand colors
   - I kind of follow BEM-like naming conventions
   - I made sure it's mobile responsive
   - I use Bootstrap classes whenever I can

### Database Schema

I set up the Simulation model with these fields:
- Input fields: purchasePrice, monthlyRent, annualRentalFee, email
- Calculated fields: monthlyNetIncome, year1Return, year2Return, year3Return, total3YearReturn
- Prediction: dataDrivenPrediction
- Metadata: createdAt

**Important**: If you're modifying the schema, keep in mind:
- You might need to migrate existing data
- Try to keep things backward compatible if possible
- Don't forget to update validation rules

### Calculation Logic

I put all the calculation logic in `services/calculationService.js`. Here's what I implemented:

1. **Static Calculations** (`calculateNetYield`)
   - Commission rates: 30% (Year 1), 25% (Year 2), 20% (Year 3+)
   - Calculates monthly net income
   - Calculates annual return percentages
   - Calculates total 3-year return

2. **Data-Driven Prediction** (`predictYield`)
   - Reads dataset.csv asynchronously
   - Calculates historical occupancy rates
   - Adjusts for location factors
   - Returns a 3-year prediction percentage

**If you're modifying this**:
- Make sure the formulas match what I need for the business logic
- Test edge cases (zero values, negative numbers, etc.)
- Handle errors gracefully (missing dataset, invalid data)

### Adding New Features

If you're adding new features, here's how I've organized things:

1. **New Routes**
   - Create a route file in the `routes/` directory
   - Register it in `server.js`
   - Add validation (I use express-validator)
   - Create the corresponding views

2. **New Database Fields**
   - Update the `models/Simulation.js` schema
   - Add it to the form submission handler
   - Update the views to display the new fields
   - You might need to migrate existing data

3. **New Calculations**
   - Add functions to `services/calculationService.js`
   - Export the new functions
   - Update routes to use the new calculations
   - Update views to display the results

### Testing Considerations

When you're making changes, here's what I usually check:

1. **Input Validation**
   - Test with invalid inputs (negative numbers, non-numeric stuff)
   - Test with boundary values (zero, very large numbers)
   - Test email validation

2. **Database Operations**
   - Handle connection errors gracefully
   - Handle duplicate entries if that's relevant
   - Test with an empty database

3. **UI/UX**
   - Test on mobile devices (I made it responsive, so make sure it still works)
   - Make sure error messages show up correctly
   - Check loading states

4. **Calculation Accuracy**
   - Verify formulas match what I need
   - Test with known inputs and expected outputs
   - Check rounding and precision

### Common Patterns

1. **Error Handling**
   ```javascript
   try {
     // operation
   } catch (error) {
     console.error('Error message:', error);
     // Handle error appropriately
   }
   ```

2. **Validation**
   ```javascript
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.render('view', { errors: errors.array() });
   }
   ```

3. **Async Operations**
   ```javascript
   const result = await someAsyncOperation();
   ```

4. **Database Queries**
   ```javascript
   const simulations = await Simulation.find().sort({ createdAt: -1 });
   ```

## File Modification Guidelines

### When Editing Existing Files

1. **Preserve Existing Functionality**
   - Please don't break existing features
   - Try to keep things backward compatible
   - Update related files if you change the schema or logic

2. **Follow Existing Patterns**
   - Match my code style
   - Use similar naming conventions
   - Follow the architecture I've set up

3. **Update Documentation**
   - Update README.md if behavior changes
   - Update this file if patterns change
   - Add comments for complex logic

### When Creating New Files

1. **File Naming**
   - I use camelCase for JavaScript files
   - I use lowercase for configuration files
   - I try to use descriptive names

2. **Structure**
   - Put files in the appropriate directories
   - Follow the existing directory structure
   - Don't forget to include necessary imports/exports

## Docker Considerations

1. **Container Setup**
   - The Dockerfile installs dependencies
   - docker-compose.yml orchestrates the services
   - I set up volumes to mount dataset.csv and the code

2. **Environment Variables**
   - I use .env.example as a template
   - Don't commit .env files (I don't want secrets in the repo)
   - If you add new environment variables, document them

3. **Database Persistence**
   - MongoDB data is stored in a named volume
   - Use `docker-compose down -v` to reset (only for development!)

## Data-Driven Prediction Algorithm

Here's how I implemented the prediction algorithm:
1. It reads dataset.csv
2. Calculates occupancy rate from the `is_booked` field
3. Averages location scores
4. Estimates property characteristics from purchase price
5. Adjusts prediction based on historical patterns

**Things I might improve later**:
- More sophisticated ML models
- Time-series analysis
- Feature engineering (bedrooms, surface, etc.)
- Model training and persistence

If you're modifying this:
- Make sure it's compatible with the dataset.csv format
- Handle missing or malformed data
- Consider performance (especially with large datasets)

## Deployment Considerations

1. **Production Settings**
   - I use environment variables for secrets
   - I enable error logging
   - I set NODE_ENV=production

2. **Security**
   - I validate all inputs
   - I sanitize user inputs
   - I use parameterized queries (Mongoose handles this for me)
   - I might add rate limiting for production

3. **Performance**
   - I try to optimize database queries
   - I might cache dataset processing if needed
   - I might add pagination for the admin list

## Common Issues and Solutions

I've run into these issues before, so here's what I usually check:

1. **MongoDB Connection Fails**
   - Check docker-compose.yml service names
   - Verify the MONGODB_URI format
   - Make sure the MongoDB container is running

2. **Dataset Not Loading**
   - Verify the file path (it's relative to services/)
   - Check file permissions
   - Verify the CSV format matches what I expect

3. **EJS Template Errors**
   - Check that variable names match between route and template
   - Verify partial includes use the correct paths
   - Check for unclosed tags

4. **Validation Not Working**
   - Verify express-validator middleware is set up
   - Check that validation rules match form fields
   - Make sure errors are passed to the view

## Contribution Checklist

Before submitting changes, I usually check:

- [ ] Code follows my existing style patterns
- [ ] All inputs are validated
- [ ] Error handling is implemented
- [ ] UI is responsive (test on mobile)
- [ ] Calculations are accurate
- [ ] Database operations handle errors
- [ ] Documentation is updated (if needed)
- [ ] No console.log statements in production code
- [ ] Environment variables are documented

## Questions or Issues

When I encounter issues, I usually:
1. Check error messages carefully
2. Verify database connection
3. Check file paths and imports
4. Review calculation logic
5. Test with sample inputs

For questions about business logic or requirements, check the README.md file for the original specifications.

