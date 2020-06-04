//
// services.js
//
// Sends JSAV exercise submission to a grader of A+ LMS.
// https://github.com/apluslms/a-plus/blob/master/doc/GRADERS.md
// Uses axios HTTP package: https://www.npmjs.com/package/axios

const axios = require('axios');

async function sendSubmission(data, url) {
  if (url === 'window') {
    try {
      window.parent.postMessage(data, "*");
    } catch (err) {
      console.warn('Failed posting submission to window', err);
    }
  }
  else {
    try {
      const response = await axios.post(`${url}/submissions`, data);
    } catch (err) {
      console.warn(`Failed posting submission to url ${url}: ${err}`)
    }
  }
}

module.exports = {
  sendSubmission
}
