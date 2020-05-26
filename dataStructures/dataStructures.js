const binaryHeap = require('./binaryHeap/binaryHeap');
const graph = require('./graph/graph');
const list = require('./list/list');
const stack = require('./stack/stack');
const binaryTree = require('./tree/binaryTree');
const tree = require('./tree/tree');

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
  if(passEvent) return [getSingleDataStructure(initialStructures, passEvent)];
  else return [getSingleDataStructure(initialStructures)];
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
  else if (type === 'stack') {
    return stack.getStack(initialStructure);
  }
  else if (type === 'binarytree') {
    return binaryTree.getBinaryTree(initialStructure);
  }
  else if (type === 'tree') {
    return tree.getTree(initialStructure);
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
    'jsavmatrix',
    'jsavstack'
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
  if(type === 'jsavtree' && className.includes('jsavbinarytree')) {
     return 'binarytree';
  }
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
