const recorder = require("../exerciseRecorder.js")
const submission = require("../submission/submission.js")
const helpers = require("./testHelpers.js");

describe("submission module", () => {
  const jsavInitEvent = helpers.jsavInitEvent;
  const exercise = helpers.exercise;
  const exerciseInitEvent = helpers.exerciseInitEvent;
  const clickEvent = helpers.clickEvent;
  const gradeableStepEvent = helpers.gradeableStepEvent;
  const multipleArrays = helpers.multipleArrays;
  const exerciseGradeButtonEvent = helpers.exerciseGradeButtonEvent;
  const exerciseGradeEvent = helpers.exerciseGradeEvent;
  const title = "Test title"
  const instructionsText = "Instruction text here"
  const initialHTML = `<div id=\"jsavcontainer\">\n<h1>${title}</h1>\n
    <!-- <a class=\"jsavsettings\" href=\"#\">Settings</a> -->\n
    <p class=\"instructLabel\">Instructions:</p>\n<p class=\"instructions\">\n
    ${instructionsText}</p>\n<p class=\"jsavexercisecontrols\" align=\"center\"></p>\n
    <p class=\"jsavscore\"></p>\n</div>`

  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("submission reset works", () => {
    const expectedState = {
      metadata: {},
      definitions: {
        style: {},
        score: {},
        options: {},
      },
      initialState: [],
      animation: []
    }
    submission.reset();
    expect(submission.state()).toMatchObject(expectedState);
  })

  test("jsav-init: submission returns correctly", () => {
    jsavInitEvent.initialHTML = initialHTML;
    recorder.passEvent(jsavInitEvent);
    const expectedState = {
      metadata: {},
      definitions: {
        style: {},
        score: {},
        options: {
          title: title,
          instructions: instructionsText
        },
      },
      initialState: [],
      animation: []
    }
    expect(submission.state()).toMatchObject(expectedState);
  })
})