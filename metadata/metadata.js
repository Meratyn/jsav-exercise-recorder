const submission = require('../submission/submission');

function setExerciseMetadata(metadata) {
  return submission.addMetadataSuccesfully(metadata);
  }

module.exports = {
  setExerciseMetadata
}
