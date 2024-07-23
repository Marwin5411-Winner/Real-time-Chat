const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const Database = require("better-sqlite3");
const db = new Database("chat.db", Database.OPEN_READWRITE,{ verbose: console.log });

const app = express();
const server = createServer(app);
const io = new Server(server);

const chatInsert = db.prepare(
  "INSERT INTO chat (name, message, ip_address) VALUES (? , ? , ?)"
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(join(__dirname, "public/chat.html"));
});

app.get("/api/chat", async (req, res) => {
  const chats = db.prepare('SELECT name, message FROM chat ORDER BY id DESC LIMIT 50');

  const result = chats.all()

  res.json(result)

});

io.on("connection", (socket) => {
  const ipAddress = socket.handshake.address;

  console.log(ipAddress); // prints something like "203.0.113.195" (IPv4) or "2001:db8:85a3:8d3:1319:8a2e:370:7348" (IPv6)

  socket.on("userconnect", (msg) => {
    console.log(msg);
    io.emit("userconnect", msg)
  })


  socket.on("chat message", (msg) => {
    console.log("** From " + msg.name + "\nMessage: " + msg.message);
    io.emit("chat message", msg);
    chatInsert.run(msg.name, msg.message, ipAddress.toString());
  });

  socket.on("disconnect", function (msg) {
    // socket is disconnected
    console.table(msg);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
