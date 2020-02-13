const readline = require('readline');

const fs = require('fs');

const createFolder = fs.mkdir('./photos', { recursive: true }, (err) => {
    if (err)
      throw err;
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  //add promise all
  const answerPromise = new Promise((resolve, reject) => {
    rl.question('Enter your username: ', (answer) => {
      resolve(answer);
    });
  });
  //const username = await answerPromise;

  const photoCountPromise = new Promise((resolve, reject) => {
    rl.question('Enter photo count: ', (answer) => {
      resolve(answer);
    });
  });
  //const photoCount = await photoCountPromise;

  const commentsCountPromise = new Promise((resolve, reject) => {
    rl.question('Enter comments count: ', (answer) => {
      resolve(answer);
      rl.close();
    });
  });
  //const commentsCount = await commentsCountPromise;

module.exports = {
    createFolder,
    answerPromise,
};