## To run the tests
The tests are written with Jest. To run the tests do this directory:

`npm install` 

`npm run test` 

## Bundle required modules

To bundle all the require modules in one file use [Browserify](http://browserify.org/):
`npm install -g browserify`
`browserify exerciseRecorder.js > build/bundle.js`
Then add the bundle to the exercise html file using a `<script>` tag like:
`<script src="<PATH>/<TO>/build/bundle.js"></script>`
