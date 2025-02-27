import { PageRoutes } from '../../../@types/index.';
import { useNavigate } from 'react-router-dom';
import useClickSound from '@/hooks/useClickSound';
import { Tooltip } from '@mantine/core';
import { FaHome } from 'react-icons/fa';
import { useAuthStore } from '@/store/store';

const HomeButton = () => {
  const { setSelectedArea } = useAuthStore();

  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const navigateToHome = () => {
    playClickSound();
    setSelectedArea(undefined);
    navigate(PageRoutes.HOME);
  };

  return (
    <div>
      <Tooltip label="Home">
        <button
          style={{
            fontSize: '2rem',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
          }}
          onClick={navigateToHome}
        >
          <FaHome
            style={{
              color: 'rgb(232, 80, 91)',
              cursor: 'pointer',
              width: '60px',
            }}
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default HomeButton;
