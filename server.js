const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};

function generateRandomName() {
  return `Anon_${Math.floor(1000 + Math.random() * 9000)}`;
}

app.use(express.static("public"));

function broadcastUserCount() {
  const count = Object.keys(users).length;
  io.emit("user-count", count);
 console.log(`📡 Users online: ${count}`);
}

io.on("connection", (socket) => {
  const username = generateRandomName();
 users[socket.id] = username;
 console.log(`✅ New user connected: ${username}`);
  socket.emit("assign-name", username);
  socket.broadcast.emit("system-message", `🔵 ${username} joined the chat`);
  broadcastUserCount();
  io.emit("user-count", Object.keys(users).length);

  socket.on("chat-message", (msg) => {
    io.emit("chat-message", {
      name: users[socket.id],
      message: msg,
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("system-message", `🔴 ${users[socket.id]} left the chat`);
      delete users[socket.id];
      io.emit("user-count", Object.keys(users).length);
      delete users[socket.id];
      broadcastUserCount();

    }
  });
});

server.listen(3000, () => {
  console.log("✅ AnonTalk running at http://localhost:3000");
});
