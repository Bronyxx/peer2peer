function handleOffer(socket, data) {

    socket
        .to(data.sessionId)
        .emit("offer", data);

}


function handleAnswer(socket, data) {

    socket
        .to(data.sessionId)
        .emit("answer", data);

}


function handleIceCandidate(socket, data) {

    socket
        .to(data.sessionId)
        .emit(
            "ice-candidate",
            data
        );

}


module.exports = {
    handleOffer,
    handleAnswer,
    handleIceCandidate
};