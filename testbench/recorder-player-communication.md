# How the Recorder and Player communicate in the test bench

1. User clicks the Submit button.

2. odsaAV-min.js : sendSubmission generates a browser event to notify the
   Player. Event type is "jsav-exercise-recorder-test-submit", event data
   is the JAAL recording without escaping.
