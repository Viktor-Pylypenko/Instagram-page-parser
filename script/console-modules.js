const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function createLoginPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter your login: ', (answer) => {
      resolve(answer);
    })
  })
}

function createPasswordPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter your password: ', (answer) => {
      resolve(answer);
    })
  })
}

function createAnswerPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter username you would like to download photos: ', (answer) => {
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
    createLoginPromise,
    createPasswordPromise,
    createAnswerPromise,
    createPhotoCountPromise,
    createCommentsCountPromise
};