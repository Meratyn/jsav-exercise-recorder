const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest-service/services');
const helpers = require('./utils/helperFunctions');

let jsav = {};
let exercise = {};
let exerciseDOM = "";
// LMS defines: used if grading asynchronously
let submission_url;
// LMS defines: where to post the submission
let post_url;

initialize();

function initialize() {
  setSubmissionAndPostUrl();
  submission.reset();
  metad_func.setExerciseMetadata(getMetadataFromURLparams())
  try {
    $(document).off("jsav-log-event");
    $(document).on("jsav-log-event",  function (event, eventData) {
      passEvent(eventData)
    });
  } catch (error) {
    console.warn(error)
  }
}

function passEvent(eventData) {
  console.log('EXERCISE', exercise);
  console.log('EVENT DATA', eventData);
  switch(eventData.type){
    case 'jsav-init':
      def_func.setExerciseOptions(eventData);
      metad_func.setExerciseMetadata(eventData);
      break;
    case 'jsav-exercise-init':
      exercise = eventData.exercise;
      jsav = exercise.jsav;
      def_func.setDefinitions(exercise);
      init_state_func.setInitialDataStructures(exercise);
      init_state_func.setAnimationDOM(exercise);
      break;
      // Here we handle all array related events
    case String(eventData.type.match(/^jsav-array-.*/)):
      exerciseDOM = helpers.getExerciseDOM(exercise)
      anim_func.handleArrayEvents(exercise, eventData, exerciseDOM);
      break;
    // This is fired by the initialState.js because JSAV sets array ID only on first click
    case 'recorder-set-id':
      init_state_func.setNewId(eventData);
      break;
    case 'jsav-exercise-undo':
      setTimeout(() => anim_func.handleGradableStep(exercise, eventData), 100);
      break;
    case 'jsav-exercise-gradeable-step':
      exerciseDOM = helpers.getExerciseDOM(exercise)
      anim_func.handleGradableStep(exercise, eventData, exerciseDOM);
      break;
    case 'jsav-exercise-grade-button':
      break;
    case 'jsav-exercise-grade':
      // JSAV emits the model answer event when grade is clicked
      // We remove the last animation step caused by the model answer event
      submission.checkAndFixLastAnimationStep();
      anim_func.handleGradeButtonClick(eventData);
      def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), post_url);
      submission.reset();
      $(document).off("jsav-log-event");
      break;
    case String(eventData.type.match(/^jsav-exercise-model-.*/)):
      anim_func.handleModelAnswer(exercise, eventData);
      break;
    case 'jsav-recorded':
      break;
    default:
      console.warn('UNKNOWN EVENT', eventData);
  }
}

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function setSubmissionAndPostUrl() {
  // LMS defines: used if grading asynchronously
  submission_url = new URL(location.href).searchParams.get('submission_url');
  // LMS defines: where to post the submission
  post_url = new URL(location.href).searchParams.get('post_url');
}

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function getMetadataFromURLparams() {
  // set in LMS
  const max_points = new URL(location.href).searchParams.get('max_points');
  // User identifier
  const uid = new URL(location.href).searchParams.get('uid');
  // Ordinal number of the submission which has not yet been done
  const ordinal_number = new URL(location.href).searchParams.get('ordinal_number');
  return { max_points, uid, ordinal_number };
}

module.exports = {
  passEvent
}
