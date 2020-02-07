"use strict";
const submission = require('../submission/submission');

function handleArrayEvents(eventData) {
  switch(eventData.type) {
    case 'jsav-array-click':
      const clickData = {
        type: 'click',
        tstamp: eventData.tstamp,
        currentStep: eventData.currentStep,
        dataStructureId: eventData.arrayid,
        index: eventData.index
      }
      submission.addAnimationStep.dsClick(clickData);   
  }
  // TODO: check also for state changes?
}

function handleStateChange(exercise, eventData) {
  // Filter to remove undefined elements  
  const newStates = getNewStates(submissionDataStructures(), exercise).filter(s => 
    s && Object.keys(s).length > 0);
  if(newStates.length) {
    addNewStatesToSubmission(eventData, newStates);
    return newStates;
  }  
  return false;
}

function addNewStatesToSubmission(eventData, newStates) {
  const animation = submission.state().animation;
  const currentStep = eventData.currentStep !== undefined ? eventData.currentStep
    : animation[animation.length - 1].currentStep +1;
  newStates.forEach((state, i) => {
    const newState = {
      type: 'state-change',
      tstamp: eventData.tstamp || new Date(),
      currentStep,
      dataStructureId: state.id, 
      state: state.values
    }; 
      submission.addAnimationStep.stateChange(newState);
  });
}

// TODO: support for other data structures
function submissionDataStructures() {
  const dataStructures = submission.state().initialState.map( ds => {
    return {
      type: ds.type,
      id: ds.id,
      values: ds.values
    };
  });  
  return dataStructures;
}

// Returns an empthy array if there is not state change
function getNewStates(dataStructures, exercise) {
  return dataStructures.map((ds, i) => {
    switch(ds.type) {
      case 'array':
        // TODO: make a function for this
        const arrayInExercise = Array.isArray(exercise.initialStructures) ?
        exercise.initialStructures.find(s => s.element['0'].id === ds.id) :
        exercise.initialStructures;
        if (!arrayInExercise._values.every((v,j) => v === ds.values[j])) {
          return { id: ds.id, values: [ ...arrayInExercise._values ] };
        }
        break;
      default:
        return `unknown ds type ${ds.type}`;
    }
  });
}

function handleGradeButtonClick(eventData) {
  submission.addAnimationStep.gradeButtonClick({
    type: "grade",
    tstamp: eventData.tstamp,
    currentStep: eventData.currentStep,
    score: { ...eventData.score }
  });
}


module.exports = {
  handleArrayEvents,
  handleStateChange,
  handleGradeButtonClick,
}