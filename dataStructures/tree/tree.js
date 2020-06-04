function getTree(tree) {
  const jsavRoot = tree.rootnode;
  const rootNode = {
    id: jsavRoot.element[0].id,
    value: jsavRoot.element[0].dataset.value,
    childRole: jsavRoot.element[0].dataset.childRole,
    valueType: jsavRoot.element[0].dataset.valueType,
    childNodes: getChildNodes(jsavRoot)
  }
  return {
    rootNode,
    id: tree.element[0].id,
    root: tree.element[0].dataset.root,
    values: tree.element[0].innerText,
    type: 'tree'
  }
}

function getChildNodes(node) {
  if(!node.childnodes || node.childnodes.length == 0) {
    return;
  }
  return node.childnodes.map(node => {
    return {
      id: node.element[0].id,
      value: node.element[0].innerText,
      childRole: node.element[0].dataset.childRole,
      valueType: node.element[0].dataset.valueType,
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
  getTree
}
