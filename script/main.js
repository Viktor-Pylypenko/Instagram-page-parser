const puppeteer = require('puppeteer');
const expect = require('chai').expect;

(async () => {

  const fs = require('fs');
  const fetch = require("node-fetch");

  const {
    createFolder,
    createAnswerPromise,
    createPhotoCountPromise,
    createCommentsCountPromise
  } = require('./console-modules');

  const {
    checkAnswer
  } = require('./validation')

  let answerPromise;

  createFolder();
  
  for(;;) {
    answerPromise = await createAnswerPromise();
    if (checkAnswer(answerPromise)) {
      let pageNotExist = await fetch(`https://instagram.com/${answerPromise}`);
      if (pageNotExist.status == 404) {
        console.log("This page doesn't exist")
        continue
      }
      break;
    }
  }
  const photoCountPromise = await createPhotoCountPromise();
  const commentsCountPromise = await createCommentsCountPromise();

  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`https://instagram.com/${answerPromise}`);
  
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
    await new Promise(res => setTimeout(res, 1200))
  }
  let arrayLinks = Object.keys(obj);

  arrayLinks.forEach(async (link, index) => {
    const dest = fs.createWriteStream(`photos/file${index}.jpg`)
    let response = await fetch(link)
    await response.body.pipe(dest)
  })

  // нужна проверка на закрытый профиль или фотографий 0 в открытом профиле 

  browser.close();
})(); 
