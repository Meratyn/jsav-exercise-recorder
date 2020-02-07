"use strict";
const helpers = require('../utils/helperFunctions');
const submission = require('../submission/submission');

function setExerciseOptions(eventData) {
  submission.addDefinition.options({
    'title': getExerciseTitle(eventData.initialHTML),
    'instructions': getExerciseInstructions(eventData.initialHTML),
  });
}

function setDefinitions(exercise) {
  const definitions = [];
  // TODO: implement setDefinitions(exercise)
  return definitions;
}

function setFinalGrade(eventData) {
  submission.addDefinition.score({ ...eventData.score });
}

function getExerciseTitle(initialHTML) {
  return helpers.extractTextByTagName(initialHTML, 'h1');
}

function getExerciseInstructions(initialHTML) {
  const instructions = helpers.extractTextByClassName(initialHTML, 'instructions');
  return instructions;
}




module.exports = {
  setExerciseOptions,
  setDefinitions,
  setFinalGrade,
}