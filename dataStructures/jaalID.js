/**
 * jaalID.js
 * 
 * Functionality to convert JSAV ID to human-readable JAAL IDs. 
 */


// Map to store the JSAV ID to JAAL ID mappings
const jsavToJaalID = new Map();
// Object to store the next id to hand out for each of the types.
// ids are handed out consecutively for ease of reading.
const ids = {
    "edge" : 1,
    "graph" : 1,
    "keyvalue": 1,
    "matrix": 1,
    "node": 1
}
// List of accepted types in JAAL 1.1 that have an id derived from the name
const acceptedTypes = ["edge", "graph", "keyvalue", "matrix", "node"];

/**
 * Function to convert the JSAV-generated IDs into human-readable JAAL IDs. 
 * @param jsavID is the JSAV-generated ID. 
 * @param type should be one of the acceptedTypes above. 
 * @returns human-readable JAAL ID in the format {type + number}. 
 */
function getJaalID (jsavID, type) {
    jaalID = jsavToJaalID.get(jsavID); 

    if (jaalID === undefined) {
        if (type === undefined || !acceptedTypes.includes(type)) {
            console.warn("Trying to create JAAL ID, but type", type, 
                         "is not one of", acceptedTypes);
            return;
        }
        jaalID = type + ids[type];
        ids[type] += 1;
        jsavToJaalID.set(jsavID, jaalID);
    } 
    return jaalID;
}

module.exports = {
    getJaalID
}