const submission = require('../../submission/submission');

function handleOpenModelAnswer(exercise, eventData) {
  const type = String(eventData.type.match(/model.*/))
  const currentStep = eventData.currentStep;
  switch(type) {
    case 'model-init':
      break;
    default:
      if(exercise.modelDialog) {
        const newStep = {
          type,
          tstamp: eventData.tstamp || new Date(),
          currentStep,
          modelAnswerDOM: exercise.modelDialog[0].innerHTML
        };
        try {
          submission.addAnimationStepSuccesfully.modelAnswerStep(newStep);
        } catch (error) {
          console.warn(`Could not add model answer step to animation: ${error}`)
        }
      }
      break;
  }
}

function handleModelAnswerAfterGrade(exercise) {
  // document.getElementByClassname('jsavmodelpreparing')
}

function recordModelAnswer(exercise) {
  const modelStructures = [];
  if (Array.isArray(exercise.modelStructures)) {
    exercise.modelStructures.forEach(ds => {
      modelStructures.push(getSingleModelStructure(ds));
    })
  } else {
    modelStructures.push(getSingleDataStructures(exercise.modelStructures))
  }
}

function getModelAnswerStepsDataStructures(exercise) {

}

function getModelAnswerStepsDOM(exercise) {

}

function modelAnswerStepForward(exercise) {

}

module.exports = {
  handleOpenModelAnswer
}
