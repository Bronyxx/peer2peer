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

module.exports = {
  addToQueue,
};