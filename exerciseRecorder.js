const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest/services');
const env = require('./.env.js');
let $;

function initialize() {
  $ = window.$
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

let jsav = {};
let exercise = {};

function passEvent(eventData) {
  switch(eventData.type){
    case 'jsav-init':
      submission.reset();
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
      def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), env.SUBMISSION_URL);
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

function setEventOnWindowClose() {
  window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = 'Are you sure you want to leave the exercise?';
  });
}

function setEventOnHashChange() {
  window.addEventListener('hashchange', function() {
    console.log('The hash has changed!')
  }, false);
}

function detach() {
  $(document).off("jsav-log-event");
}

window.initializeRecorder = initialize;
window.detachRecorder = detach;

if(env.EXEC_ENV === 'STATIC') {
  initialize();
  setEventOnWindowClose();
}
else if (env.EXEC_ENV === 'DYNAMIC') {
  setEventOnHashChange();
}



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
