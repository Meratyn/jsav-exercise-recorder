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
      def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state());
      let isTestingApp = window.location.pathname.includes('test');
      if(isTestingApp) {
        window.submission = submission.state();
      }
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

initialize();

let recorder = {
  initialize,
  passEvent
};

export default recorder;
