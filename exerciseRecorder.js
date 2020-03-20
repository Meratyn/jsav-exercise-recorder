const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest/services');
// const env = require('./.env.js');
// let $;
let jsav = {};
let exercise = {};
// LMS defines: used if grading asynchronously
let submission_url;
// LMS defines: where to post the submission
let post_url;

initialize();
setEventOnWindowClose();

function initialize() {
  setSubmissionAndPostUrl();
  submission.reset();
  metad_func.setExerciseMetadata(getMetadataFromURLparams())
  // $ = window.$
  try {
    $(document).off("jsav-log-event");
    $(document).on("jsav-log-event",  function (event, eventData) {
      console.log('EVENT DATA', eventData);
      passEvent(eventData)
    });
  } catch (error) {
    console.warn(error)
  }
}

function passEvent(eventData) {
  switch(eventData.type){
    case 'jsav-init':
      def_func.setExerciseOptions(eventData);
      metad_func.setExerciseMetadata(eventData);
      break;
    case 'jsav-exercise-init':
      exercise = eventData.exercise;
      jsav = exercise.jsav;
      def_func.setDefinitions(exercise);
      init_state_func.setInitialDataStructures(exercise,passEvent);
      break;
      // Here we handle all array related events
    case String(eventData.type.match(/^jsav-array-.*/)):
      anim_func.handleArrayEvents(eventData);
      break;
    case 'recorder-set-id':
      init_state_func.setNewId(eventData);
      break;
    case 'jsav-exercise-undo':
      setTimeout(() => anim_func.handleStateChange(exercise, eventData), 100);
      break;
    case 'jsav-exercise-gradeable-step':
      anim_func.handleStateChange(exercise, eventData);
      break;
    case 'jsav-exercise-grade-button':
      break;
    case 'jsav-exercise-grade':
      // We remove it because JSAV logs automatically the model solution when grading
      submission.checkAndFixLastAnimationStep();
      anim_func.handleGradeButtonClick(eventData);
      def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), post_url);
      submission.reset();
      $(document).off("jsav-log-event");
      break;
    case String(eventData.type.match(/^jsav-exercise-model-.*/)):
      anim_func.handleModelSolution(exercise, eventData);
      break;
    case 'jsav-recorded':
      break;
    default:
      // We don't know what happened
      console.warn('UNKNOWN EVENT', eventData);
  }
}

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function setSubmissionAndPostUrl() {
  // LMS submission url
  submission_url = new URL(location.href).searchParams.get('submission_url');
  // url where the LMS posts submission data
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


function setEventOnWindowClose() {
  window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = 'Are you sure you want to leave the exercise?';
  });
}

function detach() {
  $(document).off("jsav-log-event");
}

window.initializeRecorder = initialize;
window.detachRecorder = detach;


// if(env.EXEC_ENV === 'STATIC') {
//   initialize();
//   setEventOnWindowClose();
// }
// else if (env.EXEC_ENV === 'STATIC') {
//   setEventOnHashChange();
// }



module.exports = {
  passEvent
}

// let recorder = {
//   initialize,
//   passEvent,
//   reset: submission.reset
// };
//
// export default recorder;
