import TestCompletedSvg from "@/components/common/svg/TestCompletedSvg";
import styles from "../../styles/Details.module.css";

import { useEffect } from "react";
import { PageRoutes } from "../../../@types/index.";
import { useNavigate } from "react-router-dom";

const RegistrationComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(PageRoutes.HOME);
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className={styles.contents}>
      <div className={styles.imagecontainer} style={{ width: "400px" }}>
        <img src="/images/logo.png" alt="object" className={styles.img} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <TestCompletedSvg></TestCompletedSvg>
      </div>
      <h1 className={styles.registrationcompletetext}>
        Thank you for sharing your valuable feedback.
      </h1>
    </div>
  );
};

export default RegistrationComplete;
