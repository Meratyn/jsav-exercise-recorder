const recorder = require("../exerciseRecorder.js")
const helpers = require('./testHelpers.js');
const submission = require('../submission/submission');

describe("jsav-init event", () => {
  const title = "Test title"
  const instructionsText = "Instruction text here"
  const initialHTML = `<div id=\"jsavcontainer\">\n<h1>${title}</h1>\n
    <!-- <a class=\"jsavsettings\" href=\"#\">Settings</a> -->\n
    <p class=\"instructLabel\">Instructions:</p>\n<p class=\"instructions\">\n
    ${instructionsText}</p>\n<p class=\"jsavexercisecontrols\" align=\"center\"></p>\n
    <p class=\"jsavscore\"></p>\n</div>`

  const jsavInitEvent = helpers.jsavInitEvent;

  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("sets exercise title in submission correctly", () =>  {
    jsavInitEvent.initialHTML = initialHTML;
    recorder.passEvent(jsavInitEvent);
    const options = submission.state().definitions.options;
    expect(options.title).toBe(title)
  });

  test("sets exercise instructions in submission correctly", () =>  {
    jsavInitEvent.initialHTML = initialHTML;
    recorder.passEvent(jsavInitEvent);
    const options = submission.state().definitions.options;
    expect(options.instructions).toBe(instructionsText)
  })
})

describe("jsav-exercise-grade", () => {
  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("Saves grade to submission definitions", () => {
      const exerciseGradeEvent = helpers.exerciseGradeEvent;
      recorder.passEvent(exerciseGradeEvent);
      const expectedScore = { ...exerciseGradeEvent.score };
      const receivedScore = submission.state().definitions.score;
      expect(receivedScore).toMatchObject(expectedScore);
  })
})