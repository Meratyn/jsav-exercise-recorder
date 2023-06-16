const helpers = require('../utils/helperFunctions');
const submission = require('../submission/submission');
const modelAnswer = require('./model-answer/model-answer-definitions.js');

// JAAL: definitions.options
function setExerciseOptions(eventData) {
  submission.addDefinitionSuccesfully.options({
    'title': getExerciseTitle(eventData.initialHTML),
    'instructions': getExerciseInstructions(eventData.initialHTML),
  });
}


function setFinalGrade(eventData) {
  const score = {
    "modelSteps": eventData.score.total,
    "studentSteps": eventData.score.student,
    "correctSteps": eventData.score.correct,
    "undoSteps": eventData.score.undo,
  };
  return submission.addDefinitionSuccesfully.score(score);
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
  setFinalGrade,
  modelAnswer: {
    recordStep: modelAnswer.recordModelAnswerStep,
    progress: modelAnswer.modelAnswerProgress
  }
}
