// graph.js
// Records the state of a JSAV Graph data structure
// http://jsav.io/datastructures/graph/

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
  let w = edge.weight();
  if (typeof(w) === "undefined") {
    w = 0;
  }
  return {
    // list of CSS classes, e.g. ["jsavedge", "marked"]
    classList: edge.element[0].classList,

    startNode: getNode(edge.startnode),
    endNode: getNode(edge.endnode),
    weight: edge.weight()
  }
}

function getNode(node) {
  return {
    // list of CSS classes, e.g. ["jsavnode", "jsavgraphnode", "marked"]
    classList: node.element[0].classList,

    // label of the node, e.g. "A"
    value: node.element[0].dataset.value,

    // data type of value label, e.g. "string"
    valueType: node.element[0].dataset.valueType,

    // JSAV id of the node, e.g. "jsav-f09280868518460087f04b92138fd452"
    id: node.element[0].id,
  }
}

module.exports = {
  getGraph,
  nodes: getAllNodes,
  edges: getAllEdges
}
