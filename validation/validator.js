/**
 * Use AJV to validate the data against the JAAL schema before
 * it is sent off to the server.
 *
 * JAAL is written in JSON Schema version 2020-12 draft.
 * schemas/jaal.json is dependent on all the other json-files
 * in the schemas folder.
 */

const jaalVersion = require('./JAAL/spec/version');

const Ajv2020 = require("ajv/dist/2020")
const schemaDependencies = [
  require("./JAAL/spec/schemas/definitions.json"),
  require("./JAAL/spec/schemas/edge.json"),
  require("./JAAL/spec/schemas/event.json"),
  require("./JAAL/spec/schemas/graph.json"),
  require("./JAAL/spec/schemas/initialState.json"),
  require("./JAAL/spec/schemas/keyvalue.json"),
  require("./JAAL/spec/schemas/matrix.json"),
  require("./JAAL/spec/schemas/metadata.json"),
  require("./JAAL/spec/schemas/node.json")];


/**
 * validateData validates the parameter data against JAAL.
 * If the data is not valid, it prints all the validation errors to the console.
 * @param data is a JSON object of the data to be submitted to the server.
 * @returns whether the data is valid JAAL
 */
function validateData (data) {
    //Set allErrors to true, otherwise we only get one error at a time.
    const ajv = new Ajv2020({allErrors: true});
    const validate = ajv.addSchema(schemaDependencies)
                        .compile(require("./JAAL/spec/schemas/jaal.json"));

    const validation_passed = validate(data);
    if (!validation_passed) {
        console.log("Data does not conform to JAAL " + jaalVersion + ".");
        console.log(validate.errors);
    } else {
        console.log("Data conforms to JAAL " + jaalVersion + ".");
    }
    return validation_passed;
}

module.exports = {
    validateData
}
