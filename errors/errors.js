"use strict";

function customError(message) {
  const error = new Error(message);
  console.log(error);
  // TODO: add error to submission? & stop recording
}

module.exports = {
  customError,
}