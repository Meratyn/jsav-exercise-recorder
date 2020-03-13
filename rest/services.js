const axios = require('axios');

const serverAddress = 'http://localhost:3000';

async function sendSubmission(data) {
  try {
    const response = await axios.post(`${serverAddress}/submissions`, data);
  } catch (err) {
    console.warn(`${err} \nIf this is the test app, don't worry and have a brew`);
  }
}

module.exports = {
  sendSubmission
}
