import styles from "../../styles/Homepage.module.css";
import { Progress } from "@mantine/core";
// import { TestStatus } from "../../../@types/index.";

interface TestProgressProps {
  onClick: () => void;
  // status: TestStatus;
  progress: number;
  text?: string;
}

const TestProgress = ({
  onClick,
  // status,
  progress = 0,
  text,
}: TestProgressProps) => {
  return (
    <div className={styles.measurementcontainertest}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#034694",
        }}
      >
        {/* <img src={imageSrc} style={{ width: "100%", height: "auto" }} /> */}
        <h1 style={{ fontSize: "3rem", textTransform: "uppercase" }}>{text}</h1>
      </div>
      <div style={{ width: "100%" }}>
        <Progress
          value={progress}
          label={progress + "%"}
          size="xl"
          radius="xl"
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => onClick()} className={styles.button}>
          {status}
        </button>
      </div>
    </div>
  );
};

export default TestProgress;
