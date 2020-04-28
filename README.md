![](./Exercise_Recorder_modules.png)

The  Exercise Recorder initializes automatically when imported into an HTML document, and it starts listening for all JSAV log events. For this reason it is important that the it is imported in the `<head>` element of the HTML document, before the JSAV exercise is loaded.

Upon initialization the Exercise Recorder will look for the *post\_url* URL parameter, which should contain the URL where the recorded animation data has to be posted.
Instead of a URL, the *post\_url* can also contain the string "window", in which case the recorded data will be posted to the window where the  Exercise Recorder has been loaded.

Currently the recorded data is sent to the given *post_url* when the user clicks the grade button.

![](./Exercise_Recorder_process.png)

## To run the tests
The tests are written with Jest. To run the tests do this directory:

- `npm install` in the root folder of this project (if you have not done yet).
- `npm run test`.




## Build the bundle file
To bundle all the required modules in one file use [Browserify](http://browserify.org/):
- `npm install`in the root folder of this project (if you have not done yet).
- `npm install -g browserify`.
- `browserify exerciseRecorder.js > build/jsav-exercise-recorder-bundle.js`.

- Add the bundle to the exercise HTML file `<head>` element using a `<script>` tag like:
`<script src="<PATH>/<TO>/build/jsav-exercise-recorder-bundle.js"></script>`.
