import { useAudioStore } from '@/store/store';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import styles from '../../styles/Ecgsteps.module.css';
import HomeButton from './HomeButton';

const SpeakerIcon = () => {
  const { isOn, setIsOn } = useAudioStore();

  const toggleIsOn = () => setIsOn(!isOn);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <HomeButton />
      <div className={styles.divspeakericon} onClick={toggleIsOn}>
        {isOn ? <GiSpeaker className={styles.iconspeaker} /> : <GiSpeakerOff className={styles.iconspeaker} />}
      </div>
    </div>
  );
};

export default SpeakerIcon;
