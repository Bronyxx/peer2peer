const {
  seekers,
  listeners,
} = require("../store/queueStore");

function addToQueue(socketId, role) {

  if (role === "seeker") {

    if (!seekers.includes(socketId)) {
      seekers.push({socketId,joinedAt: Date.now()});
    }
  }

  if (role === "listener") {
    if (!listeners.includes(socketId)) {
      listeners.push({socketId,joinedAt: Date.now()});
    }
  }
}


function removeFromQueue(socketId) {
  const seekerIndex = seekers.findIndex(s => s.socketId === socketId);
  if (seekerIndex !== -1) seekers.splice(seekerIndex, 1);

  const listenerIndex = listeners.findIndex(l => l.socketId === socketId);
  if (listenerIndex !== -1) listeners.splice(listenerIndex, 1);
}



module.exports = {
  addToQueue,removeFromQueue
};