// TODO: add check to avoid endless loop
function copyObject(obj) {
  const copy = {};
  for(let k in obj) {
    if(Array.isArray(obj[k])) {
      copy[k] = [ ...obj[k] ];
      continue;
    }
    if(typeof(k) === "object") {
      copyObject(obj[k]);
      continue;
    }
    copy[k] = obj[k];
  }
  return copy;
}

// TODO: break objectIsNotEmpthy method down
function objectIsNotEmpthy(object) {
  if (typeof(object) !== "object") {
    throw new Error(`Given parameter should be of type \"object\": ${JSON.stringify(object)}`);
  }
  if (Object.keys(object).length === 0) {
    throw new Error(`Object can not be empthy: ${JSON.stringify(object)}`);
  }
  if(object === undefined) {
    throw new Error(`value is undefined: ${JSON.stringify(object)}`);
  }
  if(object === null) {
    throw new Error(`value is null: ${JSON.stringify(object)}`);
  }
  return true;
}

function objectIsNotArray(object) {
  if (Array.isArray(object)) {
    throw new Error(`Object can not be an array: ${JSON.stringify(object)}`);
  }
  if (typeof(object) !== "object") {
    throw new Error(`Given parameter should be of type \"object\": ${JSON.stringify(object)}`);
  }
  return true;
}

function doesNotContainObjects(object) {
  for(let k in object) {
    if (typeof(object[k]) === "object") {
      throw new Error(`Object can not contain other objects: ${JSON.stringify(object)}`);
    }
  }
  return true;
}

function isValidString(string) {
  if(typeof(string) !== 'string') {
    throw new Error(`value should be a string: ${string}`);
  }
  if(string === undefined) {
    throw new Error(`value is undefined: ${string}`);
  }
  if(string === null) {
    throw new Error(`value is null: ${string}`);
  }
  if(string.length === 0) {
    throw new Error(`Length should be more than 0: ${string}`);
  }
  return true;
}

module.exports = {
  copyObject,
  objectIsNotEmpthy,
  objectIsNotArray,
  doesNotContainObjects,
  isValidString,
}
