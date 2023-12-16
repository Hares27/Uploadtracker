const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

const server = net.createServer();
server.listen(3000, () => {
  console.log("Server ready to accept the request");
});

server.on("connection", async (socket) => {
  socket.setMaxListeners(Infinity);
  let filename, fileWriteHandler, fileWriteStream;
  socket.on("data", async (data) => {
    if (!filename) {
      filename = await getFilename(data);
    }

    if (filename) {
      await setFileWriteHandlerFileWriteStream();

      await readFileFromClient(data);
    }
  });

  const readFileFromClient = async (data) => {
    if (!fileWriteStream.write(data)) {
      socket.pause();
    }

    fileWriteStream.on("drain", () => {
      socket.resume();
    });
  };
  const setFileWriteHandlerFileWriteStream = async () => {
    fileWriteHandler = await fs.open(
      path.join(__dirname, "storage", filename),
      "w"
    );
    fileWriteStream = await fileWriteHandler.createWriteStream();
  };

  socket.on("end", () => {
    if (fileWriteHandler) fileWriteHandler.close();
    fileWriteHandler = undefined;
    fileWriteStream = undefined;
    filename = undefined;
  });
});

const getFilename = async (data) => {
  if (data.toString().includes("Filename")) {
    const firstIndex = data.toString().indexOf(":");
    filename = data.toString().substring(firstIndex + 1);
    return filename;
  }
  return undefined;
};


