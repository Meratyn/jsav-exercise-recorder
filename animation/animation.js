const submission = require('../submission/submission');
const arrayAnimation = require('./array/array-animation');
const modelAnswerAnimation = require('./model-answer/model-answer-animation');
const helpers = require('../utils/helperFunctions');


function handleGradableStep(exercise, eventData) {
  const dataStructuresState = getDataStructuresState(submissionDataStructures(), exercise);
  if(dataStructuresState.length) addStepToSubmission(eventData, dataStructuresState);
}

// Returns an empthy array if there is not state change
function getDataStructuresState(dataStructures, exercise) {
  return dataStructures.map((ds, i) => {
    switch(ds.type) {
      case 'array':
        // TODO: make a function for this
        const arrayInExercise = Array.isArray(exercise.initialStructures) ?
        exercise.initialStructures.find(s => s.element['0'].id === ds.id) :
        exercise.initialStructures;
        return { id: ds.id, values: [ ...arrayInExercise._values ] };
        break;
      default:
        return `unknown ds type ${ds.type}`;
    }
  });
}

// TODO: support for other data structures
function submissionDataStructures() {
  const dataStructures = submission.state().initialState.dataStructures.map( ds => {
    return {
      type: ds.type,
      id: ds.id,
      values: ds.values
    };
  });
  return dataStructures;
}

function addStepToSubmission(eventData, dataStructuresState) {
  const type = eventData.type === 'jsav-exercise-undo' ? 'undo' : 'state-change';
  const animation = submission.state().animation;
  const currentStep = eventData.currentStep || animation[animation.length - 1].currentStep +1;
  const newState = {
    type,
    tstamp: eventData.tstamp || new Date(),
    currentStep,
    dataStructuresState,
    animationDOM: helpers.getExerciseDOM(exercise)
  };
  try {
    submission.addAnimationStep.gradableStep(newState);
  } catch (error) {
    console.warn(`Could not add state change to animatio: ${error}`)
  }
}

function handleGradeButtonClick(eventData) {
  try {
    submission.addAnimationStep.gradeButtonClick({
      type: "grade",
      tstamp: eventData.tstamp,
      currentStep: eventData.currentStep,
      score: { ...eventData.score }
    });
  } catch (error) {
    console.warn(`Could not add grade button click to animation: ${error}`)
  }

}

module.exports = {
  handleArrayEvents: arrayAnimation.handleArrayEvents,
  handleGradableStep,
  handleGradeButtonClick,
  handleModelAnswer: modelAnswerAnimation.handleOpenModelAnswer
}
