const readline = require('readline');

const fs = require('fs');

const createFolder = () => { 
  fs.mkdir('./photos', { recursive: true }, (err) => {
      if (err)
        throw err;
  })
};
createFolder();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

function createAnswerPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter your username: ', (answer) => {
      resolve(answer);
      rl.close();
    })
  })
}
const answerPromise = createAnswerPromise();

function createPhotoCountPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter photo count: ', (answer) => {
      resolve(answer);
      rl.close();
    })
  })
}
const photoCountPromise = createPhotoCountPromise();

function createCommentsCountPromise () {
  return new Promise((resolve, reject) => {
    rl.question('Enter comments count: ', (answer) => {
      resolve(answer);
      rl.close();
    })
  })
}
const commentsCountPromise = createCommentsCountPromise();

module.exports = {
    createFolder,
    answerPromise,
};