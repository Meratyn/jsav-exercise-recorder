function getGraph(graph) {
  return {
    type: "graph",
    id: graph.element[0].id,
    nodes: getAllNodes(graph),
    edges: getAllEdges(graph)
  }
}

function getAllNodes(graph) {
  return graph._nodes.map(node => getNode(node));
}

function getAllEdges(graph) {
  return graph._alledges.map(edge => getEdge(edge));
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
  getGraph,
  nodes: getAllNodes,
  edges: getAllEdges
}
