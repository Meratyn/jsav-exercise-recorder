const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest/services');
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
      if(def_func.setFinalGrade(eventData)){
        window.submission = submission.state();
        services.sendSubmission(submission.state());
        window.alert('To see the submitted file go to the JAAL Animation File page\nTo see the animation go to the Animation page')
      }
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

function detach() {
  $(document).off("jsav-log-event");
}

window.initializeRecorder = initialize;
window.detachRecorder = detach;

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
