// Takes a string containing an html element
function extractTextByClassName(html, className){
  let text;
  try {
    let doc = (new DOMParser()).parseFromString(removeTrimLineBreaks(html), 'text/html');
    text = doc.getElementsByClassName('instructions')[0].innerHTML;
  } catch (err) {
    throw new Error('Failed to extract text: ' + err)
  }
  return text;
}

// Takes a string containing an html element
function extractTextByTagName(html, tagName){
  let text;
  try {
    let doc = (new DOMParser()).parseFromString(removeTrimLineBreaks(html), 'text/html');
    text = doc.getElementsByTagName(tagName)[0].innerHTML;
  } catch (err) {
    throw new Error('Failed to extract text: ' + err)
  }
  return text;
}

const removeTrimLineBreaks = (string) => string.split(/\r?\n|\r/g).map(e => e.trim()).join('');

const helpers = {
  extractTextByClassName,
  extractTextByTagName
}

module.exports = helpers;