/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

interface Props {
  maxDuration: number;
}

function useProgress({ maxDuration }: Props) {
  const [progress, setProgress] = useState(0);

  const [start, setStart] = useState(false);

  const startProgress = () => {
    setStart(true);
  };

  const stopProgress = () => {
    setStart(false);
  };

  const completed = () => {
    setProgress(100);
    setStart(false);
  };

  const clearProgress = () => {
    setProgress(0);
    setStart(false);
  };

  useEffect(() => {
    let intervalId: any;
    if (progress === 99) return;
    if (start) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev === 99) {
            return prev;
          }
          return prev + 1;
        });
        console.log(intervalId);
      }, Math.floor((maxDuration * 1000) / 99));
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [start]);

  return {
    progress,
    setProgress,
    startProgress,
    stopProgress,
    completed,
    clearProgress,
  };
}

export default useProgress;
