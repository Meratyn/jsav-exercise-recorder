const submission = require('../../submission/submission');
const modelAnswerDefinitions = require("../../definitions/model-answer/model-answer-definitions.js");

function handleModelAnswer(exercise, eventData) {
  const type = String(eventData.type.match(/model.*/))
  const currentStep = eventData.currentStep;
  switch(type) {
    case 'model-init':
      break;
    case 'model-recorded':
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
          submission.addAnimationStepSuccesfully.modelAnswer(newStep);
        } catch (error) {
          console.warn(`Could not add model answer step to animation: ${error}`)
        }
      }
      break;
  }
}


module.exports = {
  handleModelAnswer,
}
