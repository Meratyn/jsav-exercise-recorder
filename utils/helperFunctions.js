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

function removeTrimLineBreaks(string){
  return string.split(/\r?\n|\r/g).map(e => e.trim()).join('');
}

function getExerciseHTML(exercise) {
  return exercise.jsav.container[0].innerHTML;
}

function getPopUp(text) {
  const modalDivStyle = {
    width: "100%",
    height: "100%",
    zIndex: 1,
    display: 'block',
    position: 'fixed',
    left: 0,
    top: 0,
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: '100px',
  }
  const modalContentStyle = {
    textAlign: 'center',
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%'
  }
  const popUpDiv = document.createElement('div');
  popUpDiv.id = "popUpDiv";
  const contentDiv = document.createElement('div');
  contentDiv.id = 'popUpContent';
  popUpDiv.appendChild(contentDiv);
  contentDiv.innerText = text;
  for(key in modalDivStyle) {
    popUpDiv.style[key] = modalDivStyle[key];
  }
  for(key in modalContentStyle) {
    contentDiv.style[key] = modalContentStyle[key];
  }
  return popUpDiv;
}


const helpers = {
  extractTextByClassName,
  extractTextByTagName,
  getExerciseHTML,
  getPopUp
}

module.exports = helpers;
