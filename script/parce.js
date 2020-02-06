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

  let browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto(`https://instagram.com/${username}`);

  await page.evaluate(() => {
    document.body.setAttribute('style', 'overflow: visible!important');
    // повторить с интервалом 1 секунды
    let timerId = setInterval(() => window.scrollTo(0, document.body.scrollHeight), 1000);
    let arrOfImages = [...document.querySelectorAll('img.FFVAD')];
    let returnLinks = images => images.map(p => p.src);
    returnLinks(arrOfImages);
    console.log(returnLinks);
    // остановить вывод через 8 секунд
    setTimeout(() => { clearInterval(timerId) }, 8000);
  })

  await page.screenshot({path: 'screenshots/userpage.png'});
  //const imagesSrc = await page.$$eval('img.FFVAD', images => images.map(img => img.src));
  
  
    // await page.evaluate(folder => {
    //   fs.mkdir('/autotests/photos', { recursive: true }, (err) => {
    //     if (err) throw err;
    //   })
    // });
    // нужна проверка на закрытый профиль или фотографий 0 в открытом профиле 
    
    // const imagesSrc = await page.$$eval('img', images => { 
    //     let res = []
    //     for (let i = 0; i < images.length; i++ ) {
    //         res[i] = img[i].src
    //     }
    //     return res
    // })




    // let someRes = []
    // for (let i = 0; i < photoCount; i++) {
    //     console.log(imagesSrc[i + 1])
    // }





    // const html = await page.$eval('body', elem => elem.outerHTML);
    // // console.log('===>', html);
    // const clk = await page.$('.v1Nh3');
    // await clk.click();
    // await page.waitForSelector('.EtaWk');
    // const plusButton = await page.waitForSelector('[aria-label="Load more comments"]')
    // const comments1 = await page.$$('div > li[role=menuitem]')
    // const htmlModal = await page.$eval('._2dDPU.vCf6V', wind => wind.outerHTML);
    // await plusButton.click()
    // const comments2 = await page.$$('div > li[role=menuitem]')
    // await page.waitFor(5000)
    // console.log(comments2.length, comments1.length)
    // // console.log('=======>', htmlModal)


    browser.close();
})(); 
