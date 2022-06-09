/**
 * This file is used to turn the canvas into an svg output. 
 */

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
    for (var i = 0; i < nums.length; i++) {
        hex += Number(nums[i]).toString(16).padStart(2, "0");
    }
    // Padding here to ensure 6 string. If for some reason rgb 
    // does not return an array of 3, we return #000000 (black)
    return "#" + hex.padStart(6, "0");
}

/**
 * Add the required SVG header/closer to the data. 
 * @param data the data to be encapsulated.
 * @returns encapsulated data.
 */
function encapsulateSvg (data) {
    const canvas = document.getElementsByClassName("jsavgraph")[0];
    const canvasStyle = getComputedStyle(canvas);
    const height = canvasStyle.height.slice(0,-2);
    const width = canvasStyle.width.slice(0,-2);
    // Background colour is inherited from the container. 
    // Need to grab it from the container element.
    const container = document.getElementById("container");
    const fill = rgbToHex(getComputedStyle(container)
                         .getPropertyValue("background-color"));

    return "<svg height=\""+ height + "\" version=\"1.1\" width=\"" + width 
         + "\" xmlns=\"http://www.w3.org/2000/svg\" style=\"overflow: hidden;\">"
         + "\n<rect fill=\"" + fill + "\" height=\""+ height+ "\" width=\"" 
         + width + "\" x=\"0\" y=\"0\"/>\n<g transform=\"translate(30,30)\">\n" 
         + data + "</g> </svg>";
}

/**
 * Generate the svg for a singular edge. 
 * @param edge HTMLobject of one of the edges.
 * @returns svg for the edge. 
 */
function addEdge (edge) {
    const d = edge.getAttribute("d");
    const edgeStyle = getComputedStyle(edge);
    const strokeWidth = edgeStyle.getPropertyValue("stroke-width");
    const colour = rgbToHex(edgeStyle.stroke);
    return "<path stroke=\"" + colour + "\" stroke-width=\"" + strokeWidth 
            + "\" d=\"" + d + "\"></path>\n";
}

/**
 * Grabs all the jsav edges in the page, and calls addEdge to turn each of them
 * into the required svg data. 
 * @returns the svg of all the jsav edges. 
 */
function addEdges () {
    const edges = document.getElementsByClassName("jsavedge");
    var edgesSvg = "";
    for (var i = 0; i < edges.length; i++) {
        edgesSvg += addEdge(edges.item(i));
    }
    return edgesSvg;
}

/**
 * Generate the svg for a singular edge label.
 * @param label HTMLObject of the label. 
 * @returns svg for the label
 */
function addEdgeLabel (label) {
    const pos = label.getAttribute("style").replace(" display: block;", "");;
    //Format: "top: ${Y}px; left: ${X}px;"
    const part = pos.split("px; left: "); //["top: ${Y}", "${X}px;"]
    //add offset for top aligned vs bot aligned. 
    const y = Number(part[0].slice(5)) + 15; 
    const x = Number(part[1].slice(0, -3));
    const label_val = label.innerText;
    return "<text x=\"" + x + "\" y=\"" + y+ "\">" 
         + label_val + "</text>\n";
}

/**
 * Grabs all the jsav edge labels in the page, and calls addEdgeLabel on 
 * each of them to generate the invidiual svg. 
 * @returns svg for all of the edge labels
 */
function addEdgeLabels () {
    const labels = document.getElementsByClassName("jsavedgelabel");
    var labelsSvg = ""
    for (var i = 0; i < labels.length; i++) {
        labelsSvg += addEdgeLabel(labels.item(i));
    }
    return labelsSvg;
}

/**
 * Generate the svg data for an individual node.
 * @param node HTMLObject for the node
 * @returns svg for the node
 */
function addNode(node) {
    const label = node.getAttribute("data-value");
    //Format: "position: absolute; left: ${X}px; top: ${Y}px;"
    const pos = node.getAttribute("style");
    const part = pos.split("px; top: "); //["top: ${Y}", "${X}px;"]
    // Border-radius is ${r}px , slice off px and turn to number.
    const nodeStyle = getComputedStyle(node);
    const radius = Number(nodeStyle.getPropertyValue("border-radius")
                                   .slice(0, -2));
    //add offset for top aligned vs mid aligned. 
    const x = Number(part[0].slice(25)) + radius; 
    const y = Number(part[1].slice(0, -3)) + radius;
    const colour = rgbToHex(nodeStyle.getPropertyValue("background-color"));
    const stroke = rgbToHex(nodeStyle.border);
    const strokeWidth = nodeStyle.getPropertyValue("stroke-width");

    return "<g transform=\"translate(" + x + "," + y + ")\">\n" 
         + "<circle r=\"" + radius +"\" stroke=\"" + stroke 
         + "\" stroke-width=\"" + strokeWidth + "\" fill=\""+ colour 
         + "\"></circle>\n" + "<text y=\"5\" text-anchor=\"middle\">" 
         + label + "</text>\n</g>\n";
}

/**
 * Grab all the jsav nodes in the page and call addNode for each of them 
 * to turn them into the corresponding svg. 
 * @returns svg for all the nodes
 */
function addNodes () {
    const nodes = document.getElementsByClassName("jsavgraphnode");
    var nodesSvg = "";
    for (var i = 0; i < nodes.length; i++) {
        nodesSvg += addNode(nodes.item(i));
    }
    return nodesSvg;
}

/**
 * Create an svg image from the current state of the canvas. 
 * @returns svg data string. 
 */
function createSvg ()  {
    var text = addEdges();
    text += addEdgeLabels();
    text += addNodes();
    text = encapsulateSvg(text);

    //For adding the svg image to the end of the page. 
    const container = document.getElementById("svg_data");
    if (container === null) {
        const svg_node = document.createElement("svg");
        svg_node.id = "svg_data";
        svg_node.innerHTML = text;
        document.body.append(svg_node);
    } else {
        container.innerHTML = text;
    }

    // console.log(text);
    return text;
}

module.exports = {
    createSvg,
    addNode, 
    addEdge,
    addEdgeLabel,
    rgbToHex
}