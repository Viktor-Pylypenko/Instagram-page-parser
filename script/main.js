'use strict'

const puppeteer = require('puppeteer');

(async () => {

  const fetch = require("node-fetch");
  const axios = require('axios');

  const {
    createLoginPromise,
    createPasswordPromise,
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

  const {
    createFolder,
    downloadImage
  } = require('./download')

  let loginAnswer;
  
  for(;;) {
    loginAnswer = await createLoginPromise()
    if (checkAnswer(loginAnswer)) {
      break
    }
    continue
  }

  let passwordAnswer = await createPasswordPromise();

  let browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('https://www.instagram.com/accounts/login/', {waitUntil : 'networkidle2' });
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', `${loginAnswer}`);
  await page.type('input[name="password"]', `${passwordAnswer}`);
  await page.click('button[type="submit"]');
  let incorrectDataMessage = await page.$('p#slfErrorAlert')
  if(!incorrectDataMessage === null) {
    console.log('Sorry, your username or password was incorrect.')
    process.exit()
  }

  let cookies = await page._client.send('Network.getAllCookies')

  let usernameAnswer;

  for(;;) {
    usernameAnswer = await createAnswerPromise();
    if (checkAnswer(usernameAnswer)) {
      
      let pageNotExist = await fetch(`https://instagram.com/${usernameAnswer}`, {
        method: 'GET', 
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
          'cookie': cookies
        },
      });
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
  let matchResponse = null
  for (;;) {
    photoCountAnswer = await createPhotoCountPromise();
    if (!checkPhotoCount(photoCountAnswer)) {
      continue
    } else if(!matchResponse) {
      let regex = /(?<=edge_owner_to_timeline_media":\{"count":)[0-9]*/g;
      let response = await axios.get(`https://instagram.com/${usernameAnswer}`)
      matchResponse = response.data.match(regex)[0]
    }
    if (Number(matchResponse) < Number(photoCountAnswer)) {
      console.log("Entered number of photos doesn't match the actual")
      continue
    } 
    break
  }
  
  const commentsCountAnswer = await createCommentsCountPromise();

  await page.goto(`https://instagram.com/${usernameAnswer}`);

  await page.waitForSelector('img.FFVAD')
  await page.click('img.FFVAD')

  for(let j = 0; j < Number(photoCountAnswer); j++) {

    await page.waitForSelector('div[role=dialog] img.FFVAD') 
    let imgLink = await page.evaluate(() => document.querySelector('div[role=dialog] img.FFVAD').src)
    let likesCount = await page.evaluate(() => document.querySelector('.Nm9Fw > button > span').textContent.replace(/\s+/gm, ''))
    
    await downloadImage(usernameAnswer, imgLink, j)  
    
    let location = await page.evaluate(() => window.location.href)
    let locationData = await axios.get(location);
    let regularExpComment = /"edge_media_to_parent_comment":{"count":\d+/gm
    let matchRegularExpComment = locationData.data.match(regularExpComment)
    let regularExpNumber = /\d+/gm
    let commentsCount = String(matchRegularExpComment).match(regularExpNumber)
    console.log("In the photo located at: " + location + " " + Number(likesCount) + " likes and " + Number(commentsCount) + " comments")
    
    if (Number(commentsCount) === 0) {
      console.log("No comments yet")
      
    } else if (Number(commentsCountAnswer) > Number(commentsCount)) {
      console.log("Entered number of comments doesn't match the actual. There is only " + Number(commentsCount) + ' comments.')
      
    } else if (Number(commentsCount) > 0 && Number(commentsCount) <= 13) {
      let comments = await page.$$('div.C4VMK > span')
      let n = 1
      for(const comment of comments) {
        let eachComment = await page.evaluate(el => el.innerText, comment)
        console.log(`Комментарий номер ${n}: ` + eachComment)
        n++
        if (n > Number(commentsCountAnswer)) {
          break
        }
        continue
      }
    } else if (Number(commentsCount) > 13) {
      let awaitExpandButton
      do {
        try {
          awaitExpandButton = await page.waitForSelector('button.dCJp8.afkep', { timeout: 2500 })
          await awaitExpandButton.click()
        } catch (e) {
          break
        }
      } while (awaitExpandButton)

      let comments = await page.$$('div.C4VMK > span')
      let n = 1
      for(const comment of comments) {
        let eachComment = await page.evaluate(el => el.innerText, comment)
        console.log(`Комментарий номер ${n}:` + eachComment)
        n++
        if (n > Number(commentsCountAnswer)) { 
          break
        }
      }
    } 
    
    let paginationArrow = await page.$('.coreSpriteRightPaginationArrow')
    if (paginationArrow != null) {
        await page.waitForSelector('.coreSpriteRightPaginationArrow')
        await page.click('.coreSpriteRightPaginationArrow')
        await page.evaluate(() => {
        let modalWindow = document.querySelector('.RnEpo')
        if (modalWindow != null) {
          modalWindow.remove() 
        }
      })
      continue
    } else {
      break
    }
  }

  browser.close();
})();