/**
 * Use AJV to validate the data against the JAAL 1.1 schema before 
 * it is sent off to the server. 
 *
 * JAAL 1.1 is written in 2020-12 draft. 
 * schemas/jaal.json is dependent on all the other json-files
 * in the schemas folder. 
 */
const Ajv2020 = require("ajv/dist/2020")
const schemaDependencies = [require("./schemas/definitions.json"), 
                            require("./schemas/edge.json"), 
                            require("./schemas/event.json"), 
                            require("./schemas/graph.json"), 
                            require("./schemas/initialState.json"), 
                            require("./schemas/keyvalue.json"), 
                            require("./schemas/matrix.json"), 
                            require("./schemas/metadata.json"), 
                            require("./schemas/node.json"), 
                            require("./schemas/style.json")];


/**
 * validateData validates the parameter data against JAAL1.1. 
 * If the data is not valid, it prints all the validation errors to the console.
 * @param data is a JSON object of the data to be submitted to the server.
 * @returns whether the data is valid JAAL1.1
 */
function validateData (data) {
    //Set allErrors to true, otherwise we only get one error at a time.
    const ajv = new Ajv2020({allErrors: true});
    const validate = ajv.addSchema(schemaDependencies)
                        .compile(require("./schemas/jaal.json"));
    
    const validation_passed = validate(data);
    if (!validation_passed) {
        console.log("Data is not valid JAAL1.1 schema.");
        console.log(validate.errors);
    }
    return validation_passed;
}

module.exports = {
    validateData
}