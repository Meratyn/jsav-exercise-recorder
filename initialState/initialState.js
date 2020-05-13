const recorder = require('../exerciseRecorder');
const submission = require('../submission/submission');
const helpers = require('../utils/helperFunctions');

function setInitialDataStructures(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    initialStructures.map(ds => getSingleDataStructures(ds, passEvent))
    .forEach(ds => dataStructures.push(ds));
  } else {
    dataStructures.push(getSingleDataStructures(initialStructures, passEvent));
  }
  dataStructures.forEach(dataStructure => {
    submission.addInitialStateSuccesfully.dataStructure(dataStructure);
  });
}

function getSingleDataStructures(initialStructure, passEvent) {
  const htmlElement = initialStructure.element['0'];
  let tempId;
  if (!htmlElement.id) {
    // Arrays miss id untill first click
    tempId = `tempid-${Math.random().toString().substr(2)}`;
    setClickListenerWithId(htmlElement, tempId, passEvent);
  }
  const id =  (htmlElement.id === "" || htmlElement.id === undefined) ? tempId : htmlElement.id;
  const dataStructure = {
    type: getInitiaStructureType(htmlElement.className),
    id,
    values: [ ...initialStructure._values ],
    options: getDataStructureOptions(initialStructure.options)
  };
  return dataStructure;
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

function setClickListenerWithId(htmlElement, tempId, passEvent) {
  htmlElement.onclick = ((clickData) => {
    passEvent({
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
  const dsIndex = initialState.dataStructures.findIndex(ds => ds.id === eventData.tempId);
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
