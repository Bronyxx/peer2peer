const express =require("express");

const http = require("http");
const metrics = require("./store/metricStore.js");
const turnCredentialsRoute= require("./routes/TurnRoute.js")


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
const connectedSessions = new Set(); // for checking the connected sessions
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
app.use(turnCredentialsRoute);


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

    socket.on("call-connected",({sessionId}) => {
      connectedSessions.add(sessionId);
      metrics.successful++;
          console.log("Successful session:",sessionId);
    });
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


          const avgMatchLatency =metrics.matchmakingCount === 0? 0: (metrics.totalMatchmakingLatency / metrics.matchmakingCount);

    res.json({
      attempts:
        metrics.attempts,

      successful:
        metrics.successful,

      successRate:
        rate.toFixed(2),

        matches:
    metrics.matchmakingCount,

  avgMatchLatency:
    avgMatchLatency.toFixed(2)
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