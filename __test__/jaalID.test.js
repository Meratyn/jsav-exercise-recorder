/**
 * Test suite for the dataStructures/jaalID.js file. 
 */
const jaalID = require("../dataStructures/jaalID"); 


/**
 * Function to test the basic JAAL types. 
 */
describe("Basic JAAL types", () => {
    test("Edge", () => {
        expect(jaalID.getJaalID("e1", "edge")).toBe("edge1");
    })
    
    test("Graph", () => {
        expect(jaalID.getJaalID("g1", "graph")).toBe("graph1");
    })

    test("Node", () => {
        expect(jaalID.getJaalID("n1", "node")).toBe("node1");
    })

    test("Matrix", () => {
        expect(jaalID.getJaalID("m1", "matrix")).toBe("matrix1");
    })

    test("Keyvalue", () => {
        expect(jaalID.getJaalID("k1", "keyvalue")).toBe("keyvalue1");
    })
    
})

/**
 * Tests to make sure that the right returns are given when the types
 * are wrong. 
 */
describe("Wrong JAAL types", ()=> {
    // Nonexistent JAAL type
    test("Nonexistent JAAL type", () => {
        expect(jaalID.getJaalID("baa", "vertex")).toBeUndefined();
    })

    // Set an edge with edge type, then call it again with node/vertex
    // This should return edge, as type is not checked if it is 
    // a known jsav id. 
    test("Known edge id, wrong type", () => {
        expect(jaalID.getJaalID("e1", "edge")).toBe("edge1");
        expect(jaalID.getJaalID("e1", "node")).toBe("edge1");
        expect(jaalID.getJaalID("e1", "vertex")).toBe("edge1");
    })

    // Missing JAAL type for unknown jsav-id
    test("Mising type", () => {
        expect(jaalID.getJaalID("unknown-jaal-id")).toBeUndefined();
    })
})

/**
 * Tests to make sure that it still works when there are multiple calls
 */
describe("Multiple jaalID calls", () => {
    //Set jaal ID then fetch it again. 
    test("Get known edge", () => {
        expect(jaalID.getJaalID("e1", "edge")).toBe("edge1");
        expect(jaalID.getJaalID("e1")).toBe("edge1");
    })

    //Make sure that the counter increments correctly. 
    test("Multiple edges", ()=> {
        for(var i = 1; i <= 10; i++) {
            expect(jaalID.getJaalID("e"+i, "edge")).toBe("edge"+i);
        }
        
    })

    //Makre sure that incrementing works correctly when mixing type calls
    test("Mixed types", () => {
        expect(jaalID.getJaalID("n1", "node")).toBe("node1");
        expect(jaalID.getJaalID("m1", "matrix")).toBe("matrix1");
        expect(jaalID.getJaalID("n2", "node")).toBe("node2");
    })
})
