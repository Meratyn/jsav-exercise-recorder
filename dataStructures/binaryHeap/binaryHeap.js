function isBinaryHeap(initialStructure) {
  return Object.keys(initialStructure).includes('_tree' && '_treenodes');
}

function getBinaryHeap(binaryHeap) {
  return {
    type: 'binaryHeap',
    id: binaryHeap.element[0].id,
    values: [ ...binaryHeap._values ],
    tree: getBinaryTree(binaryHeap),
  }
}

function getBinaryTree(binaryHeap) {
  const jsavRoot = binaryHeap._tree.rootnode;
  const rootNode = {
    id: jsavRoot.element[0].id,
    value: jsavRoot.element[0].dataset.value,
    childRole: jsavRoot.element[0].dataset.childRole,
    heapIndex: jsavRoot.element[0].dataset.jsavHeapIndex,
    valueType: jsavRoot.element[0].dataset.valueType,
    childNodes: getChildNodes(jsavRoot)
  }
  return {
    rootNode,
    id: binaryHeap._tree.element[0].id,
    root: binaryHeap._tree.element[0].dataset.root,
    values: binaryHeap._tree.element[0].innerText
  }
}

function getChildNodes(node) {
  if(!node.childnodes || node.childnodes.length == 0) {
    return;
  }
  return node.childnodes.map(node => {
    return {
      id: node.element[0].id,
      value: node.element[0].dataset.value,
      valueType: node.element[0].dataset.valueType,
      heapIndex: node.element[0].dataset.jsavHeapIndex,
      childRole: node.element[0].dataset.binchildrole,
      childPos: node.element[0].dataset.childPos,
      parent: node.element[0].dataset.parent,
      edgeToParent: getEdge(node._edgetoparent),
      childNodes: getChildNodes(node)
    }
  });
}

function getEdge(edge) {
  return {
    startNode: getNode(edge.startnode),
    endNode: getNode(edge.endnode)
  }
}

function getNode(node) {
  return {
    value: node.element[0].dataset.value,
    valueType: node.element[0].dataset.valueType,
    heapIndex: node.element[0].dataset.jsavHeapIndex,
    childRole: node.element[0].dataset.binchildrole,
    childPos: node.element[0].dataset.childPos,
    parent: node.element[0].dataset.parent,
    id: node.element[0].id
  }
}

module.exports = {
  isBinaryHeap,
  getBinaryHeap
}
