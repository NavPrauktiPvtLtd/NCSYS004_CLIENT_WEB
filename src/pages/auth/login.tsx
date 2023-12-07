import styles from "../../styles/Formphone.module.css";

import { TextInput, Group, Modal } from "@mantine/core";
import { useForm } from "react-hook-form";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import { PhoneFormData, phoneSchema } from "../../../validation";
import { zodResolver } from "@hookform/resolvers/zod";
import ServerAPI from "../../../API/ServerAPI";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "@/store/store";
import { BiError } from "react-icons/bi";
import useClickSound from "@/hooks/useClickSound";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { PageRoutes } from "../../../@types/index.";
import { useNavigate } from "react-router-dom";
import "../../styles/keyboard.css";
import HomeButton from "@/components/common/HomeButton";

export default function Phone() {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
    setValue,
  } = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });

  const { playClickSound } = useClickSound();

  const [otpToken, setOtpToken] = useState<string | null>(null);

  const [enteredOtp, setEnteredOtp] = useState("");

  const [error, setError] = useState(false);

  const [resendOtpCount, setResendOtpCount] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const [otpResendTimer, setOtpResendTimer] = useState(3);

  const [start, setStart] = useState(false);

  const [disableButton, setDisableButton] = useState(true);

  const [otpReqloading, setOtpReqLoading] = useState(false);

  const [keyboardInput, setKeyboardInput] = useState("");

  const [keyboardVisibility, setKeyboardVisibility] = useState(false);

  const [otpKeyboardVisibility, setOtpKeyboardVisibility] = useState(false);

  const [phone, setPhone] = useState<string | null>(null);

  const navigate = useNavigate();

  const { setToken } = useAuthStore();

  const onPhoneNoSubmit = handleSubmit(async (data) => {
    playClickSound();
    try {
      setPhone(data.phoneNumber);
      setOtpReqLoading(true);
      const response = await ServerAPI.requestOTP(data);
      const { token } = response.data;
      setKeyboardVisibility(false);
      setOtpReqLoading(false);
      setOtpToken(token);
      setStart(true);
      open();
      reset();
    } catch (error) {
      setOtpReqLoading(false);
      setFormError("phoneNumber", { message: "Please Try Again" });
      console.error(error);
    }
  });

  const CountResend = () => {
    setResendOtpCount(resendOtpCount + 1);
  };

  const onOtpSubmit = async () => {
    playClickSound();

    try {
      if (!otpToken) return;
      localStorage.removeItem("accessToken");

      const response = await ServerAPI.verifyOTP({
        otp: enteredOtp,
        token: otpToken,
      });
      localStorage.setItem("accessToken", response.data.accessToken);

      setToken(response.data.accessToken);

      setDisableButton(false);
      setDisableButton(false);
      navigate(PageRoutes.AUTH_USER_SELECT_MEMBER);
      close();
    } catch (error) {
      setError(true);
      setErrorMessage(
        "The OTP you have entered is incorrect, please try again"
      );
      console.error(error);
    }
  };

  useEffect(() => {
    if (otpResendTimer === 0) {
      setDisableButton(false);
    }
  }, [otpResendTimer]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (otpResendTimer === 0) return;
    if (start) {
      intervalId = setInterval(() => {
        setOtpResendTimer((prev) => {
          if (prev === 0) {
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [start]);

  const resendOtpButton = async (event: { preventDefault: () => void }) => {
    playClickSound();
    setDisableButton(true);
    event.preventDefault();
    try {
      if (!phone) return;
      const response = await ServerAPI.requestOTP({ phoneNumber: phone });
      const { token } = response.data;
      setOtpToken(token);
      setDisableButton(false);
      CountResend();
    } catch (error) {
      setDisableButton(false);
    }
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (button === "{bksp}") {
      const updatedValue = keyboardInput.slice(0, -1);
      setKeyboardInput(updatedValue);
      setValue("phoneNumber", updatedValue);
    } else if (button === "{enter}") {
      setKeyboardVisibility(false);
    } else {
      const newValue = keyboardInput + button;
      setKeyboardInput(newValue);
      setValue("phoneNumber", newValue);
    }
  };

  useEffect(() => {
    console.log({ enteredOtp });
  }, [enteredOtp]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue("phoneNumber", newValue);
  };

  const handleInputClick = () => {
    setKeyboardVisibility(true);
  };

  const onOtpChange = useCallback(
    (input: SetStateAction<string>) => {
      setEnteredOtp(input);
    },
    [enteredOtp]
  );

  const onOtpKeyPress = (button: string) => {
    playClickSound();
    if (button === "{enter}") {
      setOtpKeyboardVisibility(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    console.log(`handleOtpChange: ${input}`);
    setEnteredOtp(input);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <div style={{ position: "absolute", top: "5%", left: "5%" }}>
          <HomeButton />
        </div>
        <div className={styles.imagecontainer}>
          <img src="/images/logo.png" alt="object" className={styles.img} />
        </div>
        <div className={styles.imageContainer2}>
          <img src="/images/phone.png" alt="object" className={styles.image2} />
        </div>
        <div className={styles.inputnumberlabel}>Enter your phone number</div>
        <div style={{ marginTop: "20px" }}>
          <form
            onSubmit={handleSubmit(onPhoneNoSubmit)}
            style={{ width: "80vw" }}
          >
            <TextInput
              withAsterisk
              label="Phone number"
              {...register("phoneNumber")}
              error={errors?.phoneNumber?.message}
              size="xl"
              required
              value={keyboardInput}
              onChange={onInputChange}
              onClick={handleInputClick}
            />

            <Group position="center" mt="md">
              <button
                type="submit"
                className={styles.phonepagebutton}
                onClick={playClickSound}
                disabled={otpReqloading}
                style={{
                  opacity: otpReqloading ? "0.1" : 1,
                  cursor: otpReqloading ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </button>
            </Group>
            {keyboardVisibility && (
              <div className={styles.keyboardContainer}>
                <Keyboard
                  onChange={(input) => setKeyboardInput(input)}
                  onKeyPress={onKeyPress}
                  layout={{
                    default: ["1 2 3", "4 5 6", "7 8 9", "0", "{bksp} {enter}"],
                  }}
                  theme={"hg-theme-default hg-layout-default myTheme"}
                  buttonTheme={[
                    {
                      class: "hg-red",
                      buttons: "1 2 3 4 5 6 7 8 9 0 {bksp} {enter}",
                    },
                  ]}
                />
              </div>
            )}
            {!otpReqloading && (
              <Modal
                closeOnClickOutside={false}
                size="xl"
                opened={opened}
                onClose={() => {
                  setEnteredOtp("");
                  setResendOtpCount(0);
                  setError(false);
                  setErrorMessage("");
                  close();
                }}
                centered
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h1>Please enter the OTP</h1>
                  <Group position="center">
                    <TextInput
                      size="xl"
                      required
                      value={enteredOtp}
                      onChange={handleOtpChange}
                      onFocus={() => {
                        setOtpKeyboardVisibility(true);
                      }}
                    />
                  </Group>

                  {resendOtpCount >= 3 ? (
                    <div
                      style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: "1rem",
                        paddingTop: "5px",
                      }}
                    >
                      You have exceeded maximum re-attempt{" "}
                    </div>
                  ) : (
                    <div style={{ paddingTop: "10px", textAlign: "center" }}>
                      <button
                        className={styles.resendbutton}
                        onClick={resendOtpButton}
                        disabled={disableButton}
                        style={{
                          opacity: disableButton ? "0.1" : 1,
                          cursor: disableButton ? "not-allowed" : "pointer",
                        }}
                      >
                        Resend OTP
                      </button>{" "}
                    </div>
                  )}

                  {error && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "1rem",
                        width: "fitContent",
                        padding: "10px",
                        borderRadius: "2px solid red",
                        textAlign: "center",
                      }}
                    >
                      <div>
                        <BiError />
                        {errorMessage}
                      </div>
                    </div>
                  )}
                  <Group position="center" mt="md">
                    <button
                      type="submit"
                      onClick={onOtpSubmit}
                      className={styles.phonepagebutton}
                      disabled={enteredOtp.length !== 6 ? true : false}
                      style={{
                        opacity: enteredOtp.length !== 6 ? "0.1" : 1,
                        cursor:
                          enteredOtp.length !== 6 ? "not-allowed" : "pointer",
                      }}
                    >
                      Submit
                    </button>
                  </Group>
                  {otpKeyboardVisibility && (
                    <div style={{ marginTop: "1rem" }}>
                      <Keyboard
                        onChange={onOtpChange}
                        onKeyPress={onOtpKeyPress}
                        maxLength="6"
                        layout={{
                          default: [
                            "1 2 3",
                            "4 5 6",
                            "7 8 9",
                            "0",
                            "{bksp} {enter}",
                          ],
                        }}
                        theme={"hg-theme-default hg-layout-default myTheme"}
                        buttonTheme={[
                          {
                            class: "hg-red",
                            buttons: "1 2 3 4 5 6 7 8 9 0 {bksp} {enter}",
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
