const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.URl || 3001;

server.listen(port, () => console.log("server listening on " + port));

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://localhost:3000",
      "https://dev.d30z43jak2q5yr.amplifyapp.com",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("user-merchant", (userId, merchant) => {
    console.log("user-merchant-" + userId + "-" + merchant);
    socket.join("user-merchant-" + userId + "-" + merchant);
  });

  socket.on("sending-message-user-merchant", (msg) => {
    console.log(msg, "incoming");
    socket.to(msg.user).emit("incoming-message", msg);
    socket.to(msg.merchant).emit("incoming-message", msg);
    socket
      .to(`user-merchant-${msg.user}-${msg.merchant}`)
      .emit("incoming-message", msg);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
