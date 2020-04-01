'use strict'

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function createFolder(answerPromise) { 
    fs.mkdir(`script/images/${answerPromise}`, { recursive: true }, (err) => {
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

  module.exports = {
    createFolder,
    downloadImage
  };