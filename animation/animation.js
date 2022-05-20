const submission = require('../submission/submission');
const arrayAnimation = require('./array/array-animation');
const nodeAnimation = require('./node/node-animation');
const edgeAnimation = require('./edge/edge-animation');
const modelAnswerAnimation = require('./model-answer/model-answer-animation');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');

// Really Fast Deep Clone library. https://github.com/davidmarkclements/rfdc
const clone = require('rfdc')()

function handleGradableStep(exercise, eventData) {
  const exerciseHTML = helpers.getExerciseHTML(exercise)
  // const dataStructuresState = getDataStructuresState(submissionDataStructures(), exercise);
  const dataStructuresState = dataStructures.getDataStructuresFromExercise(exercise)
  if(dataStructuresState.length) addStepToSubmission(eventData, dataStructuresState, exerciseHTML);
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
      values: clone(ds.values)
    };
  });
  return dataStructures;
}

function addStepToSubmission(eventData, dataStructuresState, exerciseHTML) {
  const type = eventData.type === 'jsav-exercise-undo' ? 'undo' : 'gradeable-step';
  const animation = submission.state().animation;
  const currentStep = eventData.currentStep || animation[animation.length - 1].currentStep +1;

  // Animation steps must be stored with clone() (from Really Fast Deep Clone
  // library), because otherwise every step will be the same in the recording
  // due to JavaScript object references.
  const clonedState = clone(dataStructuresState);
  const clonedHTML = clone(exerciseHTML);
  const newState = {
    type: type,
    tstamp: eventData.tstamp || new Date(),
    currentStep: currentStep,
    state: clonedState,
    // animationHTML: clonedHTML
  };
  try {
    submission.addAnimationStepSuccesfully.gradableStep(newState);
  } catch (error) {
    console.warn(`Could not add state change to animatio: ${error}`)
  }
}

function handleGradeButtonClick(eventData) {
  try {
    submission.addAnimationStepSuccesfully.gradeButtonClick({
      type: "grade",
      tstamp: eventData.tstamp,
      currentStep: eventData.currentStep,
      score: { ...eventData.score },

    });
  } catch (error) {
    console.warn(`Could not add grade button click to animation: ${error}`)
  }
}

module.exports = {
  handleArrayEvents: arrayAnimation.handleArrayEvents,
  handleNodeEvents: nodeAnimation.handleNodeEvents,
  handleEdgeEvents: edgeAnimation.handleEdgeEvents,
  handleGradableStep,
  handleGradeButtonClick,
  handleModelAnswer: modelAnswerAnimation.handleModelAnswer
}
