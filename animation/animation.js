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
  const type = eventData.type === 'jsav-exercise-undo' ? 'undo' : 'state-change';
  const animation = submission.state().animation;
  const currentStep = eventData.currentStep || animation[animation.length - 1].currentStep +1;
  newStates.forEach((state, i) => {
    const newState = {
      type,
      tstamp: eventData.tstamp || new Date(),
      currentStep,
      dataStructureId: state.id, 
      state: [ ...state.values]
    }; 
      submission.addAnimationStep.stateChange(newState);
  });
}

function handleUndo(exercise, eventData) {
  const animation = submission.state().animation;
  // const lastStep = animation[animation.length -1];
  // const undoStep = {
  //   type: 'undo',
  //   tstamp: eventData.tstamp || new Date(),
  //   currentStep: lastStep.currentStep,
  //   dataStructureId: lastStep.state.id, 
  //   state: lastStep.state
  // };
  // submission.addAnimationStep.stateChange(undoStep);
  console.log(animation)
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

function dsInsubmissionLastValues(dsId) {
  let initialDs = submission.state().initialState.find(ds => ds.id === dsId);
  const initialDsValues = [...initialDs.values];
  let lastDsValues;
  let stateTypes = ['state-change', 'undo'];
  submission.state().animation.forEach((step,  i) => {
    if(stateTypes.includes(step.type) && step.dataStructureId === dsId) {
      lastDsValues = [...step.state];
    } 
  })
  return lastDsValues || initialDsValues;
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
        if (!arrayInExercise._values.every((v,j) => v === dsInsubmissionLastValues(ds.id)[j])) {
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
  handleUndo,
  handleGradeButtonClick,
}