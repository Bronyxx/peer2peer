const express =require("express");

const http = require("http");

const { Server } =require("socket.io");

const {registerSocketHandlers,} = require("./sockets/socketHandlers");

const app = express();
app.get("/", (req, res) => {
  res.send("Peer Support Backend Running");
});
const server =
  http.createServer(app);

const io = new Server(
  server,
  {
    cors: {
       origin:[
      "https://your-frontend-domain.com"
    ],
    methods:["GET","POST"]
    },
  }
);

io.on(
  "connection",
  socket => {

    console.log(
      "connected",
      socket.id
    );

    registerSocketHandlers(
      io,
      socket
    );
  }
);

server.listen(
  5000,
  () =>
    console.log(
      "running"
    )
);