const express = require('express');
const {
  createBootcamp,
  deleteBootcamp,
  getAllBootcamps,
  getSingleBootcamp,
  updateBootcamp,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getAllBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
