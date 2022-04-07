const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8900;

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://localhost:3000",
      "http://localhost:3000",
      "https://dev.d30z43jak2q5yr.amplifyapp.com",
    ],
    methods: ["GET", "POST"]
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

app.use("/", (req, res) => {
  res.send({success: true})
})

server.listen(port, () => console.log("server listening on " + port));
