const submission = require('../../submission/submission');

// Adds the model answer function as string
function recordModelAnswerFunction(modelAnswerFunction) {
  try {
    submission.addDefinitionSuccesfully.modelAnswerFunction(modelAnswerFunction);
  } catch (error) {
    throw error;
  }
  return true;
}

// function recordModelAnswerStepDOM(exercise) {
//   const promiseArray = [];
//   recording = true;
//   const totalSteps = exercise.modelav._redo.length;
//   for(let i = 0; i < totalSteps; i++) {
//     promiseArray.push(
//       new Promise((resolve, reject) => {
//         setTimeout( () => {
//           const modelAnswerStep = getModelAnswerStep(exercise);
//           submission.addDefinitionSuccesfully.modelAnswerStep(modelAnswerStep);
//           $('.jsavmodelanswer .jsavforward').click();
//           console.log('resolving promsie', i);
//           resolve(modelAnswerStep);
//         }, 1000);
//       })
//     )
//   }
//   Promise.all(promiseArray).then( steps => {
//     console.log('Finished recording model answer', steps);
//     recordig = false;
//   });
// }
function recordModelAnswerStructures(exercise) {
  const modelStructures = exercise.modelStructures;
  if(Array.isArray(modelStructures)) {
    modelStructures.forEach((item) => {
      submission.addDefinitionSuccesfully.modelAnswerDataStructure([ ...item._values ]);
    });
  } else {
    submission.addDefinitionSuccesfully.modelAnswerDataStructure([ ...modelStructures._values ]);
  }
}

function recordModelAnswerOperations(exercise) {
  const redoArray = exercise.modelav._redo
  for(let i = 0; i < redoArray.length; i++) {
    const stepOperations = getModelAnswerStepOperations(redoArray[i].operations);
    submission.addDefinitionSuccesfully.modelAnswerStepOperations(stepOperations);
    };
  }

function getModelAnswerStepOperations(operations) {
  const stepOperations = []
  for(const op in operations) {
    stepOperations.push({
      args: { ...operations[op].args },
      effect: operations[op].effect.toString(),
    })
  }
  return stepOperations;
}

function recordModelAnswerStepDOM(exercise, totalSteps) {
  console.log('REDO', [ ... exercise.modelav._redo ]);
  console.log('EXERCISE', { ...exercise  });
  console.log('MODEL STRUCTURES', [ ...exercise.modelStructures._values ]);
  const recordedSteps = submission.state().definitions.modelAnswer.stepsDOM;
  if(recordedSteps.length <= totalSteps) {
    const modelAnswerStepHTML = getModelAnswerStepHTML();
    submission.addDefinitionSuccesfully.modelAnswerStepDOM(modelAnswerStepHTML);
    return false;
  }
  return true;
}

// function getModelAnswerStep(exercise) {
//   const stepHTML = getModelAnswerStepHTML();
//   return {
//     counterHTML: stepHTML.counterHTML,
//     outputHTML: stepHTML.outputHTML,
//     canvasHTML: stepHTML.canvasHTML,
//   }
// }

function getModelAnswerStepHTML() {
  let counterHTML = $('.jsavmodelanswer .jsavcounter').html();
  let outputHTML = $('.jsavmodelanswer .jsavoutput').html();
  let canvasHTML = $('.jsavmodelanswer .jsavcanvas').html();
  return {counterHTML,  outputHTML, canvasHTML };
}

// function getModelAnswerDataStructuresValues(exercise) {
//   const values = [];
//   const modelStructures = exercise.modelStructures;
//   if(Array.isArray(modelStructures)) {
//     modelStructures.forEach((item) => {
//       values.push([ ...item._values ])
//     });
//     return values;
//   }
//   values.push([ ...modelStructures._values ]);
//   return values;
// }

module.exports = {
  recordModelAnswerFunction,
  recordModelAnswerStructures,
  recordModelAnswerOperations,
  recordModelAnswerStepDOM,
}
