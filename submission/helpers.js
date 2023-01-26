//
// helpers.js
//
// Helper functions for

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

module.exports = {
  copyObject,
}
