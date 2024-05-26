const express = require('express');
const {
  createBootcamp,
  deleteBootcamp,
  getAllBootcamps,
  getSingleBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');
const courseRouter = require('./courses');
const { getCourses } = require('../controllers/courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(getAllBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
