## To run the tests
The tests are written with Jest. To run the tests do this directory:

`npm install`

`npm run test`

## Define the EXEC_ENV environment variable
Create a `.env.js` file with and define the EXEC_ENV.

For static pages, which require the *exercise recorder* to initialize automatically when imported:
```
EXEC_ENV = 'STATIC'
```

For dynamic pages, where you **do not** want the *exercise recorder* to initialize automatically:
```
EXEC_ENV = 'DYNAMIIC'
```

The *initialize()* and *detach()* methods are also exposed through the *window* global object. So you can use them to initialize and detach at will.

## Bundle required modules
To bundle all the required modules in one file use [Browserify](http://browserify.org/):
`npm install -g browserify`
`browserify exerciseRecorder.js > build/bundle.js`
Then add the bundle to the exercise html file using a `<script>` tag like:
`<script src="<PATH>/<TO>/build/bundle.js"></script>`

Alternatively you can *import* or *require* the bundle file.

## Handling the submission
The submission object is both sent the server and saved in the *window* global object.

## Example use with React
```
...
import "../jsav-exercise-recorder/build/exercise_recorder-bundle.js";
...
componentDidMount() {
  if(window.$ !== undefined){
    window.initializeRecorder();
  } else {
    window.location.pathname = '/';
  }
}

componentWillUnmount() {
  window.detachRecorder();
}
...
```
