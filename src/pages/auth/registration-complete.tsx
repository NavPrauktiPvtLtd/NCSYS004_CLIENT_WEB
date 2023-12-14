import TestCompletedSvg from "@/components/common/svg/TestCompletedSvg";
import styles from "../../styles/Details.module.css";

import { useEffect } from "react";
import { PageRoutes } from "../../../@types/index.";
import { useNavigate } from "react-router-dom";
import { useLanguageStore } from "@/store/store";

const RegistrationComplete = () => {
  const navigate = useNavigate();

  const { selectedLanguage } = useLanguageStore();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(PageRoutes.HOME);
    }, 8000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className={styles.contents}>
      <div style={{ marginTop: "1rem" }}>
        <TestCompletedSvg></TestCompletedSvg>
      </div>
      <h1 className={styles.registrationcompletetext}>
        {selectedLanguage === "en"
          ? "Thank you for providing your valuable feedback."
          : "আপোনাৰ মূল্যবান মন্তব্য প্রদান কৰাৰ বাবে ধন্যবাদ। "}
      </h1>
    </div>
  );
};

export default RegistrationComplete;
