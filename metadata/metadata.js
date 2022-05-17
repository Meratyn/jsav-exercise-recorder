const submission = require('../submission/submission');
const version = require('./version');

/*
 * Constructs standard metadata of the exercise and recording.
 */
function setExerciseMetadata(metadata) {
  metadata.browser = navigator.userAgent;
  metadata.recorderName = "JSAV Exercise Recorder";
  metadata.recorderVersion = version;
  metadata.windowLocation = window.location.href.split('?')[0];
  const d = new Date();
  metadata.recordingStarted = d.toISOString();
  metadata.recordingTimezone = d.getTimezoneOffset() / 60; // hours to UTC
  return submission.addStandardMetadata(metadata);
}

module.exports = {
  setExerciseMetadata
}
