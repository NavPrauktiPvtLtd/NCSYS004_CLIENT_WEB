import styles from '../styles/Details.module.css';
import UserRegistrationForm from '@/components/user-registration/UserRegistrationForm';
import Header from '@/components/common/Header';

export default function UserDetails() {
  return (
    <div style={{ height: '100%' }}>
      <Header />
      <div className={styles.contents}>
        <div className={styles.userdetailsheading}>Enter Your Details</div>
        <UserRegistrationForm />
      </div>
    </div>
  );
}
