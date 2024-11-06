import styles from '../styles/Details.module.css';
import UserRegistrationForm from '@/components/user-registration/UserRegistrationForm';
import Header from '@/components/common/Header';
import { useAuthStore } from '@/store/store';
import AreaSelection from '@/components/area/AreaSelection';

export default function UserDetails() {
  const { selectedArea, setSelectedArea } = useAuthStore();

  return (
    <div style={{ height: '100%' }}>
      <Header setSelectedArea={setSelectedArea} />
      <div className={styles.contents}>
        {!selectedArea ? (
          <>
            <div className={styles.userdetailsheading}>Select Area</div>
            <div className={styles.selectionContainer}>
              <AreaSelection label="OPD" onClick={() => setSelectedArea('OPD')} tooltipText="Outpatient Department" />
              <AreaSelection label="IPD" onClick={() => setSelectedArea('IPD')} tooltipText="Inpatient Department" />
            </div>
          </>
        ) : (
          <>
            <div className={styles.userdetailsheading}>Enter Your Details</div>
            <UserRegistrationForm />
          </>
        )}
      </div>
    </div>
  );
}
