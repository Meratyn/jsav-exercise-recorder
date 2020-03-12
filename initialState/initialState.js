const recorder = require("../exerciseRecorder.js")
const error_handler = require('../errors/errors');
const submission = require('../submission/submission');

function setInitialDataStructures(exercise) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If there is only one data structure, then initialStructures is an object
  if(Array.isArray(initialStructures)) {
    initialStructures.map(ds => getSingleDataStructures(ds))
    .forEach(ds => dataStructures.push(ds));
  } else {
    dataStructures.push(getSingleDataStructures(initialStructures));
  }
  dataStructures.forEach(dataStructure => {
    submission.addInitialState.dataStructure(dataStructure);
  });
}

function getSingleDataStructures(initialStructure) {
  const domElement = initialStructure.element['0'];
  let tempId;
  if (!domElement.id) {
    // Arrays miss id untill first click
    tempId = `tempid-${Math.random().toString().substr(2)}`;
    setClickListenerWithId(domElement, tempId);
  }
  const id =  (domElement.id === "" || domElement.id === undefined) ? tempId : domElement.id;
  const dataStructure = {
    type: getInitiaStructureType(domElement.className),
    id,
    values: [ ...initialStructure._values ],
    options: { ...initialStructure.options }
  };
  return dataStructure;
}

function setClickListenerWithId(domElement, tempId) {
  domElement.onclick = ((clickData) => {
    recorder.passEvent({
    type: 'recorder-set-id',
    tempId: tempId,
    newId: domElement.id
    })
    domElement.onclick = null;
  });
}


function getInitiaStructureType(className) {
  const rootClassNames =
  [
    'jsavarray',
    'jsavtree',
    'jsavgraph',
    'jsavlist',
    'jsavmatrix'
  ];
  const foundClassNames = rootClassNames.filter(rootClassName =>
    className.includes(rootClassName)
  );
  if(foundClassNames.length !== 1) {
    error_handler.customError(
      `Data structure should have exactly one of the following class names: \n
      ${rootClassNames}\n
      Instead found:\n ${foundClassNames}`
    );
    return;
  }
  // TODO: check subclasses of trees
  return foundClassNames[0].replace('jsav','');
}

function setNewId(eventData) {
  const initialState = submission.state().initialState;
  const dsIndex = initialState.findIndex(ds => ds.id === eventData.tempId);
  submission.addInitialState.setDsId(dsIndex, eventData.newId);
}

module.exports = {
  setInitialDataStructures,
  setNewId,
}
