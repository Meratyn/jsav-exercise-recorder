"use strict";
$(document).on("jsav-log-event",  function (event, eventData) {
  console.log('EVENT', event);
  console.log('EVENT DATA', eventData);
  passEvent(eventData)
});

const submission = require('./submission/submission');
const metad_func = require('./metadata/metadata');
const def_func = require('./definitions/definitions');
const init_state_func = require('./initialState/initialState');
const anim_func = require('./animation/animation');
const services = require('./rest/services');

let jsav = {};
let exercise = {};

function passEvent(eventData) {
  console.log("EXERCISE", exercise)
  
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
    case 'jsav-exercise-gradeable-step':
      anim_func.handleStateChange(exercise, eventData);
      break;
    case 'jsav-exercise-grade-button':
      anim_func.handleGradeButtonClick(eventData);
      break;
    case 'jsav-exercise-grade':
      def_func.setFinalGrade(eventData) && services.sendSubmission(submission.state());
      break;
    default:
      // We don't know what happened
      // Anyway if the exercise exists we should save the state if it has changed
      console.log('Unknown event', eventData);
      // anim_func.handleStateChange(exercise, eventData);
  }
}

window.passEvent = passEvent;

module.exports = {
  passEvent: passEvent,
};
