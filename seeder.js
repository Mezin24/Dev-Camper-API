const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI);
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'))
);
const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_data', 'courses.json'))
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    console.log('Data was added to DB'.blue.inverse);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
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
