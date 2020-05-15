const submission = require('../../submission/submission');
const helpers = require('../../utils/helperFunctions');

function handleArrayEvents(exercise, eventData, exerciseHTML) {
  const id = eventData.arrayid;
  switch(eventData.type) {
    case 'jsav-array-click':
      const clickData = {
        type: 'array-click',
        tstamp: eventData.tstamp,
        currentStep: eventData.currentStep,
        dataStructure: {
          id,
          values: getArrayValues(exercise.initialStructures, id)
        },
        index: eventData.index,
        animationHTML: helpers.getExerciseHTML(exercise)
        }
      try {
        submission.addAnimationStepSuccesfully.dsClick(clickData);
      } catch (error) {
        console.warn(`Could not set array click in animation: ${error}`);
      }
  }
}

function getArrayValues(initialStructures, id) {
  const moreThanOneArrayInExercise = Array.isArray(initialStructures);
  if (moreThanOneArrayInExercise) {
    const array = initialStructures.find( ds => ds.element['0'].id === id)
    return [ ...array._values ];
  }
  return [ ...initialStructures._values ];
}

module.exports = {
  handleArrayEvents
}
