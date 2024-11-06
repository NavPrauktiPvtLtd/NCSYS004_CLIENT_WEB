import HomeButton from './HomeButton';
import styles from '../../styles/Details.module.css';

type Props = {
  setSelectedArea: (area: 'OPD' | 'IPD' | undefined) => void;
};

const Header = ({ setSelectedArea }: Props) => {
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
        <HomeButton setSelectedArea={setSelectedArea} />
      </div>
    </div>
  );
};

export default Header;
