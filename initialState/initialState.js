const recorder = require('../exerciseRecorder');
const submission = require('../submission/submission');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');

function setInitialDataStructures(exercise) {
  const initialStructures = exercise.initialStructures;
  dataStructures.getDataStructuresFromExercise(exercise).forEach(dataStructure => {
    submission.addInitialStateSuccesfully.dataStructure(dataStructure);
  });
}

function someIdMissing(exercise) {
  const initialStructures = exercise.initialStructures;
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    initialStructures.map(ds => {
      const htmlElement = ds.element['0'];
      if(!htmlElement.id) return true;
    })
    return false;
  }
  return !!initialStructures.element['0'].id;
}

function fixMissingIds(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  if(Array.isArray(initialStructures)) {
    initialStructures.map(ds => {
      const htmlElement = ds.element['0'];
      if(!htmlElement.id) handleMissingId(htmlElement, passEvent);
    })
  }
  const htmlElement = ds.element['0'];
  if(!htmlElement.id) handleMissingId(htmlElement, passEvent);
}

function handleMissingId(htmlElement, passEvent) {
  tempId = `tempid-${Math.random().toString().substr(2)}`;
  htmlElement.onclick = ((clickData) => {
    passEvent({
    type: 'recorder-set-id',
    tempId: tempId,
    newId: htmlElement.id
    })
    htmlElement.onclick = null;
  });
  return tempId;
}

function getDataStructureOptions(options) {
  const filteredOptions = {};
  for(const key in options) {
    const option = options[key];
    if(typeof(option) === 'function') {
      filteredOptions[key] = option.name;
    } else if (typeof(option) !== 'object') {
      filteredOptions[key] = option;
    }
  }
  return filteredOptions;
}

function setNewId(eventData) {
  const initialState = submission.state().initialState;
  const dsIndex = initialState.dataStructures.findIndex(ds => ds.id === eventData.tempId);
  if(dsIndex >= 0) {
    submission.addInitialStateSuccesfully.setDsId(dsIndex, eventData.newId);
  }
}

function setAnimationHTML(exercise) {
  const html = helpers.getExerciseHTML(exercise);
  submission.addInitialStateSuccesfully.animationHTML(html);
}

module.exports = {
  fixMissingIds,
  setInitialDataStructures,
  setNewId,
  setAnimationHTML,
  someIdMissing,
}
