
function getChildNodesFromDOM(node) {
  if(!node.childnodes || node.childnodes.length == 0) {
    return {
      id: node.element[0].id,
      edgeToParent: getEdge(node._edgetoparent),
      htmlInnerText: node.element[0].innerText
    }
  }
  return node.childnodes.map(node => {
    return {
      id: node.element[0].id,
      htmlInnerText: node.element[0].innerText,
      edgeToParent: getEdge(node._edgetoparent),
      childNodes: getChildNodesFromDOM(node)
    }
  });
}

function getEdge(edge) {
  return {
    startNode: getNodeFromDOM(edge.startnode),
    endNode: getNodeFromDOM(edge.endnode)
  }
}

function getNodeFromDOM(node) {
  return {
    id: node.element[0].id,
    htmlInnerText: node.element[0].innerText
  }
}

module.exports = {
  childNodes: getChildNodesFromDOM,
  edge: getEdge,
  node: getNodeFromDOM
}
