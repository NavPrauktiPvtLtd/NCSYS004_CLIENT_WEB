import { Howl } from "howler";
import { useAudioStore } from "@/store/store";

const buttonClickSound = new Howl({
  src: ["/sounds/click-sound.mp3"],
});

const useClickSound = () => {
  const { isOn } = useAudioStore();

  const playClickSound = () => {
    if (!isOn) return;
    buttonClickSound.play();
  };

  return { playClickSound };
};

export default useClickSound;
