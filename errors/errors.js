function customError(message) {
  const error = new Error(message);
  console.warn(error);
  // TODO: add error to submission? & stop recording
}

module.exports = {
  customError,
}
