const puppeteer = require('puppeteer');

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
    checkAnswer,
    checkPhotoCount,
    isPrivate,
    isEmpty
  } = require('./validation')

  let answerPromise;

  for(;;) {
    answerPromise = await createAnswerPromise();
    if (checkAnswer(answerPromise)) {
      let pageNotExist = await fetch(`https://instagram.com/${answerPromise}`);

      if (pageNotExist.status === 404) {
        console.log("This page doesn't exist")
        continue
      } 
      break;
    }
  }

  if (await isPrivate(answerPromise)) {
    console.log('Это закрытый аккаунт')
    process.exit()
  } else if (await isEmpty(answerPromise)) {
    console.log('Публикаций пока нет')
    process.exit()
  }

  await createFolder(answerPromise);

  let photoCountPromise;
  let somRes = null
  for (;;) {
    photoCountPromise = await createPhotoCountPromise();
    if (!checkPhotoCount(photoCountPromise)) {
      continue
    } else if(!somRes) {
      let regex = /(?<=edge_owner_to_timeline_media":\{"count":)[0-9]*/g;
      let response = await fetch(`https://instagram.com/${answerPromise}`);
      let convertedResponse = await response.text()
      somRes = convertedResponse.match(regex)[0]
    }
      console.log(typeof photoCountPromise)
      if (Number(somRes) < Number(photoCountPromise)) {
        console.log("Entered number of photos doesn't match the actual")
        continue
      } 
      break
    }
  
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
    let lastNodeCurrent = arr[arr.length - 1]
    if (lastNodePrevStep != lastNodeCurrent) {
      lastNodePrevStep = lastNodeCurrent
    } else {
      finished = true
    }
    await new Promise(res => setTimeout(res, 1200))
  }
  let arrayLinks = Object.keys(obj);

  arrayLinks.forEach(async (link, index) => {
    if (index >= photoCountPromise) {
      return false
    }
    const dest = fs.createWriteStream(`photos/${answerPromise}/photo${index+1}.jpg`)
    let response = await fetch(link)
    await response.body.pipe(dest)
  })

  browser.close();
})();