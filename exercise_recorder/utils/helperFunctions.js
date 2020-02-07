// Takes an string containing an html element
function extractTextByClassName(html, className){
  let doc = (new DOMParser()).parseFromString(removeTrimLineBreaks(html), 'text/html');
  return doc.getElementsByClassName('instructions')[0].innerHTML
}

// Takes an string containing an html element
function extractTextByTagName(html, tagName){
  let doc = (new DOMParser()).parseFromString(removeTrimLineBreaks(html), 'text/html');
  return doc.getElementsByTagName(tagName)[0].innerHTML;
}

const removeTrimLineBreaks = (string) => string.split(/\r?\n|\r/g).map(e => e.trim()).join('');

const helpers = {
  extractTextByClassName,
  extractTextByTagName
}

module.exports = helpers;