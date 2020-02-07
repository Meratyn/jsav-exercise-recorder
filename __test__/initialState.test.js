const recorder = require("../exerciseRecorder")
const helpers = require('./testHelpers');
const submission = require("../submission/submission");


describe("jsav-exercise-init", () => {
  const exercise = helpers.exercise;
  const exerciseInitEvent = helpers.exerciseInitEvent;
  const singleArray = helpers.singleArray;
  const multipleArrays = helpers.multipleArrays;
  const setIdEvent = helpers.setIdEvent;


  afterEach(() => {
    submission.reset();
    helpers.resetAllData();
  });

  test("sets click listener on single array DOM element if id is missing", () => {
    singleArray.element['0'].id = "";
    exercise.initialStructures = singleArray;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    expect(exercise.initialStructures.element['0'].onclick).toBeDefined();
  })

  test("sets click listener on multiple arrays DOM element if id is missing", () => {
    multipleArrays[0].element['0'].id = "";
    multipleArrays[1].element['0'].id = "";
    exercise.initialStructures = multipleArrays;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    expect(exercise.initialStructures[0].element['0'].onclick).toBeDefined();
    expect(exercise.initialStructures[1].element['0'].onclick).toBeDefined();    
  })

  test("sets exercise single array in submission correctly", () => {
    const expectedState = [{
      type: "array",
      id: singleArray.element['0'].id ,
      values: singleArray._values,
      options: { indexed: true, layout: "bar", visible: true }
    }];

    exercise.initialStructures = singleArray;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    const receivedState = submission.state().initialState;
    expect(receivedState).toEqual(expectedState);
  })

  test("sets exercise multiple arrays in submission correctly", () => {
    const expectedState = [
      {
        type: "array",
        id: multipleArrays[0].element['0'].id,
        values: multipleArrays[0]._values,
        options: { indexed: true, layout: "bar", visible: true }
      },
      {
        type: "array",
        id: multipleArrays[1].element['0'].id,
        values: multipleArrays[1]._values,
        options: { indexed: true, layout: "vertical", visible: true }
      }
    ];  

    exercise.initialStructures = multipleArrays;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent)
    const receivedState = submission.state().initialState;
    expect(receivedState).toEqual(expectedState);
  })

  test("sets temporary id on single array if it is missing", () => {
    singleArray.element['0'].id = "";
    exercise.initialStructures = singleArray;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    expect(submission.state().initialState[0].id).toEqual(expect.stringContaining('tempid'))
  })

  test("sets temporary id on multiple arrays if it is missing", () => {
    multipleArrays[0].element['0'].id = "";
    multipleArrays[1].element['0'].id = "";
    exercise.initialStructures = multipleArrays;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    expect(submission.state().initialState[0].id).toEqual(expect.stringContaining('tempid'))
    expect(submission.state().initialState[1].id).toEqual(expect.stringContaining('tempid'))
  })

  test("recorder-set-id, sets jsav array id on single array if previouse was temporary", () => {
    singleArray.element['0'].id = "";
    exercise.initialStructures = singleArray;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    tempId = submission.state().initialState[0].id;
    newId = "jsav-1";
    setIdEvent.tempId = tempId
    setIdEvent.newId = newId;
    recorder.passEvent(setIdEvent);
    expect(submission.state().initialState[0].id).toBe(newId);
  })

  test("recorder-set-id, sets jsav array id on multiple arrays if previouse was temporary", () => {
    multipleArrays[0].element['0'].id = "";
    multipleArrays[1].element['0'].id = "";
    exercise.initialStructures = multipleArrays;
    exerciseInitEvent.exercise = exercise;
    recorder.passEvent(exerciseInitEvent);
    tempIdFirst = submission.state().initialState[0].id;
    tempIdSecond = submission.state().initialState[1].id;
    newIdFirst = "jsav-1";
    newIdSecond = "jsav-2";
    setIdEvent.tempId = tempIdFirst
    setIdEvent.newId = newIdFirst;
    recorder.passEvent(setIdEvent);
    expect(submission.state().initialState[0].id).toBe(newIdFirst);
    setIdEvent.tempId = tempIdSecond
    setIdEvent.newId = newIdSecond;
    recorder.passEvent(setIdEvent);
    expect(submission.state().initialState[1].id).toBe(newIdSecond);
  })
});
