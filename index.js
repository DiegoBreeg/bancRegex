const fs = require('fs')
const path = require('path');

const folderPath = './input';

const files = fs.readdirSync(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  return files
})

files.forEach(file => {
  const dataBuffer = fs.readFileSync(`./input/${file}`, data => data)
  const rawData = dataBuffer.toString()
  const regex = /[0-9]+\T\s/g;

  const splitedArray = rawData.split(regex)
  const header = splitedArray.shift();
  const splitedFooter = rawData.split(/\n/ig)
  const footer = splitedFooter[splitedFooter.length - 3] + splitedFooter[splitedFooter.length - 2]
  const prefixSplitedData = rawData.match(regex)
  const splitedData = splitedArray.slice();
  const organizedData = []

  for (let i = 0; i < prefixSplitedData.length; i++) {
    if (i == 0) {
      organizedData.push(prefixSplitedData[i] + splitedData[i])
      continue
    }
    organizedData.push(prefixSplitedData[i] + splitedData[i])
  }

  function chunkArray(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk.join(""));
    }
    return result;
  }

  const arr = organizedData
  const numChunks = 10;
  const chunkedArr = chunkArray(arr, Math.ceil(arr.length / numChunks));

  chunkedArr.forEach((chunk, index, arr) => {
    const data = index == arr.length - 1 ? header + chunk : header + chunk + footer
    const fileName = `${file.split('\.')[0]}-${index}-${numChunks}`;
    const dirname = `./output/${file.split('\.')[0]}`
    const extesion = `.${file.split('\.')[1]}`


    if (!fs.existsSync('output')) {
      fs.mkdirSync('output', (err) => {
        if (err) throw err
        console.log(`Pasta output criada com sucesso`)
      })
    }

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, (err) => {
        if (err) throw err
        console.log(`Pasta ${fileName} criada com sucesso`)
      })
    }

    fs.writeFileSync(`${dirname}/${fileName}${extesion}`, data)
    console.log(fileName, dirname)

  })

})





