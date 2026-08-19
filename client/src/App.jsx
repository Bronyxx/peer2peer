import { useState,useRef, useEffect } from 'react'
import CallPage from "./pages/callPage.jsx";
import LandingPage from "./pages/landingPage.jsx";



function App() {
 
   const[screen,setScreen]= useState("landing");
   if(screen === "landing"){
    return (
      <LandingPage 
      onContinue={()=>setScreen("call")}
      />
    );
   }
   if(screen === "call"){
    return (
      <CallPage />
    );
   }
return null;

}

export default App
