import HomeButton from './HomeButton';
import styles from '../../styles/Details.module.css';

const Header = () => {
  return (
    <div style={{ width: '100%', height: 70 }} className={styles.header}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'end',
          height: '100%',
          marginLeft: 35,
        }}
      >
        <HomeButton />
      </div>
    </div>
  );
};

export default Header;
