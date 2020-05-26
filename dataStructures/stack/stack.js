function getStack(stack) {
  return {
    first: getAllNodes(stack._first),
    id: stack.element[0].id,
    innerText: stack.element[0].innerText,
    type: "stack"
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
  }
}

function getNode(node) {
  return {
    id: node.element[0].id,
    value: node._value || node.element[0].innerText,
  }
}


module.exports = {
  getStack
}
