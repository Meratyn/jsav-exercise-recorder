const submission = require('../submission/submission');

function setExerciseMetadata(metadata) {
  metadata.browser = navigator.userAgent;
  metadata.recorderName = "JSAV Exercise Recorder";
  metadata.recorderVersion = "1.0.2";
  metadata.windowLocation = window.location.href.split('?')[0];
  const d = new Date();
  metadata.recordingStarted = d.toISOString();
  metadata.recordingTimezone = d.getTimezoneOffset() / 60; // hours to UTC
  return submission.addMetadataSuccesfully(metadata);
}


module.exports = {
  setExerciseMetadata
}
