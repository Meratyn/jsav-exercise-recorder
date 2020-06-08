//
// model-answer-definitions.js
//
// Model answer recording functionality

const submission = require('../../submission/submission');

// Adds the model answer JavaScript function as a string.
// JAAL: definitions.modelAnswer.function
function recordModelAnswerFunction(modelAnswerFunction) {
  try {
    submission.addDefinitionSuccesfully.modelAnswerFunction(modelAnswerFunction);
  } catch (error) {
    throw error;
  }
  return true;
}

// Records the current step of the model answer.
// JAAL: definitions.modelAnswer.steps[i]
// Parameters:
//     exercise: a JSAV exercise
// Returns:
//     true if the model answer step was recorded successfully, false otherwise
function recordModelAnswerStep(exercise) {
  const redoArray = exercise.modelav._redo;
  if (redoArray.length >= 0) {
    const dataStructures = dataStructuresNode(exercise);
    const operations = operationsNode(redoArray);
    const html = getModelAnswerStepHTML();
    const modelAnswerStep = {
      dataStructures,
      operations,
      html
    };
    submission.addDefinitionSuccesfully.modelAnswerStep(modelAnswerStep);
    return (redoArray.length !== 0);
  }
  return false;
}

// Records the values of the data structures
// in the current step of the model answer.
// JAAL: definitions.modelAnswer.steps[i].dataStructures
function dataStructuresNode(exercise) {
  const modelStructures = exercise.modelStructures;
  const stepDSvalues = [];
  if (Array.isArray(modelStructures)) {
    modelStructures.forEach((item) => {
      stepDSvalues.push([ ...item._values || 'undefined' ]);
    });
  } else {
    stepDSvalues.push([ ...modelStructures._values || 'undefined' ]);
  }
  return stepDSvalues;
}

// JAAL: definitions.modelAnswer.steps[i].operations
function operationsNode(redoArray) {
  if (redoArray.length === 0) {
    return []
  }
  const operations = redoArray[0].operations;
  let stepOperations = [];
  for (const op in operations) {
    stepOperations.push({
      args: getFormattedOperationArgs(operations[op].args),
      effect: operations[op].effect.toString(),
    })
  }
  return stepOperations;
}

// JAAL: definitions.modelAnswer.steps[i].operations[j].args
function getFormattedOperationArgs(args) {
  const formattedArgs = {};
  for (const arg in args) {
    formattedArgs[arg] =
      (typeof(args[arg]) !== 'object' || Array.isArray(args[arg])) ?
      args[arg] :
      `Converted to string when recording to avoid cyclic object value: ${args[arg].toString()}`
  }
  return formattedArgs;
}

// JAAL: definitions.modelAnswer.steps[i].html
function getModelAnswerStepHTML() {
  let counterHTML = $('.jsavmodelanswer .jsavcounter').html();
  let outputHTML = $('.jsavmodelanswer .jsavoutput').html();
  let canvasHTML = $('.jsavmodelanswer .jsavcanvas').html();
  return { counterHTML,  outputHTML, canvasHTML };
}

// Returns the number of the current step in the model answer slideshow
function modelAnswerProgress() {
  return submission.state().definitions.modelAnswer.steps
                   .slice(-1)[0].html.counterHTML;
}


module.exports = {
  recordModelAnswerFunction,
  recordModelAnswerStep,
  modelAnswerProgress,
}
