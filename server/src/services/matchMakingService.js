const crypto = require("crypto");

const {
  seekers,
  listeners,
} = require("../store/queueStore");

const {
  sessions,
} = require("../store/sessionStore");

function tryMatch() {
    console.log("Seekers:", seekers);
console.log("Listeners:", listeners);

  if (
    seekers.length === 0 ||
    listeners.length === 0
  ) {
    return null;
  }

  const seeker = seekers.shift();
  const listener = listeners.shift();

  const sessionId =
    crypto.randomUUID();

  sessions.set(sessionId, {
    seeker,
    listener,
  });

  return {
    sessionId,
    seeker,
    listener,
  };
}

module.exports = {
  tryMatch,
};