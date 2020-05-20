const binaryHeap = require('./binaryHeap/binaryHeap');

function getDataStructuresFromExercise(exercise) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    return initialStructures.map(ds => getSingleDataStructure(ds, missingIdHandlingFunctionss))
  }
  return [getSingleDataStructure(initialStructures)];
}

function getSingleDataStructure(initialStructure) {
  const htmlElement = initialStructure.element['0'];
  const id = htmlElement.id;
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
