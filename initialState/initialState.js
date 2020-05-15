const recorder = require('../exerciseRecorder');
const submission = require('../submission/submission');
const helpers = require('../utils/helperFunctions');
const dataStructures = require('../dataStructures/dataStructures');

function setInitialDataStructures(exercise, passEvent) {
  const initialStructures = exercise.initialStructures;
  dataStructures.getDataStructuresFromExercise(exercise, passEvent).forEach(dataStructure => {
    submission.addInitialStateSuccesfully.dataStructure(dataStructure);
  });
}

// function checkMissingIds(initialStructures, passEvent) {
//   if(Array.isArray(initialStructures)) {
//     initialStructures.forEach(ds => {
//       const htmlElement = ds.element['0'];
//       handleMissingId(htmlElement, passEvent)
//     })
//   } else {
//     const htmlElement = initialStructures.element['0'];
//     handleMissingId(htmlElement, passEvent)
//   }
// }

// function getSingleDataStructure(initialStructure, passEvent) {
//   const htmlElement = initialStructure.element['0'];
//   let id;
//   if (!htmlElement.id) {
//     // Arrays miss id untill first click
//     id = handleMissingId(htmlElement, passEvent);
//   }
//   let type =  getInitiaStructureType(htmlElement.className);
//   if(type === 'array' && isBinaryHeap(initialStructure)) {
//     type = 'binaryHeap';
//     return {
//       type: type,
//       id,
//       values: [ ...initialStructure._values ],
//       tree: getBinaryTreeFromDOM(initialStructure),
//       options: getDataStructureOptions(initialStructure.options)
//     }
//   }
//   return {
//     type: type,
//     id,
//     values: [ ...initialStructure._values ],
//     options: getDataStructureOptions(initialStructure.options)
//   };
// }

// function handleMissingId(htmlElement, passEvent) {
//   tempId = `tempid-${Math.random().toString().substr(2)}`;
//   setClickListenerWithId(htmlElement, tempId, passEvent);
//   return tempId;
// }

// function setClickListenerWithId(htmlElement, tempId, passEvent) {
//   htmlElement.onclick = ((clickData) => {
//     passEvent({
//     type: 'recorder-set-id',
//     tempId: tempId,
//     newId: htmlElement.id
//     })
//     htmlElement.onclick = null;
//   });
// }

// function getInitiaStructureType(className) {
//   const rootClassNames =
//   [
//     'jsavarray',
//     'jsavtree',
//     'jsavgraph',
//     'jsavlist',
//     'jsavmatrix'
//   ];
//   const foundClassNames = rootClassNames.filter(rootClassName =>
//     className.includes(rootClassName)
//   );
//   if(foundClassNames.length !== 1) {
//     console.warn(
//       `Data structure should have exactly one of the following class names: \n
//       ${rootClassNames}\n
//       Instead found:\n ${foundClassNames}`
//     );
//     return;
//   }
//   // TODO: check subclasses of trees
//   return foundClassNames[0].replace('jsav','');
// }

// function isBinaryHeap(initialStructure) {
//   return Object.keys(initialStructure).includes('_tree' && '_treenodes');
// }
//
// function getBinaryTreeFromDOM(initialStructure) {
//   const rootNode = {
//     id: initialStructure._tree.rootnode.element[0].id,
//     htmlInnerText: initialStructure._tree.rootnode.element[0].innerText,
//     childNodes: getChildNodesFromDOM(initialStructure._tree.rootnode)
//   }
//   const binaryHeap = {
//     rootNode,
//     id: initialStructure._tree.element[0].id,
//     htmlInnerText: initialStructure._tree.element[0].innerText
//   }
//
//   function getChildNodesFromDOM(node) {
//     if(!node.childnodes || node.childnodes.length == 0) {
//       return {
//         id: node.element[0].id,
//         edgeToParent: getEdge(node._edgetoparent),
//         htmlInnerText: node.element[0].innerText
//       }
//     }
//     return node.childnodes.map(node => {
//       return {
//         id: node.element[0].id,
//         htmlInnerText: node.element[0].innerText,
//         edgeToParent: getEdge(node._edgetoparent),
//         childNodes: getChildNodesFromDOM(node)
//       }
//     });
//   }
//
//   function getEdge(edge) {
//     return {
//       startNode: getNodeFromDOM(edge.startnode),
//       endNode: getNodeFromDOM(edge.endnode)
//     }
//   }
//
//   function getNodeFromDOM(node) {
//     return {
//       id: node.element[0].id,
//       htmlInnerText: node.element[0].innerText
//     }
//   }
//
//   return binaryHeap;
// }

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
  setInitialDataStructures,
  setNewId,
  setAnimationHTML
}
