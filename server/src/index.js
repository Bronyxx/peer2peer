const express =require("express");

const http = require("http");

const { Server } =require("socket.io");
 const cors = require("cors");

const {registerSocketHandlers,} = require("./sockets/socketHandlers");

const app = express();
app.get("/", (req, res) => {
  res.send("Peer Support Backend Running");
});
const server =
  http.createServer(app);
 

app.use(
  cors({
    origin: "https://peer2peer-ebon.vercel.app",
    credentials: true
  })
);

const io = new Server(
  server,
  {
    cors: {
       origin:[
      "https://peer2peer-ebon.vercel.app"
    ],
    methods:["GET","POST"],
    credentials:true,
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
  process.env.PORT || 5000,
  () =>
    console.log(
      "running"
    )
);