const fetch = require("node-fetch");

function checkAnswer(answerPromise) {
    if (!(/^(?!(?:null|undefined|false|[1-6]|^aa$))[\w\d_]{1,30}$/g).test(answerPromise)) {
      console.log("Username is incorrect. Please re-enter")
      return false
    } 
    return true
}
function checkPhotoCount(photoCountPromise) {
  if ((/^(?!0)\d+$/).test(photoCountPromise)) {
    return true
  }
  console.log("You entered incorrect photo count")
  return false
}
const isPrivate = async function (answerPromise) {
  let response = await fetch(`https://instagram.com/${answerPromise}`);
  let convertedResponse = await response.text() 
  return convertedResponse.includes('"is_private":true')
}
const isEmpty = async function (answerPromise) {
  let response = await fetch(`https://instagram.com/${answerPromise}`);
  let convertedResponse = await response.text();
  return convertedResponse.match(/edge_owner_to_timeline_media":{"count":0/g)
}

module.exports = {
    checkAnswer,
    checkPhotoCount,
    isPrivate,
    isEmpty
}