const fetch = require("node-fetch");

function checkAnswer(answerPromise) {
  if (!(/^[\w\d_\.]{1,20}$/g).test(answerPromise)) {
    console.log("Username is incorrect. Please re-enter")
    return false
  } 
  return true
}
const isPrivate = async function (answerPromise) {
  let response = await fetch(`https://instagram.com/${answerPromise}`);
  let convertedResponse = await response.text() 
  return convertedResponse.includes('"is_private":true')
}
const isEmpty = async function (answerPromise) {
  let response = await fetch(`https://instagram.com/${answerPromise}`);
  let convertedResponse = await response.text();
  return convertedResponse.includes(' 0 Posts - See Instagram photos and videos')
}

module.exports = {
    checkAnswer,
    isPrivate,
    isEmpty
};