const express =require("express");

const http = require("http");


const { Server } =require("socket.io");
 const cors = require("cors");
 const app = express();
 app.use(express.json());


const {registerSocketHandlers,} = require("./sockets/socketHandlers");


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
const metrics = {
  attempts: 0,
  successful: 0
};

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

    socket.on("call-connected",() => {
    metrics.successful++;
  }
);
  }

  
);
app.get(
  "/metrics",
  (req,res)=>{

    const rate =
      metrics.attempts === 0
        ? 0
        : (
            metrics.successful /
            metrics.attempts
          ) * 100;

    res.json({
      attempts:
        metrics.attempts,

      successful:
        metrics.successful,

      successRate:
        rate.toFixed(2)
    });

  }
);


server.listen(
  process.env.PORT || 5000,
  () =>
    console.log(
      "running"
    )
);