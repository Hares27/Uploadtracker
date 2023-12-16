# Uploader

This application built using nodejs core library [net](https://nodejs.org/docs/latest/api/net.html) and comes with the functionalities tracking the progress of file uploaded and storing the file with respective name in server side. In this application client and server are communicating using [sockets](https://nodejs.org/docs/latest/api/net.html#class-netsocket) to upload file and tracking the file uploading progress.

## Requirements

- [Node](https://nodejs.org/en) should be installed on you local machine

## Getting Started

To get started with this project, follow these steps:

- Fork this repository

- Clone this repository to your local machine:

```bash
git clone  https://github.com/Hares27/Uploadtracker.git
```

```bash
cd uploader
```

- Start the server:

```bash
node server
```

- Start the client:

```bash
node client test.txt
```
