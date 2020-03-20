const axios = require('axios');

const serverAddress = 'http://localhost:3000';

async function sendSubmission(data, url) {
  if(url === 'window'){
    window.parent.postMessage(data, "*");
  }
  else {
    try {
      console.warn(`Sending submission data to server`)
      const response = await axios.post(`${serverAddress}/submissions`, data);
    } catch (err) {
      console.warn(`Failed sending submission to url ${url}: ${err}`)
    }
  }
}

module.exports = {
  sendSubmission
}
