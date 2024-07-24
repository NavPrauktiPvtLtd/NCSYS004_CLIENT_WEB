// import HomeButton from '@/components/common/HomeButton';
import styles from '../styles/Details.module.css';
import UserRegistrationForm from '@/components/user-registration/UserRegistrationForm';
import Header from '@/components/common/Header';

export default function UserDetails() {
  return (
    <>
      <Header />
      <div className={styles.contents}>
        {/* <div className={styles.imageContainer2} style={{ height: 200, width: 300 }}>
          <img src="/images/detailspage.png" alt="object" className={styles.image2} />
        </div> */}
        <div className={styles.userdetailsheading}>Enter Your Details</div>
        <UserRegistrationForm />
      </div>
    </>
  );
}
