## Running tests

```npm test```

or 

```npm run test``` 


Jest requires tests to be in a folder `__test__` in the same folder as package.json.

Jest files need to have the `.test.js` extension. 


Basic syntax: 
```js
test("test case name", () => {
    expect(something).toBe(expected_value);
})
```

You can group test cases into a collection. Each block can have set-ups specific to that block. Environment seems to be reset between describe blocks, but cannot say for sure. 

```js
describe("test block description", () => {
    test("test case name", () => {
        expect(something).toBe(expected_value);
    })
})
```

Set-up and tear-down can be done between tests, but also at the start/end of a test-block. 

```js
afterAll(() => {
    // do something after all tests
})
afterEach(() => {
    // do something after every individual test
})
beforeAll(() => {
    // do something before all tests
})
beforeEach(() => {
    // do something before every individual test. 
})
```
if you only want to run a few tests out of a file, specify them with `test.only()`. If you want to skip a specific test: `test.skip()`. Can write test functions already with `test.todo()`, it'll highlight that you still need to do these. 


For functions that return objects: 

`expect.toHaveProperty('property name')` to check if a property is present. Can pass a second parameter to check if property is a specific value or type. To check if correct type: `expect.toHaveProperty('property name', expect.any(Type))`. 

To check if an object returned is the expected object: `expect.toMatchObject({Obj})`. 


## Jest documentation

https://jestjs.io/docs/getting-started

## Jest cheatsheet

https://devhints.io/jest
