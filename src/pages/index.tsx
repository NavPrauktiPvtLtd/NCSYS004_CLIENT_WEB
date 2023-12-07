import styles from "../styles/Homepage.module.css";
import { GiSettingsKnobs } from "react-icons/gi";
import { Tooltip } from "@mantine/core";
import { useEffect } from "react";
import useClickSound from "@/hooks/useClickSound";
import { PageRoutes } from "../../@types/index.";
import AppAPI from "../../API/AppAPI";
import { useKioskSerialNumberStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import HomePageSvg from "@/components/common/svg/HomePageSvg";

export default function Home() {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const { setKioskId, kioskSerialID } = useKioskSerialNumberStore();

  function startDiagnosticHandler() {
    playClickSound();
    navigate(PageRoutes.AUTH_USER_LOGIN);
  }

  function systemAdminRedirectHandler() {
    playClickSound();
    navigate(PageRoutes.SYSTEM_ADMIN_LOGIN);
  }

  useEffect(() => {
    AppAPI.toggleCharging("on");
    const fetchSerialNumber = async () => {
      try {
        const { data } = await AppAPI.getSerialNumber();
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
        <Tooltip label="Settings" color="#007bff">
          <button
            style={{
              position: "absolute",
              top: "10%",
              right: "70px",
              fontSize: "2rem",
              cursor: "pointer",
              border: "none",
              background: "transparent",
            }}
            onClick={systemAdminRedirectHandler}
          >
            <GiSettingsKnobs
              style={{
                color: "#007bff",
                cursor: "pointer",
              }}
            />
          </button>
        </Tooltip>
        <div className={styles.imagecontainer} style={{ width: "400px" }}>
          <img src="/images/logo.png" alt="object" className={styles.img} />
        </div>
        <div
          className={styles.imageContainer2}
          style={{ width: "700px", height: "500px" }}
        >
          <HomePageSvg />
        </div>
        <div className={styles.welcome}> Welcome to Thetalabs</div>
        <div className={styles.homepagepara}>
          <p className={styles.paragraph}>
            Providing Quick, Easy, Preventive Health Screening. A Walk-in
            Medical ATM integrated with gold standard medical devices & e-Clinic
            Android App to provide rapid diagnostic & screening services.
          </p>
        </div>
        <div className={styles.buttons}>
          <div>
            <button className={styles.button} onClick={startDiagnosticHandler}>
              HEALTH DIAGNOSTIC
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
