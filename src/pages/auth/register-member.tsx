import styles from "../../styles/Details.module.css";
import UserRegistrationForm from "@/components/user-registration/UserRegistrationForm";
import HomeButton from "@/components/common/HomeButton";

export default function UserDetails() {
  return (
    <div className={styles.contents}>
      <div style={{ position: "absolute", top: "5%", left: "5%" }}>
        <HomeButton />
      </div>
      <div className={styles.imagecontainer} style={{ width: "400px" }}>
        <img src="/images/logo.png" alt="object" className={styles.img} />
      </div>
      <div className={styles.imageContainer2}>
        <img
          src="/images/detailspage.png"
          alt="object"
          className={styles.image2}
        />
      </div>
      <div className={styles.userdetailsheading}>Enter Your Details</div>
      <UserRegistrationForm />
    </div>
  );
}
