const puppeteer = require('puppeteer');
const expect = require('chai').expect;

(async () => {

  const readline = require('readline');
  const fs = require('fs');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answerPromise = new Promise((resolve, reject) => {
    rl.question('Enter your username: ', (answer) => {
      resolve(answer);
    });
  });
  const username = await answerPromise;

  const photoCountPromice = new Promise((resolve, reject) => {
    rl.question('Enter photo count: ', (answer) => {
      resolve(answer);
    });
  });
  const photoCount = await photoCountPromice;

  const commentsCountPromice = new Promise((resolve, reject) => {
    rl.question('Enter comments count: ', (answer) => {
      resolve(answer);
      rl.close();
    });
  });
  const commentsCount = await commentsCountPromice;

  console.log(username);
  console.log(photoCount);
  console.log(commentsCount)

  fs.mkdir('/Users/pylypenko/src/autotests/photos', { recursive: true }, (err) => {
    if (err)
      throw err;
  })

  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`https://instagram.com/${username}`);
  // Прокинуть все в obj Object.keys(obj) > потом fetch из obj 
  let obj  = {} 
  let finished = false
  let lastNodePrevStep = null
  while (!finished) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    let arr = await page.$$eval('img.FFVAD', images => images.map(img => img.src))

    for (const i of arr) obj[i] = 'Value'
    

    await page.evaluate(() => {
      let modalWindow = document.querySelector('.RnEpo')
      if (modalWindow != null) {
        modalWindow.remove() 
      }
    })
    let lastNodeCurrent = arr[arr.length - 1] //last node from iteration 
    if (lastNodePrevStep != lastNodeCurrent) {
      lastNodePrevStep = lastNodeCurrent
    } else {
      finished = true
    }
    await new Promise(res => setTimeout(res, 1000))
  }
  console.log(obj)
  await page.screenshot({ path: 'screenshots/userpage.png' });

  // нужна проверка на закрытый профиль или фотографий 0 в открытом профиле 

  browser.close();
})(); 
