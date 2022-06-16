/**
 * Create an svg of the model solution step. 
 * The SVG contains the same information as on the model answer animation
 * Albeit in a slightly different layout
 */

// Use some of the SVG functions.
const svg = require('../../animation/svg');


/**
 * Trim the passed along svg canvas to contain minimal necessary information
 * @param svgElement the HTML element for the svg.
 * @returns a string of the trimmed svg input. 
 */
function svgTrimming(svgElement) {
  const elementsList = [...svgElement.children]

  var svgOutput = "";
  for (var i = 0; i < elementsList.length; i++) {
    const className = elementsList[i].className.baseVal
    if (className.includes("jsavedge")) {
      svgOutput += svg.addEdge(elementsList[i]);
    }
  }
  return svgOutput;
}

/**
 * Encapsulate the svg data in the svg headers. This also sets the final canvas size.
 * @param data the svg string to be encapsulated in svg header
 * @param canvasHTML the canvasHTML element, for grabbing the height and width
 * of the svg canvas.
 * @returns the finished svg data.
 */
function encapsulateSvg(data, canvasHTML) {
  const height = canvasHTML.css("min-height");
  const width = canvasHTML.css("min-width");
  const fill = svg.rgbToHex(canvasHTML.css("background-color"));

  return "<svg height=\""+ height + "\" version=\"1.1\" width=\"" + width 
       + "\" xmlns=\"http://www.w3.org/2000/svg\" style=\"overflow: hidden;\">"
       + "\n<rect fill=\"" + fill + "\" height=\""+ height+ "\" width=\"" 
       + width + "\" x=\"0\" y=\"0\"/>\n" + data + " </svg>";
}

/**
 * Encapsulate the svg of the graph in the right position. 
 * @param data the string of the graph svg.
 * @param innerSvg the HTML svg element that contains the information
 * on the size of the graph
 * @returns an svg string
 */
function encapsulateGraph(data, innerSvg) {
  const canvasHTML = $('.jsavmodelanswer .jsavcanvas');
  const width = canvasHTML.css("min-width");
  const height = canvasHTML.css("min-height");
  const innerSvgWidth = innerSvg.width.baseVal.value;
  const innerSvgHeight = innerSvg.height.baseVal.value;
  const transWidth = (Number(width.slice(0, -2)) - innerSvgWidth)/2;
  const transHeight = (Number(height.slice(0, -2)) - innerSvgHeight)/2;

  return "<g transform=\"translate(" 
       + Math.round(transWidth) + "," + Math.round(transHeight) + ")\">\n" 
       + data + "</g>";
}

/**
 * Generate the svg of the graph. 
 * @param graphChildren a list of HTML elements that make up the graph. 
 * @returns the svg representation of the graph. 
 */
function graphSvg(graphChildren) {
  var svgOutput = "";
  var svgIndex = 0;
  for (var i = 0; i < graphChildren.length; i++){
    if (graphChildren[i] instanceof SVGElement){
      //Element is the svg canvas
      svgOutput += svgTrimming(graphChildren[i]);
      svgIndex = i;
    } else if (graphChildren[i].className.includes("jsavgraphnode")) {
      //Element is a node
      svgOutput += svg.addNode(graphChildren[i]);
    } else if (graphChildren[i].className.includes("jsavedgelabel")) {
      //Element is an edge label
      svgOutput += svg.addEdgeLabel(graphChildren[i]);
    } else {
      console.warn("Missing information about the following node: \n", 
                    graphChildren[i])
    }
  }

  return encapsulateGraph(svgOutput, graphChildren[svgIndex]);
}


/**
 * Generate the svg representation of the table.
 * @param {*} tableChildren 
 * @returns 
 */
function tableSvg(tableChildren) {
  var offsetY = 0;
  var svgOutput = "";

  for (var i = 0; i < tableChildren.length; i++){
    const li = [...tableChildren[i].children];
    var offsetX = 0;
    const height = Number(getComputedStyle(li[0])
                            .getPropertyValue("min-height")
                            .slice(0,-2));

    for (var j = 0; j < li.length; j++) {
      const text = li[j].textContent;
      const width = Number(getComputedStyle(li[j])
                            .getPropertyValue("min-width")
                            .slice(0,-2));
      const colour = getComputedStyle(li[j])
                            .getPropertyValue("background-color");
      const textX = offsetX + width/2;
      const textY = offsetY + height/2 + 5;
      svgOutput += "<rect x=\" " + offsetX + "\" y=\""+ offsetY + "\" width=\""
                + width + "\" height=\"" + height+ "\" fill=\""
                + svg.rgbToHex(colour) + "\"></rect>\n" 
                + "<text x=\"" + textX + "\" y=\"" + textY 
                + "\" text-anchor=\"middle\">" + text + "</text>\n";
      offsetX += width;
    }

    offsetY += height;
  }
  return svgOutput;
}

function narration(table) {
  const narr = $('.jsavmodelanswer .jsavoutput').children().html();

  const tableOffset = Number(getComputedStyle(table[0]).getPropertyValue("width").replace("px", "")) + 10;
  return "<text x=\"" + tableOffset + "\" y=\"20\">" + narr + "</text>";
}

function createSvg() {
  const canvasHTML = $('.jsavmodelanswer .jsavcanvas');
  const graphHTML = canvasHTML.children()["0"];
  const tableHTML = canvasHTML.children()["1"];
    
  var svgOutput= graphSvg([...graphHTML.children]);
  svgOutput += tableSvg([...tableHTML.children]);
  svgOutput += narration([...tableHTML.children]);
  svgOutput = encapsulateSvg(svgOutput, canvasHTML);
  // console.log(svgOutput);
  return svgOutput;
}

module.exports = {
    createSvg,
}