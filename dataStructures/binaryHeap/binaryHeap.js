const tree = require('../tree/tree');

function isBinaryHeap(initialStructure) {
  return Object.keys(initialStructure).includes('_tree' && '_treenodes');
}

function getBinaryTreeFromDOM(initialStructure) {
  const rootNode = {
    id: initialStructure._tree.rootnode.element[0].id,
    htmlInnerText: initialStructure._tree.rootnode.element[0].innerText,
    childNodes: tree.childNodes(initialStructure._tree.rootnode)
  }
  return {
    rootNode,
    id: initialStructure._tree.element[0].id,
    htmlInnerText: initialStructure._tree.element[0].innerText
  }
}

module.exports = {
  isBinHeap: isBinaryHeap,
  getBinHeap: getBinaryTreeFromDOM
}
