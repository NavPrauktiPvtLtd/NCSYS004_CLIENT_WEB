import styles from '../styles/Details.module.css';
import UserRegistrationForm from '@/components/user-registration/UserRegistrationForm';
import Header from '@/components/common/Header';
import { useAuthStore } from '@/store/store';
import AreaSelection from '@/components/area/AreaSelection';

export default function UserDetails() {
  const { selectedArea, setSelectedArea, language } = useAuthStore();

  return (
    <div style={{ height: '100%' }}>
      <Header />
      <div className={styles.contents}>
        {!selectedArea ? (
          <>
            <div className={styles.userdetailsheading}>
              {language === 'English' ? 'Select Area' : 'বিভাগ নিৰ্বাচন কৰক'}
            </div>
            <div className={styles.selectionContainer}>
              <AreaSelection
                label="OPD"
                onClick={() => setSelectedArea('OPD')}
                tooltipText={language === 'English' ? 'Outpatient Department' : 'বহিঃৰোগী বিভাগ'}
              />
              <AreaSelection
                label="IPD"
                onClick={() => setSelectedArea('IPD')}
                tooltipText={language === 'English' ? 'Inpatient Department' : 'আন্তঃৰোগী বিভাগ'}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.userdetailsheading}>
              {language === 'English' ? 'Enter Your Details' : 'আপোনাৰ সবিশেষ লিখক'}
            </div>
            <UserRegistrationForm />
          </>
        )}
      </div>
    </div>
  );
}
