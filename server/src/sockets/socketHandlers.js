const {
  handleJoinQueue,
} = require(
  "../controllers/queueController"
);
const {
 handleOffer,
 handleAnswer,
 handleIceCandidate
} = require("../controllers/signalingController");

function registerSocketHandlers(
  io,
  socket
) {

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


}


module.exports = {
  registerSocketHandlers,
};