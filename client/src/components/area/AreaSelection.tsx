import { FaHospitalAlt } from 'react-icons/fa';
import styles from '../../styles/Details.module.css';

type Props = {
  label: string;
  onClick: () => void;
  tooltipText: string;
};

export default function AreaSelection({ label, onClick, tooltipText }: Props) {
  return (
    <div className={styles.selectionBox} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <FaHospitalAlt size={70} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '40px' }}>
        {label}
        <span style={{ fontSize: '20px', marginTop: '10px' }}>({tooltipText})</span>
      </div>
    </div>
  );
}
