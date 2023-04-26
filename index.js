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

  const str = fs.readFileSync(`./input/${file}`, data => data)
  const regex = /[0-9]+\T\s/g;

  const splitedArray = str.toString().split(regex)
  const firstItem = splitedArray.shift();

  const prefixSplitedData = str.toString().match(regex)
  const splitedData = splitedArray.slice();
  const organizedData = []

  for (let i = 0; i < prefixSplitedData.length; i++) {
    if (i == 0) {
      organizedData.push(firstItem + prefixSplitedData[i] + splitedData[i])
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
    const fileName = `${file.split('\.')[0]}-${index}-${numChunks}`;
    const dirname = `./output/${file.split('\.')[0]}`
    console.log(fileName, dirname)

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, (err) => {
        if (err) throw err
        console.log(`Pasta ${fileName} criada com sucesso`)
      })
    }

    fs.writeFileSync(`${dirname}/${fileName}`, chunk)

  })

})





