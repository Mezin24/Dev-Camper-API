const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
  },

  weeks: {
    type: Number,
    required: [true, 'Please enter a weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please enter a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please enter minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

function updateAverageCost(next) {
  return async function () {
    await this.constructor.getAverageCost(this.bootcamp);
    next();
  };
}

// Call updateAverageCost after save
CourseSchema.post(
  'save',
  updateAverageCost(function () {})
);

// Call updateAverageCost before remove
CourseSchema.post(
  'deleteOne',
  { document: true, query: false },
  updateAverageCost(function () {})
);

module.exports = mongoose.model('Course', CourseSchema);
