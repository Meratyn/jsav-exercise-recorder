const recorder = require("../exerciseRecorder.js")
const helpers = require("./testHelpers.js");
const submission = require("../submission/submission");

const exercise = helpers.exercise;
const exerciseInitEvent = helpers.exerciseInitEvent;
const singleArray = helpers.singleArray;
const clickEvent = helpers.clickEvent;
const gradeableStepEvent = helpers.gradeableStepEvent;
const multipleArrays = helpers.multipleArrays;
const exerciseGradeButtonEvent = helpers.exerciseGradeButtonEvent;
const exerciseGradeEvent = helpers.exerciseGradeEvent;

describe("jsav-array-click", () => {
  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });
  
  test("click is added to submission correctly", () => {
    recorder.passEvent(clickEvent);
    const steps = submission.state().animation.length;
    expect(steps).toBe(1);
  });

  test("click event data is added to submission", () => {
    exercise.initialStructures = singleArray;
    exerciseInitEvent.exercise = exercise;
    clickEvent.arrayid = singleArray.element["0"].id;
    recorder.passEvent(exerciseInitEvent);
    recorder.passEvent(clickEvent);
    const receivedState = submission.state();
    expect(receivedState.animation[0].type).toBe(clickEvent.type);
    expect(receivedState.animation[0].tstamp).toBe(clickEvent.tstamp);
    expect(receivedState.animation[0].data.arrayid).toBe(clickEvent.arrayid);
    expect(receivedState.animation[0].data.index).toBe(clickEvent.index);
  })

});

describe("jsav-exercise-gradeable-step", () => {
  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("state change in single array is added to submission", () => {
      exercise.initialStructures = singleArray;
      exerciseInitEvent.exercise = exercise;
      recorder.passEvent(exerciseInitEvent);
      clickEvent.arrayid = singleArray.element["0"].id;
      recorder.passEvent(clickEvent);
      exercise.initialStructures._values = helpers.arraySwap(singleArray._values, 0, 1);
      recorder.passEvent(gradeableStepEvent);
      const newState = {
        type: gradeableStepEvent.type,
        data: { dataStructureId: singleArray.element["0"].id, state: singleArray._values},
        tstamp: gradeableStepEvent.tstamp,
        currentStep: gradeableStepEvent.currentStep
      }
      const animation = submission.state().animation;
      expect(animation.reverse()[0]).toMatchObject(newState);
  })

  test("state change in multiple arrays are added to submission", () => {
      exercise.initialStructures = multipleArrays;
      exerciseInitEvent.exercise = exercise;
      recorder.passEvent(exerciseInitEvent);
      clickEvent.arrayid = multipleArrays[0].element["0"].id;
      recorder.passEvent(clickEvent);
      const swappedArrayOne = helpers.arraySwap(multipleArrays[0]._values, 0, 1)
      exercise.initialStructures[0]._values = swappedArrayOne;
      recorder.passEvent(gradeableStepEvent);
      const newStateOne = {
        type: gradeableStepEvent.type,
        data: { dataStructureId: multipleArrays[0].element["0"].id, state: swappedArrayOne},
        tstamp: gradeableStepEvent.tstamp,
        currentStep: gradeableStepEvent.currentStep
      }
      let animation = submission.state().animation;
      expect(animation[animation.length - 1]).toMatchObject(newStateOne);

      clickEvent.arrayid = multipleArrays[1].element["0"].id;
      recorder.passEvent(clickEvent);
      const swappedArrayTwo = helpers.arraySwap(multipleArrays[1]._values, 0, 1);
      exercise.initialStructures[1]._values = swappedArrayTwo
      recorder.passEvent(gradeableStepEvent);
      const newStateTwo = {
        type: gradeableStepEvent.type,
        data: { dataStructureId: multipleArrays[1].element["0"].id, state: swappedArrayTwo},
        tstamp: gradeableStepEvent.tstamp,
        currentStep: gradeableStepEvent.currentStep
      }
      animation = submission.state().animation;
      expect(animation[animation.length - 1]).toMatchObject(newStateTwo);
  })

})

describe("jsav-exercise-grade-button", () => {
  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("Saves grade button press to animation", () => {
      exercise.initialStructures = multipleArrays;
      exerciseInitEvent.exercise = exercise;
      recorder.passEvent(exerciseInitEvent);
      clickEvent.arrayid = multipleArrays[0].element["0"].id;
      recorder.passEvent(clickEvent);
      const swappedArrayOne = helpers.arraySwap(multipleArrays[0]._values, 0, 1)
      exercise.initialStructures[0]._values = swappedArrayOne;
      recorder.passEvent(gradeableStepEvent);
      clickEvent.arrayid = multipleArrays[1].element["0"].id;
      recorder.passEvent(clickEvent);
      const swappedArrayTwo = helpers.arraySwap(multipleArrays[1]._values, 0, 1);
      exercise.initialStructures[1]._values = swappedArrayTwo
      recorder.passEvent(gradeableStepEvent);
      recorder.passEvent(exerciseGradeButtonEvent);
      expectedState = {
        type: exerciseGradeButtonEvent.type,
        tstamp: exerciseGradeButtonEvent.tstamp,
        currentStep: exerciseGradeButtonEvent.currentStep,
        data: {
          score: { ...exerciseGradeButtonEvent.score },
        }
      }
      animation = submission.state().animation;
      expect(animation[animation.length - 1]).toMatchObject(expectedState);
  })
});