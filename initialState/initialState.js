const recorder = require("../exerciseRecorder.js")
const submission = require('../submission/submission');
const helpers = require('../utils/helperFunctions');

function setInitialDataStructures(exercise) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    initialStructures.map(ds => getSingleDataStructures(ds))
    .forEach(ds => dataStructures.push(ds));
  } else {
    dataStructures.push(getSingleDataStructures(initialStructures));
  }
  dataStructures.forEach(dataStructure => {
    submission.addInitialStateSuccesfully.dataStructure(dataStructure);
  });
}

function getSingleDataStructures(initialStructure) {
  const htmlElement = initialStructure.element['0'];
  let tempId;
  if (!htmlElement.id) {
    // Arrays miss id untill first click
    tempId = `tempid-${Math.random().toString().substr(2)}`;
    setClickListenerWithId(htmlElement, tempId);
  }
  const id =  (htmlElement.id === "" || htmlElement.id === undefined) ? tempId : htmlElement.id;
  const dataStructure = {
    type: getInitiaStructureType(htmlElement.className),
    id,
    values: [ ...initialStructure._values ],
    options: { ...initialStructure.options }
  };
  return dataStructure;
}

function setClickListenerWithId(htmlElement, tempId) {
  htmlElement.onclick = ((clickData) => {
    recorder.passEvent({
    type: 'recorder-set-id',
    tempId: tempId,
    newId: htmlElement.id
    })
    htmlElement.onclick = null;
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
    console.warn(
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
  submission.addInitialStateSuccesfully.setDsId(dsIndex, eventData.newId);
}

function setAnimationHTML(exercise) {
  const html = helpers.getExerciseHTML(exercise);
  submission.addInitialStateSuccesfully.animationHTML(html);
}

module.exports = {
  setInitialDataStructures,
  setNewId,
  setAnimationHTML
}
