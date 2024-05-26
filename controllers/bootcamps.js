const dotenv = require('dotenv');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

dotenv.config({ path: './config/config.env' });

// @desc     GET all bootcamps
// @route    /api/v1/bootcamps
// @access   Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  const excludeFields = ['select', 'sort', 'page', 'limit'];
  excludeFields.forEach((field) => delete reqQuery[field]);

  let query;
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  if (req.query.select) {
    const selectFields = req.query.select.split(',').join(' ');
    query = query.select(selectFields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query.skip(startIndex).limit(limit);
  const total = await Bootcamp.countDocuments();
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      next: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      prev: page - 1,
      limit,
    };
  }

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc     GET single bootcamp
// @route    /api/v1/bootcamps/:id
// @access   Public
const getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     POST single bootcamp
// @route    /api/v1/bootcamps/:id
// @access   Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc     PUT single bootcamp
// @route    /api/v1/bootcamps/:id
// @access   Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     DELETE single bootcamp
// @route    /api/v1/bootcamps/:id
// @access   Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  await bootcamp.deleteOne();
  res.status(204).json({ success: true, data: null });
});

// @desc     GET bootcamp by zipcode and distance
// @route    /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  console.log(loc);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Earth Raduis 3,963 mi
  const radius = distance / 4;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
};
