const FRONTEND_URL = process.env.REACT_FRONTEND_URl;

const io = require("socket.io")(8900, {
  cors: {
    origin: "https://localhost:3000",
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
    console.log("a user disconnected!");
  });
});
