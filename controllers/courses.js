const dotenv = require('dotenv');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

dotenv.config({ path: './config/config.env' });

// @desc     GET courses
// @route    /api/v1/courses
// @route    /api/v1/bootcamps/:bootcampId/courses
// @access   Public
const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

module.exports = { getCourses };
