//
// submission.js
//
// This module contains data structures and functions for the exercise
// recording in JAAL format.
//
const helpers = require('./helpers');
const valid = require('./validate');



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
  if(valid.metadata(metadata)) {
    // Assign metadata entry by entry, because at this point of execution,
    // the exercise might have called addCustomMetadata() and we don't want to
    // overwrite that.
    for (const x in metadata) {
      submission.metadata[x] = metadata[x];
    }
    return true;
  }
  return false;
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
  if (valid.style(style)) {
    submission.definitions.style = { ...style };
    return true;
  }
  return false;
}

function addScore(score) {
  if (valid.score(score) && exerciseIsInitialized()) {
    submission.definitions.score = { ...score };
    return true;
  }
  return false;
};

function addOptions(options) {
  if(valid.options(options)) {
    submission.definitions.options = { ...options };
    return true;
  }
  return false;
}

function addModelAnswerFunction(modelAnswerFunction) {
  if (valid.modelAnswerFunction(modelAnswerFunction)) {
    // TODO: Implement model answer function and shift that data.
    submission.definitions.modelAnswer = [];
    return true;
  }
  return false;
}

function addModelAnswerStep(step) {
  if(valid.modelAnswerStep(step)) {
    submission.definitions.modelAnswer.steps.push(step);
    return true;
  }
  return false;
}


function addDataStructure(ds) {
  if(valid.dataStructure(ds)) {
    submission.initialState.dataStructures.push(ds);
    return true;
  }
  return false;
}

// JAAL 1.0 HTML
// function addAnimationHTML(html) {
//   if(valid.animationHTML(html)) {
//     // submission.initialState.animationHTML = html;
//     submission.initialState.animationHTML = " ";
//     return true;
//   }
//   return false;
// }

function setDsId(dsIndex, dsId) {
  if(valid.dsId(dsId)) {
    submission.initialState.dataStructures[dsIndex].id = dsId;
    return true;
  }
  return false;
}

function addDsClick(data) {
  if(valid.dsClick(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
    return true;
  }
  return false;
}

function addGradableStep(data) {
  if (valid.gradableStep(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
    return true;
  }
  return false;
}

function addGradeButtonClick(data) {
  if(valid.gradeButtonClick(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
    return true;
  }
  return false;
}

function addWatchedModelAnswerStep(data) {
  if(valid.watchedModelAnswerStep(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
    return true;
  }
  return false;
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

function exerciseIsInitialized() {
  // JAAL 1.0 HTML
  // if(submission.initialState.animationHTML.length === 0){
  //   let message = 'Animation initialization data is missing.\n'
  //   + 'Exercise is not being recorded for animation: '
  //   + 'did the exercise emit javas-exercise-init event?'
  //   + '\nIf you are submitting again the same exercise, try first reloading the page'
  //   console.warn(message);
  //   return false;
  // }
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
