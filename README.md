# Emerald Stay - Net Yield Return Simulator

This is a web-based net yield return simulator. It calculates monthly net income and 3-year returns for property investments. I included both static calculations based on commission structures and data-driven predictions using historical property data.

## Features

Here's what I built:

- **Net Yield Calculation**: It calculates monthly net income and 3-year return with this commission structure:
  - Year 1: 30% commission
  - Year 2: 25% commission
  - Year 3+: 20% commission
- **Data-Driven Predictions**: I use historical property data (dataset.csv) to predict returns based on occupancy rates and location factors
- **Simulation Storage**: All simulations get saved to MongoDB so I can reference them later
- **Back-Office Interface**: I added an admin panel to view all saved simulations
- **Responsive Design**: I made it fully responsive using Bootstrap 5, optimized for mobile devices
- **Input Validation**: I added both client and server-side validation with error messages

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Frontend**: EJS templates, Bootstrap 5
- **Containerization**: Docker Compose
- **Validation**: express-validator

## Prerequisites

- Docker and Docker Compose installed
- Git (optional, for cloning)

## Installation

1. **Clone or download the project** (if applicable)

2. **Make sure dataset.csv is in the project root**
   - The dataset.csv file should be at the root of the project directory

3. **Create environment file** (optional)
   - The app will work with default settings
   - If you want custom configuration, create a `.env` file based on `.env.example`

4. **Build and start with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Node.js application container
   - Start the MongoDB container
   - Start the Express.js server on port 3000

## Usage

### Accessing the Application

Once the containers are running:

- **Simulator**: Go to http://localhost:3000/simulator
- **Admin Panel**: Go to http://localhost:3000/admin

### Using the Simulator

1. Fill in the form fields:
   - **Purchase Price**: Total purchase price of the property (in €)
   - **Monthly Rent**: Expected monthly rental income (in €)
   - **Annual Rental Fee**: Annual management or service fees (in €)
   - **Email Address**: Your email address (the simulation will be saved)

2. Click **"Calculate Net Yield"**

3. You'll see the results:
   - Monthly net income (after Year 1 commission)
   - 3-year return breakdown by year
   - Total 3-year return percentage
   - Data-driven prediction (if dataset.csv is available)

### Back-Office Interface

- You can view all saved simulations in a table format
- Click "View" to see detailed information for any simulation
- Simulations are sorted by date (newest first)

## Development

### Running Without Docker

If you prefer to run without Docker:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start MongoDB locally** (or use a cloud MongoDB instance)

3. **Set environment variables** (optional):
   ```bash
   export MONGODB_URI=mongodb://localhost:27017/emeraldstay
   export PORT=3000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Project Structure

```
.
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile               # Docker image definition
├── dataset.csv              # Historical property data
├── models/
│   └── Simulation.js        # MongoDB schema
├── routes/
│   ├── simulator.js         # Simulator routes
│   └── admin.js             # Admin routes
├── services/
│   └── calculationService.js # Business logic
├── views/
│   ├── partials/            # Shared EJS partials
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── simulator.ejs        # Main simulator page
│   └── admin/
│       ├── index.ejs        # Admin list page
│       └── details.ejs      # Simulation details page
└── public/
    ├── css/
    │   └── style.css        # Custom styles
    └── js/
        └── main.js          # Client-side JavaScript
```

## Calculation Logic

### Static Calculation

- **Monthly Net Income**: Monthly rent - (Monthly rent × 30% commission)
- **Year N Return**: ((Annual rent - Commission - Annual rental fee) / Purchase price) × 100
- **Total 3-Year Return**: Sum of all 3 years' net income / Purchase price × 100

### Data-Driven Prediction

I built the prediction algorithm to use:
- Historical occupancy rates from dataset.csv
- Average location scores
- Price per square meter patterns
- Occupancy-adjusted rental income projections

## API Endpoints

- `GET /` - Redirects to `/simulator`
- `GET /simulator` - Display simulator form
- `POST /simulator` - Process simulation and save results
- `GET /admin` - List all simulations
- `GET /admin/:id` - View simulation details

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/emeraldstay)

## Troubleshooting

### MongoDB Connection Issues

If you see MongoDB connection errors:
- Make sure the MongoDB container is running: `docker ps`
- Check MongoDB logs: `docker-compose logs mongo`
- Verify the connection string in environment variables

### Dataset Not Found

If data-driven predictions show as N/A:
- Make sure `dataset.csv` exists in the project root
- Check file permissions
- Verify the CSV format matches what I expect

### Port Already in Use

If port 3000 is already in use:
- Change the port in `docker-compose.yml` (in the app service ports section)
- Or stop whatever application is using port 3000

## Stopping the Application

To stop all containers:
```bash
docker-compose down
```

To stop and remove volumes (including database data):
```bash
docker-compose down -v
```

## License

ISC

## Support

If you have issues or questions, check out the CONTRIBUTING.md file for guidelines.

