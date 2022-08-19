const jaalID = require("../jaalID");

function getBinaryTree(tree) {
  return {
    id: jaalID.getJaalID(tree.element[0].id, "graph"),
    root: jaalID.getJaalID(tree.rootnode.element[0].id, "node"),
    dsClass: "tree",
    dsSubClass: "binarytree", 
    directed: true,
    node: getNodes($(tree.element[0])),
    edge: getEdges($(tree.element[0])),
  }
}

function getNodes(tree) {
  const nodes = tree.find(".jsavbinarynode").not(function() {
    return $(this).css("display") === "none" || 
           $(this).hasClass("jsavnullnode")
  });
  const nodeArr = [];
  nodes.each(function() {
    const node = {
      id: jaalID.getJaalID($(this).attr("id") , "node"),
      key: $(this).text(),
    }
    nodeArr.push(node);
  })
  return nodeArr;
}

function getEdges(tree) {
  const edges = tree.find(".jsavedge").not(function() {
    return $(this).hasClass("jsavnulledge") || 
           $(this).css("opacity") === "0";
  });
  const edgeArr = [];
  edges.each(function() {
    const startNodeID = jaalID.getJaalID($(this).attr("data-startnode"), "node");
    const endNodeID = jaalID.getJaalID($(this).attr("data-endnode"), "node");
    const startNode = $("#" + $(this).attr("data-startnode"));
    const edge = {
      id: jaalID.getJaalID(startNodeID + endNodeID, "edge"),
      //Startnode is the child node, we want that to be the second one listed
      node: [endNodeID, startNodeID],
      relation: startNode.attr("data-binchildrole"),
    }
    edgeArr.push(edge);
  })
  return edgeArr;
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
