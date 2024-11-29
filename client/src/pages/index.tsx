import styles from '../styles/Homepage.module.css';
import styles2 from '../styles/Details.module.css';
import useClickSound from '@/hooks/useClickSound';
import { PageRoutes } from '../../@types/index.';
// import { useLanguageStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import HomePageSvg from '@/components/common/svg/HomePageSvg';
// import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ServerAPI from 'API/ServerAPI';
import { useAuthStore, useKioskSerialNumberStore } from '@/store/store';

export default function Home() {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  // const { setLanguage } = useLanguageStore();

  // const { i18n } = useTranslation();

  const { setKioskId, kioskSerialID } = useKioskSerialNumberStore();

  const { language, setLanguage } = useAuthStore();

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
        <div className="">
          <div className={styles.feedback} style={{ color: 'rgb(232, 80, 91)' }}>
            {language === 'English' ? 'Give Us Your Valuable Feedback Here' : 'ইয়াত আমাক আপোনাৰ মূল্যৱান মতামত দিয়ক'}
          </div>
        </div>
        <div className={styles.imageContainer2} style={{ width: '525px', height: '375px' }}>
          <HomePageSvg />
        </div>
        <div className={styles2.languageSelectorParentContainer}>
          <label style={{ fontWeight: '500' }}>{language === 'English' ? 'Preferred Language' : 'পচন্দৰ ভাষা'}</label>
          <div className={styles2.genderOptions}>
            <input
              type="checkbox"
              id="english"
              value="English"
              checked={language === 'English'}
              onChange={() => setLanguage('English')}
            />
            <label htmlFor="english">English</label>

            <input
              type="checkbox"
              id="assamese"
              value="Assamese"
              checked={language === 'Assamese'}
              onChange={() => setLanguage('Assamese')}
            />
            <label htmlFor="assamese">অসমীয়া</label>
          </div>
        </div>
        <div className={styles.welcome} style={{ color: 'rgb(232, 80, 91)' }}>
          {language === 'English' ? 'Welcome' : 'স্বাগতম'}
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleButton}>
            {language === 'English' ? 'Start' : 'আৰম্ভ কৰক'}
          </button>
        </div>
      </div>
    </>
  );
}
