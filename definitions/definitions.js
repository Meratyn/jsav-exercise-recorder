const helpers = require('../utils/helperFunctions');
const submission = require('../submission/submission');

function setExerciseOptions(eventData) {
  submission.addDefinition.options({
    'title': getExerciseTitle(eventData.initialHTML),
    'instructions': getExerciseInstructions(eventData.initialHTML),
  });
}

function setDefinitions(exercise) {
  // TODO: implement setDefinitions(exercise)
  try {
    setModelSolution(exercise.options.model.toString());
  } catch (error) {
    console.warn(`Could nor set model answer when recording animation: ${error.message}`);
    return false;
  }
  return true
}

function setFinalGrade(eventData) {
  return submission.addDefinition.score({ ...eventData.score });
}

function setModelSolution(modelSolution) {
  try {
    submission.addDefinition.modelSolution(modelSolution);
  } catch (error) {
    throw error;
  }
  return true;
}

function getExerciseTitle(initialHTML) {
  let title;
  try {
    title = helpers.extractTextByTagName(initialHTML, 'h1');
  } catch (err) {
    console.warn('Could not get exercise title, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err);
    title = ''
  }
  return title;
}

function getExerciseInstructions(initialHTML) {
  let instructions;
  try {
    instructions = helpers.extractTextByClassName(initialHTML, 'instructions');
  } catch (err) {
    console.warn('Could not get exercise instruction, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err)
    instructions = '';
  }
  return instructions;
}


module.exports = {
  setExerciseOptions,
  setDefinitions,
  setFinalGrade,
}
