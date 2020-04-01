const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function createAnswerPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter your username: ', (answer) => {
      resolve(answer);
    })
  })
}

function createPhotoCountPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter photo count: ', (answer) => {
      resolve(answer);
    })
  })
}

function createCommentsCountPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter comments count: ', (answer) => {
      resolve(answer);
      rl.close();
    })
  })
}

module.exports = {
    createAnswerPromise,
    createPhotoCountPromise,
    createCommentsCountPromise
};