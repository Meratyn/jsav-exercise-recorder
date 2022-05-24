// graph.js
// Records the state of a JSAV Graph data structure
// http://jsav.io/datastructures/graph/

const jaalID = require("../jaalID");

function getGraph(graph) {
  console.log(graph);
  return {
    id: jaalID.getJaalID(graph.element[0].id, "graph"),
    dsClass: "graph",
    node: getAllNodes(graph),
    edge: getAllEdges(graph), 
    //TODO: Find a way to pull directed from the graph data
    //Not used in Dijkstra's. 
    directed: false
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
  const startnode = getNode(edge.startnode).id;
  const endnode = getNode(edge.endnode).id
  return {
    // list of CSS classes, e.g. ["jsavedge", "marked"]
    // classList: edge.element[0].classList,
    // JAAL id constructed from "${startnode}${endnode}"
    // as JSAV does not give edges an id.
    id: jaalID.getJaalID(startnode + endnode, "edge"),
    node: [startnode, endnode],
    tag: String(edge.weight())
  }
}

function getNode(node) {
  return {
    // list of CSS classes, e.g. ["jsavnode", "jsavgraphnode", "marked"]
    // classList: node.element[0].classList,

    // label of the node, e.g. "A"
    key: String(node.element[0].dataset.value),

    // JAAL id of the node, mapped to JSAV id
    id: jaalID.getJaalID(node.element[0].id, "node"),
  }
}

module.exports = {
  getGraph,
  nodes: getAllNodes,
  edges: getAllEdges,
  getNode,
}
