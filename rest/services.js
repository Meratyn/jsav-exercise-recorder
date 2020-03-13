const axios = require('axios');

const serverAddress = 'http://localhost:3000';

async function sendSubmission(data, url) {
  if(url){
    try {
      console.warn(`Sending submission data to server`)
      const response = await axios.post(`${serverAddress}/submissions`, data);
    } catch (err) {
      console.warn(`Failed sending submission to url ${url}: ${err}`)
    }
  }
  else {
    console.warn(`No submission url provided, saving data in window global object`)
    window.submission = data;
  }
}

module.exports = {
  sendSubmission
}
