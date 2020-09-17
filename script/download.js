'use strict'

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function createFolder(answerPromise) { 
    fs.mkdir(`script/images/${answerPromise}`, { recursive: true }, (err) => {
      if (err)
        throw err;
    })
    fs.mkdir(`script/comments/${answerPromise}`, { recursive: true }, (err) => {
      if (err)
        throw err;
    })
}

let downloadImage = async (answerPromise, imgLink, j) => {  
    let url = imgLink
    let dest = path.resolve(__dirname, `images/${answerPromise}`, `image${j+1}.jpg`)
    const writer = fs.createWriteStream(dest)
  
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
}

let downloadComments = async (answerPromise, obj, j) => {
  fs.writeFile(`script/comments/${answerPromise}/image${j+1}.txt`, JSON.stringify(obj, undefined, '\t'), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
  }); 
}

module.exports = {
  createFolder,
  downloadImage,
  downloadComments
};