import styles from '../styles/Details.module.css';
import UserRegistrationForm from '@/components/user-registration/UserRegistrationForm';
import HomeButton from '@/components/common/HomeButton';

export default function UserDetails() {
  return (
    <div className={styles.contents}>
      <div style={{ position: 'fixed', top: '5%', left: '5%' }}>
        {/* <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end', // Align to the right
          alignItems: 'center', // Center vertically
          padding: '10px', // Optional: add some padding
        }}
      > */}
        <HomeButton />
      </div>
      <div className={styles.imageContainer2}>
        <img src="/images/detailspage.png" alt="object" className={styles.image2} />
      </div>
      <div className={styles.userdetailsheading}>Enter Your Details</div>
      <UserRegistrationForm />
    </div>
  );
}
