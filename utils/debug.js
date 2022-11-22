//
// utils/debug.js
//
// Debugging utilities

const submission = require('../submission/submission');

/**
 * Prints a JAAL edge to the console
 * @param edge: a JAAL edge
 */
function printEdge(edge) {
  let graph = submission.state().initialState.dataStructures[0];

  // Convert JAAL node IDs to node labels
  // edge.node[i] is a string such as "node12".
  // First id is "node1" which corresponds to index 0 in
  // graph.node[j].
  let startNodeI = parseInt(edge.node[0].slice(4)) - 1;
  let endNodeI = parseInt(edge.node[1].slice(4)) - 1;
  let startNodeLabel = graph.node[startNodeI].key;
  let endNodeLabel = graph.node[endNodeI].key;
  console.log(edge.id + ": " + startNodeLabel + endNodeLabel +
    " style: " + edge.style + " tag: " + edge.tag);
}

/**
 * Prints a JAAL graph to the console
 * @param graph: a JAAL graph
 */
function printGraph(graph) {
  if (graph.dsClass !== "graph") {
    console.warn("Tried to call printGraph to a data structure with " +
      "dsClass === " + graph.dsClass);
    return;
  }
  console.log("--- " + graph.id + " -------------------")
  for (e of graph.edge) {
    printEdge(e)
  }
}

const debug = {
  printEdge,
  printGraph
}

module.exports = debug;
