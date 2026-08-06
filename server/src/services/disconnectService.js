const { sessions } =
  require("../store/sessionStore");

function findSessionBySocket(
  socketId
) {

  for (
    const [sessionId, session]
    of sessions
  ) {

    if (
      session.seeker === socketId ||
  session.listener === socketId
    ) {

      return {
        sessionId,
        session
      };

    }

  }

  return null;
}

module.exports = {
  findSessionBySocket
};