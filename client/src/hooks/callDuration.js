import { useRef } from "react";

export default function useCallDuration() {

  const startTimeRef = useRef(null);

  const start = () => {
    startTimeRef.current = Date.now();
  };


  const stop = () => {

    if (!startTimeRef.current) {
      return {
        seconds: 0,
        formatted: "0s"
      };
    }


    const seconds = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );


    startTimeRef.current = null;


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;


    let formatted;


    if (minutes > 0) {

      formatted =
        `${minutes}m ${remainingSeconds}s`;

    } else {

      formatted =
        `${remainingSeconds}s`;

    }


    return {
      seconds,
      formatted
    };

  };


  return {
    start,
    stop,
  };
}