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

module.exports = {
  handleOpenModelAnswer
}
