function getList(list) {
  return {
    first: getAllNodes(list._first),
    id: list.element[0].id,
    innerText: list.element[0].innerText,
    type: "list"
  }
}

function getAllNodes(node) {
  const id = node.element[0].id;
  const value = node._value || node.element[0].innerText;
  const next = node._next;
  if(!node._next) {
    return;
  }
  return {
    id,
    value,
    next: getAllNodes(node._next),
    edgeToNext: getEdge(node._edgetonext)
  }
}

function getNode(node) {
  return {
    id: node.element[0].id,
    value: node._value || node.element[0].innerText,
  }
}

function getEdge(edge) {
  return {
    startNode: getNode(edge.startnode),
    endNode: getNode(edge.endnode)
  }
}

module.exports = {
  getList
}
