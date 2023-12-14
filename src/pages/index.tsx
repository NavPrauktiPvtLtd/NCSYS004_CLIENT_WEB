import styles from "../styles/Homepage.module.css";
import useClickSound from "@/hooks/useClickSound";
import { PageRoutes } from "../../@types/index.";
import { useLanguageStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import HomePageSvg from "@/components/common/svg/HomePageSvg";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const { setLanguage } = useLanguageStore();

  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    playClickSound();
    console.log(`Changing language to ${language}`);
    i18n.changeLanguage(language);
    setLanguage(language);
    navigate(PageRoutes.AUTH_USER_REGISTER_MEMEBER);
  };

  return (
    <>
      <div className={styles.contents}>
        <div
          className={styles.imageContainer2}
          style={{ width: "700px", height: "500px" }}
        >
          <HomePageSvg />
        </div>
        <div className={styles.welcome} style={{ color: "rgb(232, 80, 91)" }}>
          {" "}
          Welcome
        </div>
        <div className={styles.homepagepara}>
          <p className={styles.paragraph} style={{ color: "rgb(232, 80, 91)" }}>
            Choose The Language
          </p>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => changeLanguage("en")}
          >
            ENGLISH
          </button>
          <button
            className={styles.button}
            onClick={() => changeLanguage("as")}
          >
            অসমীয়া
          </button>
        </div>
      </div>
    </>
  );
}
