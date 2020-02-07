const exercise = {
  _undoneSteps: [],
  initialStructures: undefined,
  jsav: {}, 
  options:
    {
      controls: {},
      feedback: "",
      feedbackSelectable: undefined,
      fixmode: "",
      fixmodeSelectable: undefined,
      gradeButtonTitle: undefined,
      grader: "",
      model: undefined,
      modelButtonTitle: undefined,
      reset: undefined,
      resetButtonTitle: "",
      undoButtonTitle: ""
    },
  score:
    {
      correct: undefined,
      fix: undefined,
      student: undefined,
      total: undefined,
      undo: undefined
    }
};

function resetExercise() {
  exercise._undoneSteps = [];
  exercise.initialStructures = undefined;
  exercise.jsav = {};
  exercise.options.controls = {};
  exercise.options.feedback = "";
  exercise.options.feedbackSelectable = undefined;
  exercise.options.fixmode = "";
  exercise.options.fixmodeSelectable = undefined;
  exercise.options.gradeButtonTitle = undefined;
  exercise.options.grader = "";
  exercise.options.model = undefined;
  exercise.options.modelButtonTitle = undefined;
  exercise.options.reset = undefined;
  exercise.options.resetButtonTitle = "";
  exercise.options.undoButtonTitle = "";
  exercise.score.correct = undefined;
  exercise.score.fix = undefined;
  exercise.score.student = undefined;
  exercise.score.total = undefined;
  exercise.score.undo = undefined;
}

const singleArray = {
  _indices: [],
    _values: [ 1, 2, 3 ],
    element: { "0": { 
      className: "jsavautoresize jsavcenter jsavindexed jsavarray jsavbararray", 
      id: "jsav-961a6492f4b748aaab2623e0c91e1391"
      }
    },
    jsav: {},
    options: { indexed: true, layout: "bar", visible: true }
};

function resetSingleArray() {
  singleArray._indices = [];
  singleArray._values = [ 1, 2, 3 ];
  singleArray.element = { "0": { 
    className: "jsavautoresize jsavcenter jsavindexed jsavarray jsavbararray", 
    id: "jsav-961a6492f4b748aaab2623e0c91e1391"
    }
  }
  singleArray.jsav = {};
  singleArray.options = { indexed: true, layout: "bar", visible: true };
}

const multipleArrays = [
  singleArray,
  {
    _indices: [],
    _values: [ 4, 5, 6 ],
    element: { "0": { 
      className: "jsavautoresize jsavcenter jsavindexed jsavarray jsavbararray", 
      id: "961a6492f4b748aaab2623e0c91e1392"
      }
    },
    jsav: {},
    options: { indexed: true, layout: "vertical", visible: true }
  },
];

function resetMultipleArrays() {
  multipleArrays[0]._indices = [];
  multipleArrays[0]._values = [ 1, 2, 3 ];
  multipleArrays[0].element = { "0": { 
    className: "jsavautoresize jsavcenter jsavindexed jsavarray jsavbararray", 
    id: "jsav-961a6492f4b748aaab2623e0c91e1391"
    }
  }
  multipleArrays[0].jsav = {};
  multipleArrays[0].options = { indexed: true, layout: "bar", visible: true };

  multipleArrays[1]._indices = [];
  multipleArrays[1]._values = [ 4, 5, 6 ];
  multipleArrays[1].element = { "0": { 
    className: "jsavautoresize jsavcenter jsavindexed jsavarray jsavbararray", 
    id: "jsav-961a6492f4b748aaab2623e0c91e1392"
    }
  }
  multipleArrays[1].jsav = {};
  multipleArrays[1].options = { indexed: true, layout: "vertical", visible: true };
}

const jsavInitEvent = {
  av: "jsavcontainer",
  currentStep: 0,
  initialHTML: "",
  tstamp: new Date(),
  type: "jsav-init"
}

function resetJsavInitEvent() {
  jsavInitEvent.av = "jsavcontainer";
  jsavInitEvent.currentStep = 0;
  jsavInitEvent.initialHTML = "";
  jsavInitEvent.tstamp = new Date();
  jsavInitEvent.type = "jsav-init";
}

const exerciseInitEvent = {
  av: "jsavcontainer",
  currentStep: 0,
  exercise: undefined,
  tstamp: new Date(),
  type: "jsav-exercise-init"
}

function resetExerciseInitEvent() {
  exerciseInitEvent.av = "jsavcontainer";
  exerciseInitEvent.currentStep = 0;
  exerciseInitEvent.exercise = undefined;
  exerciseInitEvent.tstamp = new Date();
  exerciseInitEvent.type = "jsav-exercise-init";
}

const clickEvent = {
  arrayid: "",
  av: "jsavcontainer",
  currentStep: 0,
  index: 0,
  tstamp: new Date(),
  type: "jsav-array-click"
}

function resetClickEvent() {
  clickEvent.arrayid = "";
  clickEvent.av = "jsavcontainer";
  clickEvent.currentStep = 0;
  clickEvent.tstamp = new Date();
  clickEvent.type =  "jsav-array-click";
}

const setIdEvent = {
  type: "recorder-set-id",
  tempId: "",
  newId: { parentElement: { parentElement: { id: "" }}}, 
}

function resetSetIdEvent() {
  setIdEvent.type = "recorder-set-id";
  setIdEvent.tempId = "";
  setIdEvent.newId = "";
}

const gradeableStepEvent = {
  av: "",
  currentStep: 0,
  tstamp: new Date(),
  type: "jsav-exercise-gradeable-step",
}

function resetGradableStepEvent() {
  gradeableStepEvent.av = "";
  gradeableStepEvent.currentStep = 0;
  gradeableStepEvent.tstamp = new Date();
  gradeableStepEvent.type = "jsav-exercise-gradeable-step";
}

const exerciseGradeButtonEvent = {
  av: '',
  currentStep: 0,
  score: {
    correct: 3,
    fix: 0,
    student: 1,
    total: 18,
    undo: 0
  },
  tstamp: new Date(),
  type: "jsav-exercise-grade-button"
}

function resetExerciseGradeButtonEvent() {
  exerciseGradeButtonEvent.av = '';
  currentStep = 0;
  exerciseGradeButtonEvent.score.correct = 3;
  exerciseGradeButtonEvent.score.fix = 0;
  exerciseGradeButtonEvent.score.student = 1;
  exerciseGradeButtonEvent.score.total = 18;
  exerciseGradeButtonEvent.score.undo = 0;
  exerciseGradeButtonEvent.tstamp = new Date();
  exerciseGradeButtonEvent.type = "jsav-exercise-grade-button";
}

const exerciseGradeEvent = {
  av: '',
  currentStep: 0,
  score: {
    correct: 3,
    fix: 0,
    student: 1,
    total: 18,
    undo: 0
  },
  tstamp: new Date(),
  type: "jsav-exercise-grade"
}

function resetExerciseGradeEvent() {
  exerciseGradeEvent.av = '';
  currentStep = 0;
  exerciseGradeEvent.score.correct = 3;
  exerciseGradeEvent.score.fix = 0;
  exerciseGradeEvent.score.student = 1;
  exerciseGradeEvent.score.total = 18;
  exerciseGradeEvent.score.undo = 0;
  exerciseGradeEvent.tstamp = new Date();
  exerciseGradeEvent.type = "jsav-exercise-grade";
}

function resetAllData() {
  resetExercise();
  resetSingleArray();
  resetMultipleArrays();
  resetJsavInitEvent();
  resetExerciseInitEvent()
  resetClickEvent();
  resetSetIdEvent();
  resetGradableStepEvent();
  resetExerciseGradeButtonEvent();
  resetExerciseGradeEvent();
}

function arraySwap(arr, i, j) {
  newArr = [ ...arr ];
  newArr[i] = arr[j];
  newArr[j] = arr[i]
  return newArr;
}

module.exports = {
  exercise,
  singleArray,
  multipleArrays,
  jsavInitEvent,
  exerciseInitEvent,
  clickEvent,
  setIdEvent,
  resetAllData,
  arraySwap,
  gradeableStepEvent,
  exerciseGradeButtonEvent,
  exerciseGradeEvent,
}