const fs = require('fs').promises;
const path = require('path');

const INPUT_FOLDER = './input';
const OUTPUT_FOLDER = './output';
const MAX_CHUNK_SIZE = 10240;

async function processFiles() {
  try {
    const files = await fs.readdir(INPUT_FOLDER);
    for (const file of files) {
      const filePath = path.join(INPUT_FOLDER, file);
      const fileStats = await fs.stat(filePath);
      const fileSizeInKB = Math.ceil(fileStats.size / 1024);
      const fileData = await fs.readFile(filePath, 'utf-8');
      const chunks = splitFileIntoChunks(fileData);
      await saveChunksToFile(chunks, file, fileSizeInKB);
    }
  } catch (error) {
    console.error(error);
  }
}

function splitFileIntoChunks(fileData) {
  const regex = /[0-9]+\T\s/g;
  const chunks = fileData.split(regex);
  const header = chunks.shift();
  const footer = getFooterFromData(fileData);
  const prefixedChunks = chunks.map((chunk, index) => {
    const prefix = index === 0 ? regex.exec(fileData)[0] : chunks[index - 1].match(regex)[0];
    return prefix + chunk;
  });
  return { header, footer, chunks: prefixedChunks };
}

function getFooterFromData(fileData) {
  const lines = fileData.trim().split('\n');
  return lines.slice(-2).join('\n');
}

async function saveChunksToFile(chunks, fileName, fileSizeInKB) {
  const { header, footer, chunks: prefixedChunks } = chunks;
  const chunkSizeInKB = Math.ceil(fileSizeInKB / Math.ceil(fileSizeInKB / MAX_CHUNK_SIZE));
  const numChunks = Math.ceil(fileSizeInKB / chunkSizeInKB);
  const fileBaseName = path.parse(fileName).name;

  const outputDir = path.join(OUTPUT_FOLDER, fileBaseName);
  await fs.mkdir(outputDir, { recursive: true });

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSizeInKB;
    const end = Math.min(start + chunkSizeInKB, fileSizeInKB);
    const chunkData = prefixedChunks.slice(start, end).join('') + (i === numChunks - 1 ? footer : '');
    const chunkFileName = `${fileBaseName}-${i + 1}-${numChunks}${path.extname(fileName)}`;
    const outputPath = path.join(outputDir, chunkFileName);
    await fs.writeFile(outputPath, header + chunkData);
    console.log(`Chunk saved to ${outputPath}`);
  }
}

processFiles();
