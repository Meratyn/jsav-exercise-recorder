
function getChildNodes(node) {
  if(!node.childnodes || node.childnodes.length == 0) {
    return {
      id: node.element[0].id,
      edgeToParent: getEdge(node._edgetoparent),
      value: node.element[0].dataset.value,
      childRole: node.element[0].dataset.childRole,
      valueType: node.element[0].dataset.valueType,
    }
  }
  return node.childnodes.map(node => {
    return {
      id: node.element[0].id,
      value: node.element[0].innerText,
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
    id: node.element[0].id
  }
}

module.exports = {
  childNodes: getChildNodes,
  edge: getEdge,
  node: getNode
}
