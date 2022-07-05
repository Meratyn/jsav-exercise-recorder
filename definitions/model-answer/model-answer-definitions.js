//
// model-answer-definitions.js
//
// Model answer recording functionality

const submission = require('../../submission/submission');
const animation = require('../../animation/animation');
const jaalID = require('../../dataStructures/jaalID');
const graph = require('../../dataStructures/graph/graph');
const modelSvg = require('./model-svg');
// Global var to keep track of the last-known edge state.
var state = undefined;

// Adds the model answer JavaScript function as a string.
// JAAL: definitions.modelAnswer.function
function recordModelAnswerFunction(modelAnswerFunction) {
  try {
    submission.addDefinitionSuccesfully
              .modelAnswerFunction(JSON.stringify(modelAnswerFunction));
  } catch (error) {
    throw error;
  }
  return true;
}

/**
 * Check whether there is a change in one of the edges that would indicate
 * an edge having been clicked. 
 * @param gr the root HTML node of the graph. 
 * @returns the edge id if an edge has been changed, 
 *          undefined if no changes
 */
function getChangedEdge (gr) {
  const jaalEdgeList = graph.edges(gr);

  const lastState = (submission.state().definitions.modelAnswer.length === 0)
                  ? jaalEdgeList : state;
  
  state = jaalEdgeList;
  for (var i = 0; i < jaalEdgeList.length; i++) {
    if (animation.edgeChanged(jaalEdgeList[i], lastState)) {
      return jaalEdgeList[i].id;
    }
  }
  return undefined;
}

/**
 * Get the table from the canvas HTML and return it as a matrix.
 * The index fields are used to generate a jsav-id, as the entries do 
 * not have their on jsav-id.
 * @returns a matrix of the table
 */
function getTable () {
  const canvasHTML = $('.jsavmodelanswer .jsavcanvas');
  const table = canvasHTML.children(".jsavmatrixtable");
  const rows = [...table["0"].children];
  const matrix = [];

  for (var i = 0; i < rows.length; i++) {
    const fields = [...rows[i].children];
    const row = [];
    for (var j = 0; j < fields.length; j++){
      // const id = "tablefield_" + i + "_" + j;
      // const nodeID = jaalID.getJaalID(id, "node")
      // row.push({id: nodeID, key: fields[j].textContent});
      row.push(fields[j].textContent);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Records the current step of the model answer.
 * JAAL: definitions.modelAnswer.steps[i]
 * @param exercise a JSAV exercise
 * @param gradable a boolean to indicate if the step is a gradable step according 
 * to JSAV. 
 * @returns true if there are more steps to be recorded, 
 *          false otherwise
 */
function recordModelAnswerStep(exercise, gradable) {
  // console.log(exercise);
  const redoArray = exercise.modelav._redo;
  if (redoArray.length >= 0) {
    const e = getChangedEdge(exercise.modelStructures);
    const table = getTable();
    const svg = modelSvg.createSvg();
    const modelAnswerStep = {
      type: (e) ? "click" : "narration",
      time: modelAnswerProgress(),
      table: table,
      explanation: getNarration(),
      gradable: gradable,
    };
    if (e) {
      modelAnswerStep.object = e;
      modelAnswerStep.svg = svg;
    } 
    if (modelAnswerStep.time === 0){
      submission.addInitialStateSuccesfully.addModelAnswerInitialSvg(svg);
    }
    submission.addDefinitionSuccesfully.modelAnswerStep(modelAnswerStep, 
      gradable);
    return (redoArray.length !== 0);
  }
  return false;
}

// Records the values of the data structures
// in the current step of the model answer.
// JAAL: definitions.modelAnswer.steps[i].dataStructures
function dataStructuresNode(exercise) {
  const modelStructures = exercise.modelStructures;
  const stepDSvalues = [];
  if (Array.isArray(modelStructures)) {
    modelStructures.forEach((item) => {
      stepDSvalues.push([ ...item._values || 'undefined' ]);
    });
  } else {
    stepDSvalues.push([ ...modelStructures._values || 'undefined' ]);
  }
  return stepDSvalues;
}

// JAAL: definitions.modelAnswer.steps[i].operations
function operationsNode(redoArray) {
  if (redoArray.length === 0) {
    return []
  }
  const operations = redoArray[0].operations;
  let stepOperations = [];
  for (const op in operations) {
    stepOperations.push({
      args: getFormattedOperationArgs(operations[op].args),
      effect: operations[op].effect.toString(),
    })
  }
  return stepOperations;
}

// JAAL: definitions.modelAnswer.steps[i].operations[j].args
function getFormattedOperationArgs(args) {
  const formattedArgs = {};
  for (const arg in args) {
    formattedArgs[arg] =
      (typeof(args[arg]) !== 'object' || Array.isArray(args[arg])) ?
      args[arg] :
      `Converted to string when recording to avoid cyclic object value: ${args[arg].toString()}`
  }
  return formattedArgs;
}

function getNarration() {
  return $('.jsavmodelanswer .jsavoutput').children().html();
}

// JAAL: definitions.modelAnswer.steps[i].html
function getModelAnswerStepHTML() {
  let counterHTML = $('.jsavmodelanswer .jsavcounter').html();
  let outputHTML = $('.jsavmodelanswer .jsavoutput').html();
  let canvasHTML = $('.jsavmodelanswer .jsavcanvas').html();
  return { counterHTML,  outputHTML, canvasHTML };
}

// Returns the number of the current step in the model answer slideshow
function modelAnswerProgress() {
  var total = 0;
  submission.state().definitions.modelAnswer.forEach(
    function(index) {
      total += index.length
    }
  )
  return total;
  // return submission.state().definitions.modelAnswer.length;
}


module.exports = {
  recordModelAnswerFunction,
  recordModelAnswerStep,
  modelAnswerProgress,
}
