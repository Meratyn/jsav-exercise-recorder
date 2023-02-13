//
// submission.js
//
// This module contains data structures and functions for the exercise
// recording in JAAL format.
//
const helpers = require('./helpers');
// const valid = require('./validate');



// TODO: set all try catch statements

//
// Basic structure of the exercise recording.
// Format: JAAL (JSON Algorithm Animation Language).
//
const submission =  {
  metadata: {},
  definitions: {
    style: {},
    score: {},
    options: {},
    modelAnswer: {
      function: "",
      steps: []
    },
  },
  initialState: {
    dataStructures: [],
    svg: "",
    modelSvg: "",
    // JAAL 1.0 HTML
    // animationHTML: ""
  },
  animation: []
};

Object.seal(submission);
Object.seal(submission.definitions);

/**
 * Clears all submission data except metadata.
 */
function reset() {
  // Note: submission.metadata is not cleared, because the exercise itself
  // might call addCustomMetadata() in its init() function. After the init()
  // function of the exercise is finished, the JSAV library emits an event
  // type of "jsav-log-event" with subtype "jsav-exercise-reset". The event is
  // then processed by the JSAV Exercise recorder, which calls this reset()
  // function here.
  submission.definitions = {
    style: {},
    score: {},
    options: {},
    modelAnswer: [],
  };
  submission.initialState = {
    dataStructures: [],
    svg: "",
    modelSvg: "",
    // JAAL 1.0 HTML
    // animationHTML: ""
  };
  submission.animation = [];
}

function state() {
  const metadata = helpers.copyObject(submission.metadata);
  const definitions = helpers.copyObject(submission.definitions);

  // TODO: change to support new DSs
  const initialState = {
    dataStructures: submission.initialState.dataStructures.map(ds => helpers.copyObject(ds)),
    svg: submission.initialState.svg,
    modelSvg: submission.initialState.modelSvg
    // JAAL 1.0 HTML
    // animationHTML: submission.initialState.animationHTML
  }
  const animation = submission.animation.map(a => helpers.copyObject(a));
  return {
    metadata,
    definitions,
    initialState,
    animation
  };
}

function stateAsJSON() {
  return JSON.stringify(submission);
}

/**
 * Adds the standard metadata entry to the submission.
 */
function addStandardMetadata(metadata) {
  for (const x in metadata) {
    submission.metadata[x] = metadata[x];
  }
  return true;
}

/**
 * Adds a custom entry to metadata with `name` as key and `data` as value.
 */
function addCustomMetadata(name, data) {
  if (typeof name === "string") {
    submission.metadata[name] = data;
  }
  else {
    console.warn(["addMetadataEntry: could not add custom metadata: ",
      "parameter 'name' has value ", name, " which is not a String."].join(""));
  }
}

function addStyle(style) {
  submission.definitions.style = { ...style };
  return true;
}

function addScore(score) {
  submission.definitions.score = { ...score };
  return true;
};

function addOptions(options) {
  submission.definitions.options = { ...options };
  return true;
}

function addModelAnswerFunction(modelAnswerFunction) {
  // This is a remnant from JAAL 1.0, is this still needed?
  submission.definitions.modelAnswer = [];
  return true;
}

function addModelAnswerStep(step, major) {
  const length = submission.definitions.modelAnswer.length;
  if (major || length === 0) {
    submission.definitions.modelAnswer.push([step]);
  } else {
    submission.definitions.modelAnswer[length - 1].push(step);
  }
  return true;
}

function addModelAnswerInitialSvg(svg) {
  submission.initialState.modelSvg = svg;
}

function addDataStructure(ds) {
  submission.initialState.dataStructures.push(ds);
  return true;
}

function addInitialStateSvg(svg) {
  submission.initialState.svg = svg;
}


function setDsId(dsIndex, dsId) {
  submission.initialState.dataStructures[dsIndex].id = dsId;
  return true;
}

function addDsClick(data) {
  submission.animation.push(data);
  return true;
}

function addGradableStep(data) {
  submission.animation.push(data);
  return true;
}

function addGradeButtonClick(data) {
  submission.animation.push(data);
  return true;
}

function addWatchedModelAnswerStep(data) {
  submission.animation.push(data);
  return true;
}

function checkAndFixLastAnimationStep() {
  try {
    let animation = submission.animation
    let lastIndex = animation.length -1
    let lastStep = animation[lastIndex]
    if(lastStep.type === 'model-recorded') {
      submission.animation.pop();
    }
  } catch (error) {
    console.warn(`Could not remove model answer from last animation step: ${error}`)
    return false;
  }
  return true;
}


const addDefinitionSuccesfully = {
  style: addStyle,
  score: addScore,
  options: addOptions,
  modelAnswerFunction: addModelAnswerFunction,
  modelAnswerStep: addModelAnswerStep,
};

const addInitialStateSuccesfully = {
  dataStructure: addDataStructure,
  setDsId,
  addInitialStateSvg,
  addModelAnswerInitialSvg
  // JAAL 1.0 HTML
  // animationHTML: addAnimationHTML,
};

const addAnimationStepSuccesfully = {
  dsClick: addDsClick,
  gradableStep: addGradableStep,
  gradeButtonClick: addGradeButtonClick,
  modelAnswer: addWatchedModelAnswerStep
};


module.exports = {
  reset,
  state,
  stateAsJSON,
  addStandardMetadata,
  addCustomMetadata,
  addDefinitionSuccesfully,
  addInitialStateSuccesfully,
  addAnimationStepSuccesfully,
  checkAndFixLastAnimationStep
}
