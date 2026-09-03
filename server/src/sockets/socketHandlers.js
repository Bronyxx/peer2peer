const {handleJoinQueue,} = require("../controllers/queueController");
const {findSessionBySocket} = require("../services/disconnectService");
const {removeFromQueue}= require("../services/queueService.js");

const {sessions} = require("../store/sessionStore");
const {handleOffer,handleAnswer,handleIceCandidate,handleEndCall} = require("../controllers/signalingController");

function registerSocketHandlers(io,socket) {

  socket.on(
    "join-queue",
    payload =>
      handleJoinQueue(
        io,
        socket,
        payload
      )
  );

  //webrtc signaling handlers
socket.on(
    "offer",
    (data)=>{
        handleOffer(
            socket,
            data
        );
    }
);


socket.on(
    "answer",
    (data)=>{
        handleAnswer(
            socket,
            data
        );
    }
);


socket.on(
    "ice-candidate",
    (data)=>{
        handleIceCandidate(
            socket,
            data
        );
    }
);

socket.on(
  "end-call",
  (data) => {
    handleEndCall(socket, data);
  }
);

socket.on(
  "disconnect",
  () => {

    console.log(
      "Disconnected:",
      socket.id
    );
    removeFromQueue(socket.id)

    const result =
      findSessionBySocket(
        socket.id
      );

    if (!result) return;

    io.to(
      result.sessionId
    ).emit(
      "peer-disconnected"
    );

    sessions.delete(
      result.sessionId
    );

  }
);

}


module.exports = {
  registerSocketHandlers,
};