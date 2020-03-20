const submission = require('../submission/submission');

function setExerciseMetadata(metadata) {
  return submission.addMetadata(metadata);
  }


module.exports = {
  setExerciseMetadata
}
