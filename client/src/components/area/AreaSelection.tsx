import { FaHospitalAlt } from 'react-icons/fa';
import styles from '../../styles/Details.module.css';
import { useAuthStore } from '@/store/store';

type Props = {
  label: string;
  onClick: () => void;
  tooltipText: string;
};

export default function AreaSelection({ label, onClick, tooltipText }: Props) {
  const { language } = useAuthStore();
  return (
    <div className={styles.selectionBox} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <FaHospitalAlt size={70} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '40px' }}>
        {label}
        <span
          style={{
            fontSize: '20px',
            marginTop: '10px',
            fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined,
          }}
        >
          ({tooltipText})
        </span>
      </div>
    </div>
  );
}
