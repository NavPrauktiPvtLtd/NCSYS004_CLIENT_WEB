import TestCompletedSvg from '@/components/common/svg/TestCompletedSvg';
import styles from '../styles/Details.module.css';

import { useEffect } from 'react';
import { PageRoutes } from '../../@types/index.';
import { useNavigate } from 'react-router-dom';

const RegistrationComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(PageRoutes.HOME);
    }, 8000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className={styles.contents}>
      <div style={{ marginTop: '1rem' }}>
        <TestCompletedSvg></TestCompletedSvg>
      </div>
      <h1 className={styles.registrationcompletetext}>Thank you for providing your valuable feedback</h1>
    </div>
  );
};

export default RegistrationComplete;
