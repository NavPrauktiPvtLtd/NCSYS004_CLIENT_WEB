import TestCompletedSvg from '@/components/common/svg/TestCompletedSvg';
import styles from '../styles/Details.module.css';

import { useEffect } from 'react';
import { PageRoutes } from '../../@types/index.';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/store';

const RegistrationComplete = () => {
  const navigate = useNavigate();

  const { setSelectedArea, language } = useAuthStore();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      setSelectedArea(undefined);
      navigate(PageRoutes.HOME);
    }, 4000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className={styles.contents}>
      <div style={{ marginTop: '1rem' }}>
        <TestCompletedSvg></TestCompletedSvg>
      </div>
      <h1 className={styles.registrationcompletetext}>
        {language === 'English' ? (
          'Thank you for providing your valuable feedback'
        ) : (
          <span style={{ fontFamily: 'Banikanta' }}>আপোনাৰ বহুমূলীয়া মতামত দিয়াৰ বাবে ধন্যবাদ</span>
        )}
      </h1>
    </div>
  );
};

export default RegistrationComplete;
