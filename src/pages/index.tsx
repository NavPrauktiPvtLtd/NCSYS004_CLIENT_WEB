import styles from "../styles/Homepage.module.css";
import { useEffect } from "react";
import useClickSound from "@/hooks/useClickSound";
import { PageRoutes } from "../../@types/index.";
import { useKioskSerialNumberStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import HomePageSvg from "@/components/common/svg/HomePageSvg";
import ServerAPI from "API/ServerAPI";

export default function Home() {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const { setKioskId, kioskSerialID } = useKioskSerialNumberStore();

  function startDiagnosticHandler() {
    playClickSound();
    navigate(PageRoutes.AUTH_USER_REGISTER_MEMEBER);
  }

  useEffect(() => {
    const fetchSerialNumber = async () => {
      try {
        const { data } = await ServerAPI.getSerialNumber();
        setKioskId(data.serialNumber);
        // console.log(data.serialNumber);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSerialNumber();
  }, []);

  useEffect(() => {
    console.log({ kioskSerialID });
  }, [kioskSerialID]);

  return (
    <>
      <div className={styles.contents}>
        {/* <div className={styles.imagecontainer} style={{ width: "200px" }}>
          <img src="/images/logo.png" alt="object" className={styles.img} />
        </div> */}
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
          <button className={styles.button} onClick={startDiagnosticHandler}>
            ENGLISH
          </button>
          <button className={styles.button} onClick={startDiagnosticHandler}>
            অসমীয়া
          </button>
        </div>
      </div>
    </>
  );
}
