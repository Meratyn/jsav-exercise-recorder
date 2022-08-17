/**
 * Create an svg of the model solution step. 
 * The SVG contains the same information as on the model answer animation
 * Albeit in a slightly different layout
 */

// Use some of the SVG functions.
const svg = require('../../animation/svg');
//vars used for offset of the different components.
var top = 0;
var left = 0;

/**
 * Encapsulate the svg data in the svg headers. This also sets the final 
 * canvas size. The width is determined from the combined width of each 
 * component + 20 pixels per component.
 * @param data the svg string to be encapsulated in svg header
 * @param canvasHTML the canvasHTML element, for grabbing the height 
 * of the svg canvas.
 * @returns the finished svg data.
 */
function encapsulateSvg(data, canvasHTML) {
  var width = 0;
  canvasHTML.children().each(function() {
    width += Number($(this).css("width").replace("px", "")) + 20
  })
  const height = canvasHTML.css("min-height");
  const fill = svg.rgbToHex(canvasHTML.css("background-color"));

  return "<svg height=\""+ height + "\" version=\"1.1\" width=\"" + width 
       + "px\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: inline;\">"
       + "\n<rect fill=\"" + fill + "\" height=\""+ height+ "\" width=\"" 
       + width + "px\" x=\"0\" y=\"0\"/>\n" + data + " </svg>";
}

/**
 * Grabs the .jsavgraph from the model answer and turns the nodes, 
 * edges, and edge labels into an svg.
 * @returns the graph svg component
 */
function addGraph() {
  const graph = $(".jsavmodelanswer").find(".jsavgraph");
  var modelSvg = "";

  const nodes = graph.find(".jsavgraphnode");
  nodes.each(function() {modelSvg += svg.addNode($(this))});
  const edges = graph.find(".jsavedge");
  edges.each(function() {modelSvg += svg.addEdge($(this))});
  const labels = graph.find(".jsavedgelabel");
  labels.each(function() {modelSvg += svg.addEdgeLabel($(this))});

  modelSvg = svg.offset(modelSvg, left, top)
  top += Number(graph.css("height").match(/\d+/)[0]);
  return modelSvg;
}

/**
 * Grabs .jsavmatrix from the model answer and turns it into an svg
 * @returns the table svg component
 */
function addTable() {
  const matrix = $(".jsavmodelanswer").find(".jsavmatrix");
  const rows = matrix.children(".jsavarray");

  var offsetY = 0;
  var offsetX = 0;
  var modelSvg = "";

  rows.each(function () {
    offsetX = 0;
    //$(this) = current row
    const cells = $(this).children(".jsavindex");
    const height = Number($(this).css("height").match(/\d+/)[0])
    
    cells.each(function() {
      //$(this) = current cell
      //width returns 0, so we fall back to using min-width
      const width = Number($(this).css("min-width").match(/\d+/)[0]);
      const colour = svg.rgbToHex($(this).css("background-color"));
      const textX = offsetX + width/2;
      const textY = offsetY + height/2 + 5;
      const text = $(this).text();

      modelSvg += "<rect x=\" " + offsetX + "\" y=\""+ offsetY + "\" width=\""
          + width + "\" height=\"" + height+ "\" fill=\""+ colour 
          + "\"></rect>\n<text x=\"" + textX + "\" y=\"" + textY 
          + "\" text-anchor=\"middle\">" + text + "</text>\n";
      
      offsetX += width;
    });

    offsetY += height;
  });

  left += offsetX;
  return modelSvg;
}

/**
 * Grabs the .jsavtree component from the model answer and turns 
 * the edges and nodes into an svg.
 * @returns the tree svg component
 */
function addTree() {
  const tree = $(".jsavmodelanswer").find(".jsavtree");
  var modelSvg = "";
  // grab the nodes that do not have display=none, the class jsavnullnode,
  // no data-value, no parent field, or no parent and are not the root
  // JSAV has all the model solution nodes in HTML the whole time
  // Thus we need to make sure we only select the active ones 
  // data-parent == "" in the case of a 'removed' node
  // data-parent is undefined for root nodes (even removed ones), 
  // but the current root-node has data-child-role == root;
  const nodes = tree.find(".jsavtreenode").not(function() {
          return $(this).css("display") === "none" || 
              $(this).hasClass("jsavnullnode") || 
              $(this).attr("data-value") === "" ||
              $(this).attr("data-parent") === "" || 
              $(this).attr("data-parent") === undefined && 
              $(this).attr("data-child-role") !== "root"
        });
  nodes.each(function() {modelSvg += svg.addNode($(this))})

  //Grab the edges that do not have the class jsavnulledge or opacity of 0.
  const edges = tree.find(".jsavedge").not(function() {
          return $(this).hasClass("jsavnulledge") || 
              $(this).css("opacity") === "0";
        });
  edges.each(function() {modelSvg += svg.addEdge($(this))});
  modelSvg = svg.offset(modelSvg, left, top);
  top += Number(tree.css("height").match(/\d+/)[0])
  return modelSvg;
}

function narration(table) {
  const narr = $('.jsavmodelanswer .jsavoutput').children().html();

  const tableOffset = Number(getComputedStyle(table[0]).getPropertyValue("width").replace("px", "")) + 10;
  return "<text x=\"" + tableOffset + "\" y=\"20\">" + narr + "</text>";
}

/**
 * Create an svg representation of the current model answer state.
 * @returns an svg representation of the current model answer state
 */
function createSvg() {
  top = 0;
  left = 0;
  const canvasHTML = $('.jsavmodelanswer .jsavcanvas');
  //Order matters here because of the relative off-sets.
  var svgOutput = addTable();
  svgOutput += addGraph();
  svgOutput += addTree();
  svgOutput = encapsulateSvg(svgOutput, canvasHTML);
  return svgOutput;
}

module.exports = {
    createSvg,
}