//TODO: set all try catch statements

const helpers = require('./helpers');

function validateMetadata(metadata) {
  const notEmpthy = helpers.objectIsNotEmpthy(metadata);
  const notArray = helpers.objectIsNotArray(metadata);
  const noInnerObjects = helpers.doesNotContainObjects(metadata);
  return (notEmpthy && notArray && noInnerObjects);
}

function validateStyle(style) {
  // TODO: implement validateStyle
  return true;
}

function validateScore(score) {
  const notEmpthy = helpers.objectIsNotEmpthy(score);
  const notArray = helpers.objectIsNotArray(score);
  const noInnerObjects = helpers.doesNotContainObjects(score);
  return (notEmpthy && notArray && noInnerObjects);
}

function validateOptions(option) {
  const notEmpthy = helpers.objectIsNotEmpthy(option);
  const notArray = helpers.objectIsNotArray(option);
  const noInnerObjects = helpers.doesNotContainObjects(option);
  return (notEmpthy && notArray && noInnerObjects);
}

function validateModelSolution(modelSolution) {
  try {
    helpers.isValidString(modelSolution);
  } catch (error) {
    throw error;
  }
  return true;
}

function validateDataStructure(ds) {
  return helpers.objectIsNotEmpthy(ds);
}

function validateDsId(dsId) {
  return helpers.isValidString(dsId);
}

function validateDsClick(click) {
  // TODO: implement validateDsClick
  return true;
}

function validateStateChange(data) {
  // TODO: implement chackStateChange
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
  modelSolution: validateModelSolution,
  dataStructure: validateDataStructure,
  dsClick: validateDsClick,
  stateChange: validateStateChange,
  gradeButtonClick: validateGradeButtonClick,
  dsId: validateDsId,
}
