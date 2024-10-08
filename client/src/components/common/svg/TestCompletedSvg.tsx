import styles from "../../../styles/SvgComplete.module.css";

const TestCompletedSvg = () => {
  return (
    <svg
      className={styles.svg}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130.2 130.2"
    >
      <circle
        className={`${styles.path} ${styles.circle}`}
        fill="none"
        stroke="rgb(232, 80, 91)"
        stroke-width="6"
        stroke-miterlimit="10"
        cx="65.1"
        cy="65.1"
        r="62.1"
      />
      <polyline
        className={`${styles.path} ${styles.check}`}
        fill="none"
        stroke="rgb(232, 80, 91)"
        stroke-width="10"
        stroke-linecap="round"
        stroke-miterlimit="10"
        points="100.2,40.2 51.5,88.8 29.8,67.5 "
      />
    </svg>
  );
};

export default TestCompletedSvg;
