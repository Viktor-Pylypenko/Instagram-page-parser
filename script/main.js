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
  console.log(commentsCountAnswer)

  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`https://instagram.com/${usernameAnswer}`);

  let obj  = {} 
  let finished = false
  let lastNodePrevStep = null
  let visibleCountOfPhotos = 24
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
    if (visibleCountOfPhotos > Number(photoCountAnswer)) { 
      finished = true
    } else if (lastNodePrevStep != lastNodeCurrent) {
      lastNodePrevStep = lastNodeCurrent
    } else {
      finished = true
    }
    await new Promise(res => setTimeout(res, 1200))
    visibleCountOfPhotos += 12
  }
  let arrayLinks = Object.keys(obj);

  arrayLinks.forEach(async (link, index) => {
    const dest = fs.createWriteStream(`photos/${usernameAnswer}/photo${index+1}.jpg`)
    let response = await fetch(link)
    await response.body.pipe(dest)
    if (index >= photoCountAnswer) {
      return false
    }
  })

  browser.close();
})();