/**
 * Tests for the node function as used in graph.js
 */
const graph = require("../dataStructures/graph/graph")
const helper = require("./testHelpers")

/**
 * Initialise a node with minial values. Node's format: 
 * const node = {
 *    element : [{
 *        dataset: {
 *            value: ""
 *        }, 
 *        id: ""
 *    }]
 * } 
 */
const node = helper.node
node.element[0].dataset.value = 0;
node.element[0].dataset.id = "jsav-id";

/**
 * Basic test to see if we get back the expected node object. 
 */
test("Basic node test", () => {
    console.log(graph.getNode(node));
    expect(graph.getNode(node)).toMatchObject({key: '0', id: 'node1'});
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
