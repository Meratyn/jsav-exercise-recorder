const helpers = require('./helpers');
const valid = require('./validate');

// TODO: set all try catch statements


const submission =  {
  metadata: {},
  definitions: {
    style: {},
    score: {},
    options: {},
    modelAnswerFunction: "",
    modelAnswerSteps: [],
  },
  initialState: {
    dataStructures: [],
    animationDOM: ""
  },
  animation: []
};

Object.seal(submission);
Object.seal(submission.definitions);

function reset() {
  submission.metadata = {};
  submission.definitions = {
    style: {},
    score: {},
    options: {},
    modelAnswerFunction: "",
    modelAnswerSteps: [],
  };
  submission.initialState = {
    dataStructures: [],
    animationDOM: ""
  };
  submission.animation = [];
}

function state() {
  const metadata = helpers.copyObject(submission.metadata);
  const definitions = helpers.copyObject(submission.definitions);

  // TODO: change to support new DSs
  const initialState = {
    dataStructures: submission.initialState.dataStructures.map(ds => helpers.copyObject(ds)),
    animationDOM: submission.initialState.animationDOM
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

function addMetadataSuccesfully(metadata) {
  if(valid.metadata(metadata)) {
    submission.metadata = { ...metadata };
    return true;
  }
  return false;
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
    submission.definitions.modelAnswerFunction = modelAnswerFunction;
    return true;
  }
  return false;
}

function addModelAnswerStep(data) {
  if (valid.modelAnswerStep(data)) {
    submission.definitions.modelAnswerSteps.push(data);
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

function addAnimationDOM(dom) {
  if(valid.animationDOM(dom)) {
    submission.initialState.animationDOM = dom;
    return true;
  }
  return false;
}

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
  if(submission.initialState.dataStructures.length === 0){
    let message = 'Animation initialization data is missing.\n'
    + 'Exercise is not being recorded for animation: '
    + 'did the exercise emit javas-exercise-init event?'
    + '\nIf you are submitting again the same exercise, try first reloading the page'
    console.warn(message);
    return false;
  }
  return true;
}

const addDefinitionSuccesfully = {
  style: addStyle,
  score: addScore,
  options: addOptions,
  modelAnswerFunction: addModelAnswerFunction
};

const addInitialStateSuccesfully = {
  dataStructure: addDataStructure,
  setDsId,
  animationDOM: addAnimationDOM,
};

const addAnimationStepSuccesfully = {
  dsClick: addDsClick,
  gradableStep: addGradableStep,
  modelAnswerStep: addModelAnswerStep,
  gradeButtonClick: addGradeButtonClick
};


module.exports = {
  reset,
  state,
  stateAsJSON,
  addMetadataSuccesfully,
  addDefinitionSuccesfully,
  addInitialStateSuccesfully,
  addAnimationStepSuccesfully,
  checkAndFixLastAnimationStep
}
