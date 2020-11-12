//
// exerciseRecorder.js
//
// This is the main module of the JSAV Exercise Recorder.

// Submodules of the JSAV Exercise Recorder.
// The program code of these modules will be included in the JSAV Exercise
// Recorder bundle file.
const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');

// Services module is not needed, because OpenDSA code will handle the
// communication to A+ LMS through mooc-grader.
//
// const services = require('./rest-service/services');

const helpers = require('./utils/helperFunctions');

//
// Starter code.
//
// This will be run when the JSAV Exercise Recorder bundle file is referred
// by a <script> tag in a HTML document.

// Global namespace. This is accessible in browser as window.JSAVrecorder.
global.JSAVrecorder = {

  // Prototype for a sendSubmission() function. This is a callback function
  // which should perform a HTTP POST request to a grader service of an LMS.
  // It must be set before the JSAV event "jsav-exercise-grade-button" is
  // triggered.
  //
  // Parameters:
  //     recording: JAAL data of the exercise
  sendSubmission: function(recording) {
    console.log("You must set JSAVrecorder.sendSubmission()!");
  },

  // Returns the "submission" variable which contains a JSAV exercise recording.
  // This is useful when both the recorder and player are used in a JSAV
  // exercise: student can play their solution and compare it with model answer.
  getSubmission: function() {
    return submission;
  },

  // Converts an exercise recording to base64
  // Source: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
  recordingToBase64: function(recording) {

    // 1. Convert JSON data into (Unicode) string
    const jsonString = JSON.stringify(recording);

    // 2. Split the string into one byte pieces in the case it is UTF-16
    const codeUnits = new Uint16Array(jsonString.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = jsonString.charCodeAt(i);
    }
    const safeString = String.fromCharCode(new Uint8Array(codeUnits.buffer));

    // 3. Base64 encode the result.
    return btoa(safeString);
  }
}

let jsav = {};
let exercise = {};
let exerciseHTML = "";

// Unique address for asynchronously creating a new graded submission.
// This is defined by the A+ LMS. It is used if grading asynchronously.
// https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
let submission_url;

// A+ LMS defines: where to post the submission.
// https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
let post_url;

const modelAnswer = {
  opened: false,
  ready: false,
  recordingSpeed: 20,
}
Object.seal(modelAnswer);

initialize();

// End of starter code

// Initializer function.
// Binds events of type "jsav-log-event" to function passEvent() (see below).
function initialize() {
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

// According to https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
function getMetadataFromURLparams() {
  // set in LMS
  const max_points = new URL(location.href).searchParams.get('max_points');

  // User identifier.
  // Note: when the exercise is fetched from mooc-grader instead of A+, this
  // feature is not supported.
  //const uid = new URL(location.href).searchParams.get('uid');
  const uid = 0;

  // Ordinal number of the submission which has not yet been done
  // Note: when the exercise is fetched from mooc-grader instead of A+, this
  // feature is not supported.
  //const ordinal_number = new URL(location.href).searchParams.get('ordinal_number');
  const ordinal_number = 0;

  return { max_points, uid, ordinal_number };
}

// Event handler for JSAV events.
//
// Parameters:
// eventData: { type: string,
//              exercise: JSAV exercise, ...}
function passEvent(eventData) {
  console.log('EVENT DATA', eventData);
  switch(eventData.type){
    case 'jsav-init':
      // Set exercise title and instructions
      def_func.setExerciseOptions(eventData);
      break;
    case 'jsav-recorded':
      // All steps of a JSAV slideshow have been created.
      // In practise, this means that the slideshow of the model answer has
      // been created.
      break;
    case 'jsav-exercise-init':
      // A JSAV exercise object was created.
      exercise = eventData.exercise;
      jsav = exercise.jsav;
      def_func.setDefinitions(exercise);
      // init_state_func.fixMissingIds(exercise, passEvent);
      // if(init_state_func.someIdMissing(exercise)) {
      //   init_state_func.fixMissingIds(exercise, passEvent);
      // }
      init_state_func.setInitialDataStructures(exercise, passEvent);
      init_state_func.setAnimationHTML(exercise);
      break;
    case String(eventData.type.match(/^jsav-array-.*/)):
      // JSAV Array data structure events.
      // http://jsav.io/datastructures/array/
      anim_func.handleArrayEvents(exercise, eventData);
      break;
    case String(eventData.type.match(/^jsav-node-.*/)):
      // JSAV Node data structure events
      // http://jsav.io/datastructures/common/
      anim_func.handleNodeEvents(exercise, eventData);
      break;
    case String(eventData.type.match(/^jsav-edge-.*/)):
      // JSAV Edge data structure events
      // http://jsav.io/datastructures/common/
      anim_func.handleEdgeEvents(exercise, eventData);
      break;
    case 'recorder-set-id':
      // This is fired by the initialState.js if the DS ID is set only on first click
      init_state_func.setNewId(eventData);
      break;
    case 'jsav-exercise-undo':
      // User clicks the Undo button
      setTimeout(() => anim_func.handleGradableStep(exercise, eventData), 100);
      break;
    case 'jsav-exercise-gradeable-step':
      anim_func.handleGradableStep(exercise, eventData);
      break;
    case 'jsav-exercise-model-open':
      // User clicks the Model answer button
      modelAnswer.opened = true;
      modelAnswer.ready = true;
      break;
    case 'jsav-exercise-model-init':
      if (!modelAnswer.opened) {
        exercise.modelav.SPEED = modelAnswer.recordingSpeed + 10;
        modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
        $('.jsavmodelanswer .jsavforward').click();
        break;
      }
      break;
    case 'jsav-exercise-model-forward':
      // The Forward button of the model answer animation was clicked.
      if (!modelAnswer.opened && !modelAnswer.ready) {
        // The user had clicked Grade button. Now the model answer recording
        // is in progress.
        setTimeout(() => {
          // Record current step of model answer
          modelAnswer.ready = !def_func.modelAnswer.recordStep(exercise);
          // Trigger this click event again
          $('.jsavmodelanswer .jsavforward').click();
        }, modelAnswer.recordingSpeed);
      }
      else {
        // The user clicked Forward button in the model answer
      }
      break;
    case String(eventData.type.match(/^jsav-exercise-model-.*/)):
      // All user actions with the model answer animation
      if (modelAnswer.opened) {
        anim_func.handleModelAnswer(exercise, eventData);
      }
      break;
    case 'jsav-exercise-grade-button':
      // User clicks the Grade button
      break;
    case 'jsav-exercise-grade':
      // Automatic grading of the exercise has finished
      if(!modelAnswer.opened) {
        const popUpText = `Recording model answer steps\n ${def_func.modelAnswer.progress()}`;
        const popUp = helpers.getPopUp(popUpText);
        $('body').append(popUp);
      }
      finish(eventData);
      break;
    case 'jsav-exercise-reset':
      // User clicks the Reset button
      console.warn('Resetting submission');
      submission.reset();
      break;
    default:
      console.warn('UNKNOWN EVENT', eventData);
  }
}

// Finishes the recording: forwards model answer and records its steps.
// Note: recursive, asynchronous; uses setTimeout() to call itself.
function finish(eventData) {
  if (modelAnswer.ready) {
    anim_func.handleGradeButtonClick(eventData);
    def_func.setFinalGrade(eventData);
    JSAVrecorder.sendSubmission(submission.state())

    submission.reset();
    if (!modelAnswer.opened) {
      $('#popUpDiv').remove();
    }

  } else {
    $('#popUpContent').text(`Recording model answer steps\n ${def_func.modelAnswer.progress()}`);
    setTimeout(() => finish(eventData), modelAnswer.recordingSpeed);
  }
}
