const submission = require('../submission/submission');
const version = require('./version');
const jaalVersion = require('../validation/JAAL/spec/version');

/*
 * Constructs standard metadata of the exercise and recording.
 */
function setExerciseMetadata(metadata) {
  metadata.browser = navigator.userAgent;
  const d = new Date();
  metadata.recordingStarted = d.toISOString();
  metadata.recordingTimezone = -1 * d.getTimezoneOffset() / 60; // hours to UTC
  metadata.jaalVersion = jaalVersion;
  metadata.jaalGenerator = "JSAV Exercise Recorder " + version;
  const windowLocation = window.location.href.split('?')[0];
  const linkParts = windowLocation.split("/");
  const exercise = linkParts[linkParts.length - 1];
  metadata.exercise = {
    "name": exercise,
    "collection": "CS-A1141/CS-A1143",
    "running location": windowLocation
  }
  return submission.addStandardMetadata(metadata);
}

module.exports = {
  setExerciseMetadata
}
