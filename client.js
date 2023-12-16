const { readFile } = require("fs");
const net = require("net");
const fs = require("node:fs/promises");
const { argv } = require("node:process");
const path = require("path");
const client = net.createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  console.log("Connected to server");
});
client.setMaxListeners(Infinity);
let dataUploaded, newPercentage, uploadedPercentage;
client.on("connect", async () => {
  const filepath = argv[2];

  if (filepath) {
    (dataUploaded = 0), (newPercentage = 0), (uploadedPercentage = 0);
    await writeFiletoServer();
  }
});
const getFilename = async () => {
  const filepath = argv[2];
  const filename = path.basename(filepath);
  return filename;
};
const writeFiletoServer = async () => {
  const filename = await getFilename();
  client.write(`Filename:${filename}`);
  let { filereadStream, filesize } = await getFileReadStream(filename);
  filereadStream.on("data", async (chunk) => {
    if (!client.write(chunk)) {
      filereadStream.pause();
    }
    await getUploadedPercentage(chunk, filesize);
    client.on("drain", () => {
      filereadStream.resume();
    });
  });
  filereadStream.on("end", () => {
    console.log("file reading is completed");
    filereadStream.close();
    client.end();
  });
};
const getFileReadStream = async (filename) => {
  const fileHandler = await fs.open(filename, "r");
  const filesize = (await fileHandler.stat()).size;
  filereadStream = fileHandler.createReadStream();
  return { filereadStream, filesize };
};
const getUploadedPercentage = async (chunk, filesize) => {
  dataUploaded += chunk.length;
  newPercentage = Math.floor((dataUploaded / filesize) * 100);
  if (newPercentage != uploadedPercentage) {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
    uploadedPercentage = newPercentage;
    console.log(`Uploaded:${uploadedPercentage}%`);
  }
};
