import { PageRoutes } from "../../../@types/index.";
import { useNavigate } from "react-router-dom";
import useClickSound from "@/hooks/useClickSound";
import { Tooltip } from "@mantine/core";
import { FaHome } from "react-icons/fa";

const HomeButton = () => {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const navigateToHome = () => {
    playClickSound();
    navigate(PageRoutes.HOME);
  };

  return (
    <div>
      <Tooltip label="Home">
        <button
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            border: "none",
            background: "transparent",
          }}
          onClick={navigateToHome}
        >
          <FaHome
            style={{
              color: "#007bff",
              cursor: "pointer",
              width: "60px",
            }}
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default HomeButton;
