import HomeButton from './HomeButton';
import styles from '../../styles/Details.module.css';
import { useAuthStore } from '@/store/store';

const Header = () => {
  const { language, setLanguage } = useAuthStore();
  return (
    <div style={{ width: '100%', height: 70, paddingTop: 30 }} className={styles.header}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          height: '100%',
          marginLeft: 35,
          width: '100%',
        }}
      >
        <HomeButton />
        <div style={{ display: 'flex', gap: 20, justifyContent: 'end', width: '85%' }}>
          <label style={{ fontWeight: '500' }}>{language === 'English' ? 'Preferred Language' : 'পচন্দৰ ভাষা'}</label>
          <div className={styles.genderOptions}>
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
      </div>
    </div>
  );
};

export default Header;
