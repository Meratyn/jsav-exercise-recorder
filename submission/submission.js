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

function addMetadata(metadata) {
  if(valid.metadata(metadata)) submission.metadata = { ...metadata };
}

function addStyle(style) {
  if (valid.style(style)) submission.definitions.style = { ...style };
}

function addScore(score) {
  if (valid.score(score) && exerciseIsInitialized()) submission.definitions.score = { ...score };
};

function addOptions(options) {
  if(valid.options(options)) submission.definitions.options = { ...options };
}

function addModelAnswerFunction(modelAnswerFunction) {
  if (valid.modelAnswerFunction(modelAnswerFunction)) submission.definitions.modelAnswerFunction = modelAnswerFunction;
}

function addDataStructure(ds) {
  if(valid.dataStructure(ds)) submission.initialState.dataStructures.push(ds);
}

function setDsId(dsIndex, dsId) {
  if(valid.dsId(dsId)) submission.initialState.dataStructures[dsIndex].id = dsId;
}

function addDsClick(data) {
  if(valid.dsClick(data) && exerciseIsInitialized()) submission.animation.push(data);
}

function addGradableStep(data) {
  if (valid.gradableStep(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
  }
}

function addModelAnswerStep(data) {
  if (valid.gradableStep(data)) submission.animation.push(data);
}

function addGradeButtonClick(data) {
  if(valid.gradeButtonClick(data) && exerciseIsInitialized()) {
    submission.animation.push(data);
  }
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
  }
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

const addDefinition = {
  style: addStyle,
  score: addScore,
  options: addOptions,
  modelAnswerFunction: addModelAnswerFunction
};

const addInitialState = {
  dataStructure: addDataStructure,
  setDsId
};

const addAnimationStep = {
  dsClick: addDsClick,
  gradableStep: addGradableStep,
  modelAnswerStep: addModelAnswerStep,
  gradeButtonClick: addGradeButtonClick
};


module.exports = {
  reset,
  state,
  stateAsJSON,
  addMetadata,
  addDefinition,
  addInitialState,
  addAnimationStep,
  checkAndFixLastAnimationStep
}
