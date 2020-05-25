const binaryHeap = require('./binaryHeap/binaryHeap');
const graph = require('./graph/graph');
const list = require('./list/list');


function getDataStructuresFromExercise(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  const dataStructures = [];
  // If initialDataStructures is an Array, it means there is more than one data structure
  if(Array.isArray(initialStructures)) {
    return initialStructures.map(ds => {
      if(passEvent) return getSingleDataStructure(ds, passEvent);
      else return getSingleDataStructure(ds);
    })
  }
  if(passEvent) return [getSingleDataStructure(ds, passEvent)];
  else return [getSingleDataStructure(ds)];
}

function getSingleDataStructure(initialStructure, passEvent) {
  const htmlElement = initialStructure.element[0];
  const id = (!htmlElement.id && passEvent)?
  handleMissingId(htmlElement, passEvent): htmlElement.id;
  let type =  getDataStructureType(htmlElement.className);
  if(type === 'array' && binaryHeap.isBinaryHeap(initialStructure)) {
    return binaryHeap.getBinaryHeap(initialStructure);
  }
  else if (type === 'array') {
    return {
      type,
      id,
      values: [ ...initialStructure._values ],
    }
  }
  else if (type === 'graph') {
    return graph.getGraph(initialStructure)
  }
  else if (type === 'list') {
    return list.getList(initialStructure);
  }
  return {
    type: type,
    id
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

function handleMissingId(htmlElement, passEvent) {
  const tempId = `tempid-${Math.random().toString().substr(2)}`;
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

module.exports = {
  getDataStructuresFromExercise
}
