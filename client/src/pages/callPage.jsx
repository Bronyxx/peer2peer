 import { useState, useRef, useEffect } from "react";
import { socket } from "../socket.js";
 import useCallDuration from "../hooks/callDuration.js";
import SessionSummary from "../components/sessionSummary.jsx";
import "callPage.css";
 
 export default function CallPage(){
 
 
 const {start,stop} = useCallDuration();
   const videoRef= useRef(null);
   const [sessionId, setSessionId] = useState(null);
   const [sessionStats, setSessionStats] =useState(null);
  const [status, setStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
   const remoteVideoRef = useRef(null);
   const peerRef = useRef(null);
   const localStreamRef = useRef(null);
   const matchTimerRef = useRef(null);
   const sessionIdRef = useRef(null);
   const [isLocalExpanded, setIsLocalExpanded] = useState(false);

//new peer connection
const createPeer = () => {

  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });

  peerRef.current = peer;

  // Add local tracks
  localStreamRef.current
    ?.getTracks()
    .forEach((track) => {
      peer.addTrack(
        track,
        localStreamRef.current
      );
    });

  // Remote stream
  peer.ontrack = (event) => {

    console.log("REMOTE TRACK RECEIVED");

    remoteVideoRef.current.srcObject =
      event.streams[0];

  };

  // ICE exchange
  peer.onicecandidate = (event) => {

    if (!event.candidate) return;
console.log("Emitting ICE candidate with sessionId:", sessionIdRef.current);
    socket.emit("ice-candidate", {
      sessionId:sessionIdRef.current,
      candidate: event.candidate,
    });

  };

  peer.onconnectionstatechange = () => {

  console.log(
    "Connection State:",
    peer.connectionState
  );
    window.__webrtcState = peer.connectionState; 
  console.log(
    "ICE State:",
    peer.iceConnectionState
  );
 
  if (
    peer.connectionState === "failed" ||
    peer.connectionState === "closed"
  ) {

    cleanupCall("connection lost");

  }
 if (peer.connectionState === "connected"){
   socket.emit(
      "call-connected",{
    sessionId: sessionIdRef.current
  }
    );
  }

};

  return peer;


  
};
{/*mute toggle*/} 
const toggleMute = () => {

  const audioTrack =
    localStreamRef.current
      ?.getAudioTracks()[0];

  if (!audioTrack) return;

  audioTrack.enabled =
    !audioTrack.enabled;

  setIsMuted(
    !audioTrack.enabled
  );

};

// end call
const cleanupCall = (reason) => {

  if (peerRef.current) {

    peerRef.current.close();

    peerRef.current = null;
  }

  if (remoteVideoRef.current) {

    remoteVideoRef.current.srcObject = null;

  }

   console.log(
    "cleanupCall called:",
    reason
  );

  if(reason){
    alert(`call ended: ${reason}`);
  }

  setSessionId(null);
  setStatus("ended");
  const duration = stop();

setSessionStats({
   duration: duration.formatted,
  endedBy: reason,
});

};



    const joinAsSeeker = () => {
      matchTimerRef.current = Date.now();
      setStatus("searching");
    socket.emit("join-queue", { 
      role: "seeker",
      
    });
  };

  const joinAsListener = () => {
     matchTimerRef.current = Date.now();
    setStatus("searching");
    socket.emit("join-queue", {
      role: "listener",
    });
  };

   useEffect(()=>{
    sessionIdRef.current = sessionId;
   },[sessionId]) 

   useEffect(()=>{
    async function startCamera(){
      try{
    const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
    })
    localStreamRef.current = stream;
    videoRef.current.srcObject=stream;
  
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
   
  }
  startCamera();
 
   },[])


  useEffect(() => {

  const handleMatch = (data) => {
  const latency =Date.now() - matchTimerRef.current;
  

console.log("Matchmaking Latency:",latency,"ms");

    console.log("MATCH FOUND:", data);

    setSessionId(data.sessionId);
      setStatus("matched");

  };

  socket.on("match-found", handleMatch);

  return () => {
    socket.off("match-found", handleMatch);
  };

}, []);


//socket event listeners for signalling
useEffect(() => {

  const handleOffer = async (data) => {

  const peer = createPeer();

  await peer.setRemoteDescription(
    data.offer
  );

  const answer =
    await peer.createAnswer();

  await peer.setLocalDescription(
    answer
  );

  socket.emit("answer", {
    sessionId: data.sessionId,
    answer,
  });
  setStatus("connected");
 
 
  start();

};

 const handleAnswer = async (data) => {

  await peerRef.current
    .setRemoteDescription(
      data.answer
    );
    setStatus("connected");
    start();

};


const handleIce = async (data) => {

  if (!peerRef.current) return;

  await peerRef.current
    .addIceCandidate(
      data.candidate
    );

};
const handleCallEnded = () => {

  console.log("CALL ENDED");

  cleanupCall("call ended by peer");

};

const handlePeerDisconnect =
  () => {

    console.log(
      "PEER DISCONNECTED"
    );

    cleanupCall("peer disconnected");

  };

  socket.on("call-ended",handleCallEnded);
  socket.on("offer", handleOffer);
  socket.on("answer", handleAnswer);
  socket.on("ice-candidate", handleIce);
  socket.on("peer-disconnected",handlePeerDisconnect);
  socket.on("disconnect", reason => {
  console.log("SOCKET DISCONNECTED:", reason);
});

socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", err => {
  console.log("CONNECT ERROR:", err);
});

  return () => {

    socket.off("offer", handleOffer);
    socket.off("answer", handleAnswer);
    socket.off("ice-candidate", handleIce);
    socket.off("call-ended", handleCallEnded);
    socket.off("peer-disconnected",handlePeerDisconnect
);

  };

}, []);
  


   return (
    <>
<div className="video-container">
    // user camera
    <video
     ref={videoRef}
     autoPlay
     playsInline
     muted
     className={isLocalExpanded? "local-video expanded" : "local-video"}
     
    />
    // remote camera
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
       className="remote-video"
    />
</div>
 <button
    className="resize-button"
    onClick={() =>
      setIsLocalExpanded(prev => !prev)
    }
  >
    ⛶
  </button>

      <button onClick={joinAsSeeker}
       disabled={status !== "idle" && status !== "ended"}>
        Need Support
      </button>

      <button onClick={joinAsListener}disabled={status !== "idle" &&status !== "ended"}>
        Offer Support
      </button>
     <h1>peer</h1>

     <h2>
{
 status === "idle" &&
 "Choose a role"
}

{
 status === "searching" &&
 "Searching for a match..."
}

{
 status === "matched" &&
 "Match found! Start the call."
}

{
 status === "connected" &&
 "Connected"
}

{
 status === "ended" && sessionStats && (

  <SessionSummary
    duration={sessionStats.duration}
  endedBy={sessionStats.endedBy}
  />

 )
}
 

</h2>

{
 status === "matched" && (
     <button
  onClick={async () => {

   const peer = createPeer();

    const offer =
      await peer.createOffer();

    await peer.setLocalDescription(
      offer
    );

    socket.emit("offer", {
      sessionId,
      offer,
    });

    setStatus("connected");

  }}
>
  Start Call
</button>
 )}

{status=== "connected" &&(
    <>
     <button onClick={toggleMute}>
      {isMuted
        ? " Unmute"
        : " Mute"}
    </button>
<button
  onClick={() => {

    socket.emit(
      "end-call",
      {
        sessionId
      }
    );

    cleanupCall("you ended the call");

  }}
>
  End Call
</button>
</>
   )}
   </>
   )}

    
  
     
   
   