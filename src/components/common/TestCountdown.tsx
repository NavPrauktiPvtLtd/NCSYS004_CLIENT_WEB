import { useEffect, useState } from "react";
import styles from "../../styles/Homepage.module.css";
import useClickSound from "@/hooks/useClickSound";

interface TestCountdownProps {
  callback: () => void;
  countdownTimer?: number;
  text?: string;
}

function TestCountdown({
  callback,
  countdownTimer = 3,
  text,
}: TestCountdownProps) {
  const [loading, setLoading] = useState(false);

  const [showCountDown, setShowCountDown] = useState(false);

  const [count, setCount] = useState(countdownTimer);

  const { playClickSound } = useClickSound();

  useEffect(() => {
    if (loading) {
      setShowCountDown(true);
    }
  }, [loading]);

  useEffect(() => {
    let intervalId: any;
    if (count === 0) {
      clearInterval(intervalId);
    }
    if (showCountDown) {
      intervalId = setInterval(() => {
        setCount((prev) => {
          if (prev === 0) return prev;
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [showCountDown, count]);

  useEffect(() => {
    console.log({ count });

    if (count === 0) {
      console.log("callback");

      callback();
    }
  }, [count]);

  const onClick = () => {
    playClickSound();
    setLoading(true);
  };

  return (
    <div>
      <div>
        <button
          onClick={onClick}
          disabled={loading}
          className={styles.button}
          style={{ marginTop: "10px" }}
        >
          {loading ? " Please wait..." : "Start Now"}
        </button>
      </div>
      {showCountDown && (
        <div style={{ fontSize: "3rem", color: "#034694" }}>
          {text} {count}{" "}
        </div>
      )}
    </div>
  );
}

export default TestCountdown;
