const dotenv = require('dotenv');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
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

// @desc     GET course
// @route    /api/v1/courses/:id
// @access   Public

const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course)
    next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     POST course
// @route    /api/v1/bootcamps/:bootcampId/courses
// @access   Private

const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Update course
// @route    /api/v1/courses/:id
// @access   Private

const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course)
    next(
      new ErrorResponse(
        `No course with the id of ${req.params.bootcampId}`,
        404
      )
    );

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc     Delete course
// @route    /api/v1/courses/:id
// @access   Private

const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    next(
      new ErrorResponse(
        `No course with the id of ${req.params.bootcampId}`,
        404
      )
    );

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
