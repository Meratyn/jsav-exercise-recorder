const submission = require('../submission/submission');
const dataStructures = require('../dataStructures/dataStructures');
const svg = require('../animation/svg')

function setInitialDataStructures(exercise, passEvent) {
  dataStructures.getDataStructuresFromExercise(exercise,passEvent).forEach(ds => {
    submission.addInitialStateSuccesfully.dataStructure(ds);
  });
  submission.addInitialStateSuccesfully.addInitialStateSvg(svg.createSvg());
}


function setNewId(eventData) {
  const initialState = submission.state().initialState;
  const dsIndex = initialState.dataStructures.findIndex(ds => ds.id === eventData.tempId);
  if(dsIndex >= 0) {
    submission.addInitialStateSuccesfully.setDsId(dsIndex, eventData.newId);
  }
}


module.exports = {
  setInitialDataStructures,
  setNewId,
}
