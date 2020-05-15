const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest-service/services');
const helpers = require('./utils/helperFunctions');

let jsav = {};
let exercise = {};
let exerciseHTML = "";
// LMS defines: used if grading asynchronously
let submission_url;
// LMS defines: where to post the submission
let post_url;
const modelAnswer = {
  opened: false,
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
      break;
    case 'jsav-recorded':
      break;
    case 'jsav-exercise-init':
      exercise = eventData.exercise;
      jsav = exercise.jsav;
      def_func.setDefinitions(exercise);
      init_state_func.setInitialDataStructures(exercise, passEvent);
      init_state_func.setAnimationHTML(exercise);
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
      exerciseHTML = helpers.getExerciseHTML(exercise)
      setTimeout(() => anim_func.handleGradableStep(exercise, eventData, exerciseHTML), 100);
      break;
    case 'jsav-exercise-gradeable-step':
      anim_func.handleGradableStep(exercise, eventData, passEvent);
      break;
    case 'jsav-exercise-model-open':
      modelAnswer.opened = true;
      modelAnswer.ready = true;
    case 'jsav-exercise-model-init':
      if(!modelAnswer.opened) {
        exercise.modelav.SPEED = modelAnswer.recordingSpeed -10;
        modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
        $('.jsavmodelanswer .jsavforward').click();
        break;
      }
    case 'jsav-exercise-model-forward':
      if(!modelAnswer.opened && !modelAnswer.ready) {
        setTimeout(() => {
          modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
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
      if(!modelAnswer.opened) {
        const popUpText = `Recording model answer steps\n ${def_func.modelAnswer.progress()}`;
        const popUp = helpers.getPopUp(popUpText);
        $('body').append(popUp);
      }
      finish(eventData);
      break;
    case 'jsav-exercise-reset':
      console.warn('Resetting submission');
      submission.reset();
      break;
    default:
      console.warn('UNKNOWN EVENT', eventData);
  }
}

function finish(eventData) {
  if(modelAnswer.ready) {
    anim_func.handleGradeButtonClick(eventData);
    def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state(), post_url);
    submission.reset();
    if(!modelAnswer.opened) {
      $('#popUpDiv').remove();
    }
    $(document).off("jsav-log-event");
  } else {
    $('#popUpContent').text(`Recording model answer steps\n ${def_func.modelAnswer.progress()}`);
    setTimeout(() => finish(eventData), modelAnswer.recordingSpeed);
  }
}
