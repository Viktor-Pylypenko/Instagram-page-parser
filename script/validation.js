const axios = require('axios');

function checkAnswer(usernameAnswer) {
    if (!(/^(?!(?:null|undefined|false|[1-6]|^aa$))[\w\d_]{1,30}$/g).test(usernameAnswer)) {
      console.log("The parameter 'username' must not contain: spaces, dots, cyrillic and must not be null, false, undefined, 123456. Also your username cannot be longer than 30 characters. ")
      return false
    } 
    return true
}
function checkPhotoCount(photoCountAnswer) {
  if ((/^(?!0)\d+$/).test(photoCountAnswer)) {
    return true
  }
  console.log("You entered incorrect photo count")
  return false
}
const isPrivate = async function (usernameAnswer) {
  let response = await axios.get(`https://instagram.com/${usernameAnswer}`)
  return response.data.includes('"is_private":true')
}
const isEmpty = async function (usernameAnswer) {
  let response = await axios.get(`https://instagram.com/${usernameAnswer}`)
  return response.data.match(/edge_owner_to_timeline_media":{"count":0/g)
}

module.exports = {
    checkAnswer,
    checkPhotoCount,
    isPrivate,
    isEmpty
}