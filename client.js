const { rejects } = require("assert");
const net = require("net");
const fs = require("node:fs/promises");
const { argv } = require("node:process");
const path = require("path");

let filereadStream;

const client = net.createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  console.log("Connected to server");
});
client.setMaxListeners(Infinity);

client.on("connect", async () => {
  const filepath = argv[2];
  const filename = path.basename(filepath);
  client.write(`Filename:${filename}`);
  const fileHandler = await fs.open(filename, "r");
  const filesize = (await fileHandler.stat()).size;
  filereadStream = fileHandler.createReadStream();
  let dataUploaded = 0;
  let newPercentage = 0;
  let uploadedPercentage = 0;
  filereadStream.on("data", async (chunk) => {
    if (!client.write(chunk)) {
      filereadStream.pause();
    }
    dataUploaded += chunk.length;
    newPercentage = Math.floor((dataUploaded / filesize) * 100);
    if (newPercentage != uploadedPercentage) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
      uploadedPercentage = newPercentage;
      console.log(`Uploaded:${uploadedPercentage}%`);
    }
    client.on("drain", () => {
      filereadStream.resume();
    });
  });
  filereadStream.on("end", () => {
    console.log("file reading is completed");
    filereadStream.close();
    client.end();
  });
});
