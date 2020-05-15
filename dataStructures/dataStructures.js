const binaryHeap = require('./binaryHeap/binaryHeap');

function getDataStructuresFromExercise(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    return initialStructures.map(ds => getSingleDataStructure(ds, missingIdHandlingFunctionss))
  }
  return [getSingleDataStructure(initialStructures, passEvent)];
}

function getSingleDataStructure(initialStructure, passEvent) {
  const htmlElement = initialStructure.element['0'];
  // DS might miss id untill first click
  let id = !htmlElement.id ? handleMissingId(htmlElement, passEvent) : htmlElement.id;
  let type =  getDataStructureType(htmlElement.className);
  if(type === 'array' && binaryHeap.isBinHeap(initialStructure)) {
    return {
      type: 'binaryHeap',
      id,
      values: [ ...initialStructure._values ],
      tree: binaryHeap.getBinHeap(initialStructure),
    }
  }
  return {
    type: type,
    id,
    values: [ ...initialStructure._values ],
  };
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

function getDataStructureType(className) {
  const rootClassNames =
  [
    'jsavarray',
    'jsavtree',
    'jsavgraph',
    'jsavlist',
    'jsavmatrix'
  ];
  const type = rootClassNames.find(name =>
    className.includes(name)
  )
  if(!type) {
    console.warn(
      `Data structure should have exactly one of the following class names: \n
      ${rootClassNames}\n
      Instead found:\n ${className}`
    );
    return;
  }
  // TODO: check subclasses of trees
  return type.replace('jsav','');
}

module.exports = {
  getDataStructuresFromExercise
}
