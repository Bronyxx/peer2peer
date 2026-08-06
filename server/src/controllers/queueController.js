const {
  addToQueue,
} = require("../services/queueService");

const {
  tryMatch,
} = require("../services/matchmakingService");

function handleJoinQueue(
  io,
  socket,
  payload
) {
  console.log(
  "JOIN REQUEST",
  socket.id,
  payload.role
);

  addToQueue(
    socket.id,
    payload.role
  );

  const match =
    tryMatch();

  if (!match) return;
  //room join 
  const seekerSocket =
  io.sockets.sockets.get(
    match.seeker
  );

const listenerSocket =
  io.sockets.sockets.get(
    match.listener
  );

seekerSocket.join(
  match.sessionId
);

listenerSocket.join(
  match.sessionId
);

  io.to(match.seeker)
    .emit("match-found", {
      sessionId:
        match.sessionId,
      initiator: false,
    });

  io.to(match.listener)
    .emit("match-found", {
      sessionId:
        match.sessionId,
      initiator: true,
    });
     
    console.log(
  `Seeker joined ${match.sessionId}`
);

console.log(
  `Listener joined ${match.sessionId}`
);
}

module.exports = {
  handleJoinQueue,
};