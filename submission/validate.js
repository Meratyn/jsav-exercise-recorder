//TODO: set all try catch statements

const helpers = require('./helpers.js');

function validateOptions(option) {
  try {
    const notEmpthy = helpers.objectIsNotEmpthy(option);
    const notArray = helpers.objectIsNotArray(option);
    const noInnerObjects = helpers.doesNotContainObjects(option);
  } catch (err) {
    console.warn('Exercise Recorder, validating options', err);
    return false;
  }
  return true;
}

function validateMetadata(metadata) {
  try {
    const notEmpthy = helpers.objectIsNotEmpthy(metadata);
    const notArray = helpers.objectIsNotArray(metadata);
    const noInnerObjects = helpers.doesNotContainObjects(metadata);
  } catch (err) {
    console.warn('Exercise Recorder, validating metadata', err);
    return false;
  }
  return true;
}

function validateStyle(style) {
  // TODO: implement validateStyle
  return true;
}

function validateScore(score) {
  try {
    const notEmpthy = helpers.objectIsNotEmpthy(score);
    const notArray = helpers.objectIsNotArray(score);
    const noInnerObjects = helpers.doesNotContainObjects(score);
  } catch (err) {
    console.warn('Exercise Recorder, validating score', err);
    return false;
  }
  return true;
}

function validateModelAnswerFunction(modelAnswer) {
  try {
    helpers.isValidString(modelAnswer);
  } catch (err) {
    console.warn('Exercise Recorder, validating model answer function as string', err);
    return false
  }
  return true;
}

function validateModelAnswerStep(step) {
  const validDataStructures = step.dataStructures.every( ds => validateDataStructure(ds));
  const validOperations = validateModelAnswerStepOperations(step.operations);
  const validHTML = validateModelAnswerStepHTML(step.html);
  return validDataStructures && validOperations && validHTML;
}

function validateDataStructure(ds) {
  try {
    helpers.objectIsNotEmpthy(ds);
  } catch (err) {
    console.warn('Exercise Recorder, validating data structure', err);
    return false;
  }
  return true;
}

function validateModelAnswerStepHTML(data) {
  try {
    helpers.isValidString(data.counterHTML);
    helpers.isValidString(data.outputHTML);
    helpers.isValidString(data.canvasHTML);
  } catch (err) {
    console.warn(`Exercise Recorder, validating model answer HTML`, err);
    return false;
  }
  return true;
}

function validateModelAnswerStepOperations(stepOperations) {
  if (Array.isArray(stepOperations)){
    return true;
  }
  console.warn('Exercise Recorder, validating model answer step operations. It must be an array.');
  return false;
}

function validateDsId(dsId) {
  try {
    helpers.isValidString(dsId);
  } catch (err) {
    console.warn('Exercise Recorder, validating data structure id', err);
    return false;
  }
  return true;
}

function validateAnimationHTML(html) {
  try {
    helpers.isValidString(html);
  } catch (err) {
    console.warn('Exercise Recorder, validating animation HTML', err);
    return false
  }
  return true;
}

function validateDsClick(click) {
  try {
    helpers.objectIsNotEmpthy(click);
  } catch (err) {
    console.warn('Exercise Recorder, validating data structure click', err);
    return false;
  }
  return true;
}

function validateGradableStep(data) {
  try {
    helpers.objectIsNotEmpthy(data);
  } catch (err) {
    console.warn('Exercise Recorder, validating gradable step', err);
    return false;
  }
  return true;
}

function validateWatchedModelAnswerStep(data) {
  try {
    helpers.isValidString(data.type);
    helpers.isValidString(data.tstamp);
    helpers.isValidString(data.modelAnswerHTML);
    helpers.isNumber(data.currentStep);
  } catch (err) {
    console.warn(`Exercise Recorder, validating watched model answer step`, err);
    return false;
  }
  return true;
}

function validateGradeButtonClick(data) {
  // TODO: validateGradeButtonClick
  return true;
}

module.exports = {
  metadata: validateMetadata,
  style: validateStyle,
  score: validateScore,
  options: validateOptions,
  modelAnswerFunction: validateModelAnswerFunction,
  modelAnswerStep: validateModelAnswerStep,
  dataStructure: validateDataStructure,
  dsClick: validateDsClick,
  animationHTML: validateAnimationHTML,
  gradableStep: validateGradableStep,
  gradeButtonClick: validateGradeButtonClick,
  watchedModelAnswerStep: validateWatchedModelAnswerStep,
  dsId: validateDsId,
}
