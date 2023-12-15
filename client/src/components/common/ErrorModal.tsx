import { Modal, useMantineTheme } from "@mantine/core";

import ErrorSvg from "../common/svg/Error";

interface ErrorModalProps {
  opened: boolean;
  close: () => void;
}

const ErrorModal = ({ opened, close }: ErrorModalProps) => {
  const theme = useMantineTheme();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        centered
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>SOMETHING WENT WRONG</div>
          <div style={{ fontSize: "2rem" }}>PLEASE TRY AGAIN</div>

          <ErrorSvg />
        </div>
      </Modal>
    </>
  );
};

export default ErrorModal;
