/**
 * @jest-environment jsdom
 */

/**
 * The above comment is required at the top of the file to set the 
 * jest environment to allow the creation of DOM elements.
 * Tests for the node function as used in graph.js
 */
const graph = require("../dataStructures/graph/graph")
const helper = require("./testHelpers")

/**
 * Minimal data structure as gathered from the JSAV dump for a node.
 * First create a dom_node so that we can have a DOMTokenList for the classes.
 */
  const dom_node = document.createElement("div");
  dom_node.classList.add("marked");

 const node = {
    element : [{
        dataset: {
            value: 0
        }, 
        id: "jsav-id",
        classList: dom_node.classList
    }]
  }

/**
 * Basic test to see if we get back the expected node object. 
 */
test("Basic node test", () => {
    expect(graph.getNode(node)).toMatchObject({style: "visited", key: '0', id: 'node1'});
})

/**
 * Test to check that the required properties are present in the node.
 */
test("Node object containing minimal required fields", () => {
    expect(graph.getNode(node)).toHaveProperty('id');

    expect(graph.getNode(node)).toHaveProperty('key');
})

/**
 * Test to make sure that the id field contains a string (JAAL 1.1)
 */
test("Id field is a string", () => {
    expect(graph.getNode(node)).toHaveProperty('id', expect.any(String));
})

/**
 * Test to make sure that the key field contains a string (JAAL 1.1)
 */
test("Key field is a string", () => {
    expect(graph.getNode(node)).toHaveProperty('key', expect.any(String));
})

/**
 * Tests to make sure that the style is set properly. 
 */
test("Style is visited", () => {
    expect(graph.getNode(node)).toHaveProperty('style', 'visited');
})

test("Style is unvisited", () => {
    dom_node.classList.remove("marked");
    node.element[0].classList = dom_node.classList;
    expect(graph.getNode(node)).toHaveProperty('style', 'unvisited');
})