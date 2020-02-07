const axios = require('axios');

const serverAddress = 'http://localhost:3000';

async function sendSubmission(data) {  
  try {
    const response = await axios.post(`${serverAddress}/submissions`, data);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  sendSubmission
}

