function getAllNodes(initialStructure) {
  return initialStructure._nodes.map(node => getNode(node));
}

function getAllEdges(initialStructure) {
  return initialStructure._alledges.map(edge => getEdge(edge));
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
    id: node.element[0].id,
  }
}

module.exports = {
  nodes: getAllNodes,
  edges: getAllEdges
}
