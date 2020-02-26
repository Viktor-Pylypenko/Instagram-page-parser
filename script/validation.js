function checkAnswer(answerPromise) {
  if (!(/^[\w\d_\.]{1,20}$/g).test(answerPromise)) {
    console.log("Username is incorrect. Please re-enter")
    return false
  } 
  return true
}

module.exports = {
    checkAnswer
};