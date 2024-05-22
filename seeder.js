const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI);
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'))
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data was added to DB'.blue.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data was deleted from DB'.red.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '-i') {
  importData();
}
if (process.argv[2] === '-d') {
  deleteData();
}
