// graph.js
// Records the state of a JSAV Graph data structure
// http://jsav.io/datastructures/graph/

const jaalID = require("../jaalID");

function getGraph(graph) {
  const directed = graph.element[0].getAttribute("data-directed");
  return {
    id: jaalID.getJaalID(graph.element[0].id, "graph"),
    dsClass: "graph",
    node: getAllNodes(graph),
    edge: getAllEdges(graph),
    // data-directed returns a string. We assume that the default
    // for a string that is not "true" or "false" is non-directed.
    directed: (directed === "true"),
  }
}

function getAllNodes(graph) {
  return graph._nodes.map(node => getNode(node));
}

function getAllEdges(graph) {
  return graph._alledges.map(edge => getEdge(edge));
}

/**
 * Creates a JAAL edge from a JSAV Edge.
 *
 * Parameters:
 *  edge: JSAV Edge
 * Returns:
 *  JAAL edge (refer to JAAL schema edge.json)
 */
function getEdge(edge) {
  const startnode = getNode(edge.startnode).id;
  const endnode = getNode(edge.endnode).id;
  // style is all CSS classes of the edge except "jsavedge" which every edge has
  let cssClasses = [];
  for (const cssClass of edge.element[0].classList) {
    if (cssClass !== "jsavedge") {
      cssClasses.push(cssClass);
    }
  }
  let jaalEdge = {
    id: jaalID.jsavObjectToJaalID(edge, "Edge"),
    node: [startnode, endnode],
    style: cssClasses.join(" ")
  }
  if (edge.weight() !== "undefined") {
    jaalEdge['tag'] = String(edge.weight());
  }
  // JAAL 2.0 Edge "tailElem" and "headElem" properties are not yet supported
  return jaalEdge;
}

function getNode(node) {
  // list of CSS classes, e.g. ["jsavnode", "jsavgraphnode", "marked"]
  const classes = node.element[0].classList;
  return {
    // Check for the presence of marked in the class list.
    // If present, node is visited.
    style: classes.contains("marked") ? "visited" : "unvisited",
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
