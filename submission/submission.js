const helpers = require('./helpers');
const valid = require('./validate');

const submission =  {
  metadata: {},
  definitions: {
    style: {},
    score: {},
    options: {},
  },
  initialState: [],
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
    
  };
  submission.initialState = [];
  submission.animation = [];
}

function state() {
  const metadata = helpers.copyObject(submission.metadata);
  const definitions = helpers.copyObject(submission.definitions);
 
  // TODO: change to support new DSs
  const initialState = submission.initialState.map(ds => helpers.copyObject(ds));
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
  if(valid.metadata(metadata)) {
    submission.metadata = { ...metadata };
    return JSON.stringify(submission.metadata);
  } 
  return false;
}

function addStyle(style) {
  if (valid.style(style)) {
    submission.definitions.style = { ...style };
    return JSON.stringify(submission.definitions.style);
  }
  return false;
}

function addScore(score) {
  if (valid.score(score)) {
    submission.definitions.score = { ...score };
    JSON.stringify(submission.definitions.score);
  } 
  return false;
};

function addOptions(options) {
  if(valid.options(options)) {
    submission.definitions.options = { ...options };
    return JSON.stringify(submission.definitions.options);
  } 
  return false;
}

function addDataStructure(ds) {
  if(valid.dataStructure(ds)) {
    submission.initialState.push(ds);    
    return JSON.stringify(submission.initialState);
  }
  return false;
}

function setDsId(dsIndex, dsId) {
  if(valid.dsId(dsId)) {
    submission.initialState[dsIndex].id = dsId;
    return JSON.stringify(submission.initialState);
  }
  return false;
}

function addDsClick(data) {
  if(valid.dsClick(data)) {
    submission.animation.push(data);
    return JSON.stringify(submission.animation);
  }
  return false;
}

function addStateChange(data) {
  if(valid.stateChange(data)) {
    submission.animation.push(data);
    return JSON.stringify(submission.animation);
  }
  return false;
}

function addGradeButtonClick(data) {
  if(valid.gradeButtonClick(data)) {
    submission.animation.push(data);
    return JSON.stringify(submission.animation);
  }
  return false;
}

const addDefinition = {
  style: addStyle,
  score: addScore,
  options: addOptions,
};

const addInitialState = {
  dataStructure: addDataStructure,
  setDsId
};

const addAnimationStep = {
  dsClick: addDsClick,
  stateChange: addStateChange,
  gradeButtonClick: addGradeButtonClick,
};


module.exports = {
  reset,
  state,
  stateAsJSON,
  addMetadata,
  addDefinition,
  addInitialState,
  addAnimationStep,
}