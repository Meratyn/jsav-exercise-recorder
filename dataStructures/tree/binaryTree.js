function getBinaryTree(tree) {
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
    type: 'binarytree'
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
      childRole: node.element[0].dataset.binchildrole,
      valueType: node.element[0].dataset.valueType,
      childPos: node.element[0].dataset.childPos,
      childNodes: getChildNodes(node)
    }
  });
}

module.exports = {
  getBinaryTree
}
