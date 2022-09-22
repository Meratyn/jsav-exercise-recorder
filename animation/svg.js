/**
 * This file is used to turn the canvas into an svg output. 
 */

//Vars to be able to calculate the svg offsets for each part.
var top = 0;
var left = 0;

/**
 * Helper function.
 * Turns an rgb string as returned by getComputedStyle.getPropertyValue
 * into a hex string for the SVG. 
 * @param rgb an rgb colour string
 * @returns a hex string. (default: #000000) 
 */
function rgbToHex(rgb) {
    const trim = rgb.slice(rgb.search("\\(") +1, rgb.search("\\)"));
    const nums = trim.split(", ");
    var hex = "";
    for (var i = 0; i < nums.length && i < 3; i++) {
        hex += Number(nums[i]).toString(16).padStart(2, "0");
    }
    // Padding here to ensure 6 string. If for some reason rgb 
    // does not return an array of 3, we return #000000 (black)
    return "#" + hex.padStart(6, "0");
}

/**
 * Add the offset for the element in the bigger context of the svg. 
 * Used for when there is more than 1 datastructure in the exercise
 * @param  svg the svg string
 * @param  x optional parameter off-set left, default file variable left
 * @param  y optional parameter off-set top, default file variable top
 * @returns 
 */
function offset (svg, x, y) {
    const offX = (x === undefined) ? left : x;
    const offY = (y === undefined) ? top : y;
    return "<g transform=\"translate(" + offX + "," + offY + ")\">\n" 
            + svg + "</g>\n"
}

/**
 * Add the required SVG header/closer to the data. 
 * @param data the data to be encapsulated.
 * @returns encapsulated data.
 */
function encapsulateSvg (data) {
    const canvas = $(".jsavcanvas");
    const height = canvas.css("height").match(/\d+/)[0]
    const width = canvas.css("width").match(/\d+/)[0]
    // Background colour is inherited from the container. 
    // Need to grab it from the container element.
    const container = $("#container")
    const fill = rgbToHex(container.css("background-color"));

    return "<svg height=\""+ height + "\" version=\"1.1\" width=\"" + width 
         + "\" xmlns=\"http://www.w3.org/2000/svg\" style=\"overflow: hidden;\">"
         + "\n<rect fill=\"" + fill + "\" height=\""+ height+ "\" width=\"" 
         + width + "\" x=\"0\" y=\"0\"/>\n<g transform=\"translate(30,30)\">\n" 
         + data + "</g> </svg>";
}

/**
 * Generate the svg for a singular edge. 
 * @param edge jQuery object of the edge.
 * @returns svg for the edge. 
 */
function addEdge (edge) {
    const d = edge.attr("d");
    // const edgeStyle = getComputedStyle(edge);
    const strokeWidth = edge.css("stroke-width");
    const colour = rgbToHex(edge.css("stroke"));
    return "<path stroke=\"" + colour + "\" stroke-width=\"" + strokeWidth 
            + "\" d=\"" + d + "\"></path>\n";
}

/**
 * Generate the svg for a singular edge label.
 * @param label jQuery object of the label. 
 * @returns svg for the label
 */
function addEdgeLabel (label) {
    const y = Number(label.css("top").match(/\d+/)[0]) + 15;
    const x = Number(label.css("left").match(/\d+/)[0]);
    const label_val = label.text();
    return "<text x=\"" + x + "\" y=\"" + y+ "\">" 
         + label_val + "</text>\n";
}

/**
 * Generate the svg data for an individual node.
 * @param node jQuery object of the node
 * @returns svg for the node
 */
function addNode(node) {
    const label = node.attr("data-value");
    const radius = Number(node.css("border-radius").match(/\d+/)[0]);
    //add offset for top aligned vs mid aligned. 
    const x = Number(node.css("left").match(/\d+/)[0]) + radius; 
    const y = Number(node.css("top").match(/\d+/)[0]) + radius;
    const colour = rgbToHex(node.css("background-color"));
    const stroke = rgbToHex(node.css("border"));
    const strokeWidth = node.css("stroke-width");

    return "<g transform=\"translate(" + x + "," + y + ")\">\n" 
         + "<circle r=\"" + radius +"\" stroke=\"" + stroke 
         + "\" stroke-width=\"" + strokeWidth + "\" fill=\""+ colour 
         + "\"></circle>\n" + "<text y=\"5\" text-anchor=\"middle\">" 
         + label + "</text>\n</g>\n";
}

function addTree () {
    const tree = $(".jsavtree");
    if (tree.length === 0) return;
    var svg = "";
    // grab the nodes that do not have display=none or the class jsavnullnode
    const nodes = tree.find(".jsavtreenode").not(function() {
            return $(this).css("display") === "none" || 
                $(this).hasClass("jsavnullnode")
        });
    nodes.each(function() {svg += addNode($(this))})

    //Grab the edges that do not have the class jsavnulledge or opacity of 0.
    const edges = tree.find(".jsavedge").not(function() {
            return $(this).hasClass("jsavnulledge") || 
                $(this).css("opacity") === "0";
        });
    edges.each(function() {svg += addEdge($(this))});
    svg = offset(svg, 200);
    top += Number(tree.css("height").match(/\d+/)[0])
    return svg;
}

/**
 * Function to add the graph of a page. Grabs each of the three graph 
 * components: edges, edge labels, nodes.
 * @returns the graph's svg
 */
function addGraph () {
    const graph = $(".jsavgraph");
    const edges = graph.find(".jsavedge");
    var svg = "";
    edges.each(function() {svg += addEdge($(this))})
    const labels = graph.find(".jsavedgelabel");
    labels.each(function() {svg += addEdgeLabel($(this))});
    const nodes = graph.find(".jsavgraphnode");
    nodes.each(function() {svg += addNode($(this))});
    top += Number(graph.css("height").match(/\d+/)[0]);
    return svg;
}

/**
 * Function to add the matrix DS to the svg
 * @returns matrix's svg
 */
function addMatrix () {
    const matrix = $(".jsavmatrix");
    if (matrix.length === 0) return;
    const rows = matrix.children(".jsavarray");

    var offsetY = 0;
    var svg = "";

    rows.each(function () {
        var offsetX = 0;
        //$(this) = current row
        const cells = $(this).children(".jsavindex");
        const height = Number($(this).css("height").match(/\d+/)[0])
        
        cells.each(function() {
            //$(this) = current cell
            const width = Number($(this).css("width").match(/\d+/)[0]);
            const colour = rgbToHex($(this).css("background-color"));
            const textX = offsetX + width/2;
            const textY = offsetY + height/2 + 5;
            const text = $(this).text();

            svg += "<rect x=\" " + offsetX + "\" y=\""+ offsetY + "\" width=\""
                  + width + "\" height=\"" + height+ "\" fill=\""
                  + colour + "\"></rect>\n" 
                  + "<text x=\"" + textX + "\" y=\"" + textY 
                  + "\" text-anchor=\"middle\">" + text + "</text>\n";
            
            offsetX += width;
        });

        offsetY += height;
    });
    svg = offset(svg);
    top += Number(matrix.css("height").match(/\d+/)[0])
    return svg;
}

/**
 * Create an svg image from the current state of the canvas. 
 * @returns svg data string. 
 */
function createSvg ()  {
    //Make sure that top & left are 0
    top = 0;
    left = 0;

    var svg = addGraph();
    svg += addTree();
    svg += addMatrix();
    svg = encapsulateSvg(svg);
    return svg;
}

module.exports = {
    createSvg,
    addNode, 
    addEdge,
    addEdgeLabel,
    offset,
    rgbToHex
}