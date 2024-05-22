const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // app.use(logger);
}

app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit
  server.close(() => process.exit(1));
});
