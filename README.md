# JSAV Exercise Recorder

The JSAV Exercise Recorder is a JavaScript software for creating recordings of
Visual Algorithm Simulation exercises. It is based on
[JSAV](http://jsav.io) and [OpenDSA](https://github.com/OpenDSA/OpenDSA).
For extensive background information, see
[Giacomo Mariani's MSc thesis](https://aaltodoc.aalto.fi/handle/123456789/44448).

## git branches

`jaal1.1` is the 2022 development branch based on
[JAAL 1.1 rc2 specification](https://github.com/Aalto-LeTech/JAAL/releases/tag/1.1rc2).

`master` is the old development branch.

`traky` is integration work for Data Structures and Algorithms Y (DSA Y) course.
This version of JSAV Exercise recorder does not handle communication with the
A+ LMS. The communication with the LMS is done in the function `n.showGrade()`
in the file
*tools/extras/OpenDSA/lib/odsaAV-min.js* at [DSA Y course repository]
(https://version.aalto.fi/gitlab/course/traky/blob/jaal/tools/extras/OpenDSA/lib/odsaAV-min-commented.js#L759).
The main differences in the JSAV Exercise Recorder between the `master` and
`traky` branches are in the main file *exerciseRecorder.js*:

1. `rest-services/services.js` is not used.
2. `setSubmissionAndPostUrl()` is not used.
3. Exercise recording is accessible globally:
   `global.JSAVrecorder.getRecording()`

## Required software

To compile and run the software, you will need:

- [Node.js](https://nodejs.org/en/)
- [Browserify](http://browserify.org/)
- [he](https://github.com/mathiasbynens/he)

## JAAL

The export data format of the Exercise Recorder is *JSON-based Algorithm
Animation Language* (JAAL). The language is specified in the MSc thesis.
Each JAAL recording (file) contains a student's answer to a JSAV-based
visual algorithm simulation exercise. The main structure of a JAAL recording
is the following.

    {
        "metadata": {} ,
        "definitions": {},
        "initialState": {},
        "animation": [],
    }


## Source code organisation

The Exercise Recorder is implemented on [Node.js](https://nodejs.org/en/).
A Node.js tool [Browserify](http://browserify.org/) compiles all source code
and required libraries into file *exerciseRecorderBundle.js* which can be
used with a JSAV-based exercise. The following figure represents the source
code modules and the build process.

![](./Exercise_Recorder_modules.png)


## How the Exercise Recorder works

When an HTML document containing the Exercise Recorder and the JSAV-based
exercise is loaded, the execution from the source code perspective begins at
file `exerciseRecorder.js`.

![](./Exercise_Recorder_process.png)

The Exercise Recorder initializes automatically when it is imported into an
HTML document. It starts listening for all JSAV log events. For this reason it
is important that the it is imported in the `<head>` element of the HTML
document, before the JSAV exercise is loaded.

Upon initialization the Exercise Recorder will look for the *post\_url* URL
parameter, which should contain the URL where the recorded animation data has to
be posted. Instead of a URL, the *post\_url* can also contain the string
"window", in which case the recorded data will be posted to the window where the
Exercise Recorder has been loaded.

![](./Exercise_data_flow.png)

Currently the recorded data is sent to the given *post_url* when the user clicks
the grade button.

## Installation for development with DSA Y

See doc/aplus_integration.md.

### Running the tests
The tests are written with Jest. To run the tests do this the
`jsav-exercise-recorder` directory:

    npm run test

### Building the bundle file
To bundle all the required modules in one file use [Browserify](http://browserify.org/).

    npm install -g browserify
    npm build

The DSA Y course repository, branch `traky`, should have a script called
`compile-jaal.sh` which does the rest.
