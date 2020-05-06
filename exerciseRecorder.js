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
const modelAnswer = {
  opened: false,
  totalSteps: false,
  ready: false,
  recordingSpeed: 20,
}
Object.seal(modelAnswer);

initialize();

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

function initialize() {
  setSubmissionAndPostUrl();
  submission.reset();
  metad_func.setExerciseMetadata(getMetadataFromURLparams())
  try {
    $(document).off("jsav-log-event");
    $(document).on("jsav-log-event",  function (event, eventData) {
      setTimeout( () => passEvent(eventData), 50);
    });
  } catch (error) {
    console.warn(error)
  }
}

function passEvent(eventData) {
  console.log('EVENT DATA', eventData);
  switch(eventData.type){
    case 'jsav-init':
      def_func.setExerciseOptions(eventData);
      metad_func.setExerciseMetadata(eventData);
      break;
    case 'jsav-recorded':
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
      anim_func.handleArrayEvents(exercise, eventData);
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
    case 'jsav-exercise-model-open':
      modelAnswer.opened = true;
    case 'jsav-exercise-model-init':
      if(!modelAnswer.opened) {
        if(!modelAnswer.totalSteps) {
          modelAnswer.totalSteps = exercise.modelav._redo.length;
        }
        exercise.modelav.SPEED = modelAnswer.recordingSpeed -10;
        modelAnswer.ready = def_func.modelAnswer.recordStepDOM(exercise, modelAnswer.totalSteps);
        def_func.modelAnswer.recordDataStructures(exercise);
        def_func.modelAnswer.recordStepOperations(exercise);
        $('.jsavmodelanswer .jsavforward').click();
        break;
      }
    case 'jsav-exercise-model-forward':
      if(!modelAnswer.opened && !modelAnswer.ready) {
        setTimeout(() => {
          modelAnswer.ready = def_func.modelAnswer.recordStepDOM(exercise, modelAnswer.totalSteps);
          $('.jsavmodelanswer .jsavforward').click();
        }, modelAnswer.recordingSpeed);
        break;
      }
    case String(eventData.type.match(/^jsav-exercise-model-.*/)):
      if (modelAnswer.opened) anim_func.handleModelAnswer(exercise, eventData);
      break;
    case 'jsav-exercise-grade-button':
      break;
    case 'jsav-exercise-grade':
      const progress = submission.state().definitions.modelAnswer.stepsDOM.slice(-1)[0].counterHTML;
      const popUpText = `Recording model answer steps\n ${progress}`;
      const popUp = helpers.getPopUp(popUpText);
      $('body').append(popUp);
      finish(eventData);
      break;
    default:
      console.warn('UNKNOWN EVENT', eventData);
  }
}

function finish(eventData) {
  const progress = submission.state().definitions.modelAnswer.stepsDOM.slice(-1)[0].counterHTML;
  $('#popUpContent').text(`Recording model answer steps\n ${progress}`);
  if(modelAnswer.ready) {
    anim_func.handleGradeButtonClick(eventData);
    def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), post_url);
    submission.reset();
    $('#popUpDiv').remove();
    $(document).off("jsav-log-event");
  } else {
    setTimeout(() => finish(eventData), modelAnswer.recordingSpeed);
  }
}

module.exports = {
  passEvent
}
