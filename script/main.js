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

  let usernameAnswer;

  for(;;) {
    usernameAnswer = await createAnswerPromise();
    if (checkAnswer(usernameAnswer)) {
      let pageNotExist = await fetch(`https://instagram.com/${usernameAnswer}`);
      if (pageNotExist.status === 404) {
        console.log("This page doesn't exist")
        continue
      } 
      break;
    }
  }

  if (await isPrivate(usernameAnswer)) {
    console.log('Это закрытый аккаунт')
    process.exit()
  } else if (await isEmpty(usernameAnswer)) {
    console.log('Публикаций пока нет')
    process.exit()
  }

  await createFolder(usernameAnswer);

  let photoCountAnswer;
  let somRes = null
  for (;;) {
    photoCountAnswer = await createPhotoCountPromise();
    if (!checkPhotoCount(photoCountAnswer)) {
      continue
    } else if(!somRes) {
      let regex = /(?<=edge_owner_to_timeline_media":\{"count":)[0-9]*/g;
      let response = await fetch(`https://instagram.com/${usernameAnswer}`);
      let convertedResponse = await response.text()
      somRes = convertedResponse.match(regex)[0]
    }
    if (Number(somRes) < Number(photoCountAnswer)) {
      console.log("Entered number of photos doesn't match the actual")
      continue
    } 
    break
  }
  
  const commentsCountAnswer = await createCommentsCountPromise();

  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`https://instagram.com/${usernameAnswer}`);

  let obj  = {} 
  let finished = false
  let lastNodePrevStep = null
  while (!finished) {
    
    let photoBlockArr = await page.$$('.v1Nh3')
    for(let i = 0; i < Number(photoCountAnswer); i++) {
      await page.waitForSelector('.v1Nh3')
      await photoBlockArr[i].click()
      let location = await page.evaluate(() => window.location)
      let singlePhotoInfo = await fetch(location)
      let convertedInfo = await singlePhotoInfo.textConverted()
      console.log(convertedInfo)
      await page.waitForSelector('div.yiMZG > .wpO6b ')
      await page.click('div.yiMZG > .wpO6b ')
    }

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
    if (Object.keys(obj).length > Number(photoCountAnswer)) { 
      finished = true
    } else if (lastNodePrevStep != lastNodeCurrent) {
      lastNodePrevStep = lastNodeCurrent
    } else {
      finished = true
    }
    await new Promise(res => setTimeout(res, 1200))
  }
  let arrayLinks = Object.keys(obj);

  for (let i = 0; i < Number(photoCountAnswer); i++) {
      const link = arrayLinks[i]
      const dest = fs.createWriteStream(`photos/${usernameAnswer}/photo${i+1}.jpg`)
      let response = await fetch(link)
      await response.body.pipe(dest)
  }
  browser.close();
})();