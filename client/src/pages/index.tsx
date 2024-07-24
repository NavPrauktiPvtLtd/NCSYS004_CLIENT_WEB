import styles from '../styles/Homepage.module.css';
import useClickSound from '@/hooks/useClickSound';
import { PageRoutes } from '../../@types/index.';
import { useLanguageStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import HomePageSvg from '@/components/common/svg/HomePageSvg';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ServerAPI from 'API/ServerAPI';
import { useKioskSerialNumberStore } from '@/store/store';

export default function Home() {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const { setLanguage } = useLanguageStore();

  const { i18n } = useTranslation();

  const { setKioskId, kioskSerialID } = useKioskSerialNumberStore();

  // const changeLanguage = (language: string) => {
  //   playClickSound();
  //   console.log(`Changing language to ${language}`);
  //   i18n.changeLanguage(language);
  //   setLanguage(language);
  //   navigate(PageRoutes.AUTH_USER_REGISTER_MEMEBER);
  // };

  useEffect(() => {
    const fetchSerialNo = async () => {
      try {
        const { data } = await ServerAPI.getSerialNumber();
        setKioskId(data.serialNumber);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSerialNo();
  }, []);

  useEffect(() => {
    console.log('kioskid', { kioskSerialID });
  }, [kioskSerialID]);

  const handleButton = () => {
    playClickSound();
    navigate(PageRoutes.AUTH_USER_REGISTER_MEMEBER);
  };

  return (
    <>
      <div className={styles.contents}>
        <div className={styles.imageContainer2} style={{ width: '700px', height: '500px' }}>
          <HomePageSvg />
        </div>
        <div className={styles.welcome} style={{ color: 'rgb(232, 80, 91)' }}>
          {' '}
          Welcome
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleButton}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}
