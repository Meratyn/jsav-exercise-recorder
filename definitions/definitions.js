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
  let title;
  try {
    title = helpers.extractTextByTagName(initialHTML, 'h1');
  } catch (err) {
    console.warn('Could not get exercise title, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err);
    title = ''
  }
  return title;
}

function getExerciseInstructions(initialHTML) {
  let instructions;
  try {
    instructions = helpers.extractTextByClassName(initialHTML, 'instructions');
  } catch (err) {
    console.warn('Could not get exercise instruction, was it set within the jsavcontainer div?'
    + '\nReturning empty string: ' + err)
    instructions = '';
  }
  return instructions;
}


module.exports = {
  setExerciseOptions,
  setDefinitions,
  setFinalGrade,
}