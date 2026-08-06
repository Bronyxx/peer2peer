const {
  seekers,
  listeners,
} = require("../store/queueStore");

function addToQueue(socketId, role) {

  if (role === "seeker") {

    if (!seekers.includes(socketId)) {
      seekers.push(socketId);
    }
  }

  if (role === "listener") {
    if (!listeners.includes(socketId)) {
      listeners.push(socketId);
    }
  }
}

module.exports = {
  addToQueue,
};