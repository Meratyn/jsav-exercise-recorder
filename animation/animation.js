const submission = require('../submission/submission');
const arrayAnimation = require('./array/array-animation');
const nodeAnimation = require('./node/node-animation');
const edgeAnimation = require('./edge/edge-animation');
const modelAnswerAnimation = require('./model-answer/model-answer-animation');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');
const svg = require('./svg');

// Really Fast Deep Clone library. https://github.com/davidmarkclements/rfdc
const clone = require('rfdc')()
// state variable to keep track of last known state
// used to compare & find what has been changed.
var state = undefined;

/**
 * Get the current data structure state, generate svg image, and then add
 * this to the submission.
 * @param {*} exercise data from JSAV
 * @param {*} eventData from JSAV
 */
function handleGradableStep(exercise, eventData) {
  // const exerciseHTML = helpers.getExerciseHTML(exercise)
  // const dataStructuresState = getDataStructuresState(submissionDataStructures(), exercise);
  const dataStructuresState = dataStructures.getDataStructuresFromExercise(exercise)
  const svgImage = svg.createSvg();
  if(dataStructuresState.length) addStepToSubmission(eventData, dataStructuresState, svgImage);
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

/**
 * Compare a singular edge object against an edge list to see if the 
 * style has been changed or not. Finds the matching edge in the last
 * known state and compares the style against that. 
 * @param edge object to see if it has been changed
 * @param lastState array of edge objects of the last known state
 * @returns whether the edge has been changed or not.
 */
function edgeChanged(edge, lastState) {
  for (var i = 0; i < lastState.length; i++) {
    if (lastState[i].id === edge.id && 
        lastState[i].style !== edge.style) {
          return true;
    }
  }
  return false;
}

/**
 * Grab the last known state and compare it against the current state to
 * attempt to figure out which edge has been clicked. 
 * TODO: Generalise to non-Dijkstra/non-edge-in-graph clicked version.
 * @param dsState data structure state object
 * @returns the clicked egde id, or undefined if no edge has been changed. 
 * Undefined will throw a JAAL1.1 validation error
 */
function getClickedObject(dsState) {
  /**
   * Check if this step is the first one in the array. If so, use the 
   * initial state to check against. If not, use the last recorded state.
   */
  const lastState = (submission.state().animation.length === 0) 
                    ? submission.state().initialState.dataStructures[0]
                    : state;
  // Update state to the current state
  state = dsState[0];
  const lastEdgeList = lastState.edge;
  const currentEdges = state.edge;

  for (var i = 0; i < currentEdges.length; i++) {
    if (edgeChanged(currentEdges[i], lastEdgeList)) {
      return currentEdges[i].id;
    }
  }
  
  return undefined;
}

/**
 * Record the current step as valid JAAL 1.1 and add this to the submission. 
 * @param eventData as passed by JSAV.
 * @param dataStructuresState the state of the current dataStructure. 
 * @param svgImage generated svg image of the current state.
 */
function addStepToSubmission(eventData, dataStructuresState, svgImage) {
  const type = eventData.type === 'jsav-exercise-undo' ? 'undo' : 'click';
  const animation = submission.state().animation;
  const currentStep = eventData.currentStep || 
                      animation[animation.length - 1].currentStep +1;
  
  const startTime = submission.state().metadata.recordingStarted;
  const tstamp = eventData.tstamp || new Date();

  const newState = {
    type: type,
    time: (Date.parse(tstamp) - Date.parse(startTime)),
    currentStep: currentStep,
    image: svgImage,
    gradable: (type === "click"),
  };

  if (type === "click") {
    newState.object = getClickedObject(dataStructuresState);
  }

  try {
    submission.addAnimationStepSuccesfully.gradableStep(newState);
  } catch (error) {
    console.warn(`Could not add state change to animatio: ${error}`)
  }
}

function handleGradeButtonClick(eventData) {
  const startTime = submission.state().metadata.recordingStarted;
  const tstamp = eventData.tstamp || new Date();
  try {
    submission.addAnimationStepSuccesfully.gradeButtonClick({
      type: "grade",
      time: (Date.parse(tstamp) - Date.parse(startTime)),
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
  handleModelAnswer: modelAnswerAnimation.handleModelAnswer,
  edgeChanged
}
