import { useEffect, useState } from "react";
import { PasswordInput, TextInput, Button, Group } from "@mantine/core";
import ServerAPI from "../../../API/ServerAPI";
import { useForm } from "react-hook-form";
import {
  SystemAdminLoginData,
  systemAdminLoginSchema,
} from "../../../validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { PageRoutes } from "../../../@types/index.";
import useClickSound from "@/hooks/useClickSound";
import { useKioskSerialNumberStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../../styles/keyboard.css";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const SystemAdminAuthenticate = () => {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const { kioskSerialID } = useKioskSerialNumberStore();

  const [error, setError] = useState(false);

  const [serverError, setServerError] = useState(false);

  const [keyboardVisibility, setKeyboardVisibility] = useState(false);

  const [emailKeyboardInput, setEmailKeyboardInput] = useState("");

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [passwordKeyboardInput, setPasswordKeyboardInput] = useState("");

  const [layoutName, setLayoutName] = useState("default");

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SystemAdminLoginData>({
    resolver: zodResolver(systemAdminLoginSchema),
  });

  const Fn = watch("password");

  useEffect(() => {
    console.log({ Fn });
  }, [Fn]);

  const handleLogin = handleSubmit(async (data) => {
    playClickSound();
    if (!kioskSerialID) {
      setError(true);
    } else {
      setIsLoading(true);
      try {
        const response = await ServerAPI.adminLogin({
          ...data,
          serial_no: kioskSerialID,
        });
        const { accessToken } = response.data;
        console.log(accessToken);
        localStorage.setItem("accessToken", accessToken);
        setIsLoading(false);
        reset();
        navigate(PageRoutes.SYSTEM_ADMIN_HOME);
      } catch (error) {
        setIsLoading(false);
        console.log({ error });
        if (error === 401) {
          setError(true);
        } else if (error === 500) {
          setServerError(true);
        }
      }
    }
  });

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
      return;
    }

    if (focusedInput === "email") {
      if (button === "{bksp}") {
        const updatedValue = emailKeyboardInput.slice(0, -1);
        setEmailKeyboardInput(updatedValue);
        setValue("email", updatedValue);
      } else if (button === "{enter}") {
        setKeyboardVisibility(false);
      } else {
        const newValue = emailKeyboardInput + button;
        setEmailKeyboardInput(newValue);
        setValue("email", newValue);
      }
    } else if (focusedInput === "password") {
      if (button === "{bksp}") {
        const updatedValue = passwordKeyboardInput.slice(0, -1);
        setPasswordKeyboardInput(updatedValue);
        setValue("password", updatedValue);
      } else if (button === "{enter}") {
        setKeyboardVisibility(false);
      } else {
        const newValue = passwordKeyboardInput + button;
        setPasswordKeyboardInput(newValue);
        setValue("password", newValue);
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (focusedInput === "email") {
      const newValue = e.target.value;
      setEmailKeyboardInput(newValue);
      setValue("email", newValue);
    } else {
      const newValue = e.target.value;
      setPasswordKeyboardInput(newValue);
      setValue("password", newValue);
    }
  };

  const handleInputClick = (fieldName: string) => {
    setKeyboardVisibility(true);
    setFocusedInput(fieldName);
  };

  return (
    <div
      style={{
        background: "#F5F5F5",
      }}
    >
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            boxShadow: "1px 2px 88px -1px rgba(224,224,224,1)",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit(handleLogin)} style={{ width: "80vw" }}>
            <h3 style={{ textAlign: "center", textTransform: "uppercase" }}>
              Login
            </h3>
            {error && (
              <p style={{ textAlign: "center", color: "red" }}>
                {" "}
                Email or Password Incorrect
              </p>
            )}
            <TextInput
              label="Email"
              placeholder="Email"
              {...register("email")}
              withAsterisk
              fullWidth
              required
              size="xl"
              value={emailKeyboardInput}
              onChange={onInputChange}
              onClick={() => handleInputClick("email")}
            />
            {keyboardVisibility && focusedInput === "email" && (
              <div>
                <Keyboard
                  onChange={(input) => setEmailKeyboardInput(input)}
                  onKeyPress={onKeyPress}
                  layoutName={layoutName}
                  theme={"hg-theme-default hg-layout-default myTheme"}
                  buttonTheme={[
                    {
                      class: "hg-red",
                      buttons:
                        "1 2 3 4 5 6 7 8 9 0 {shift} {enter} {bksp} {tab} {space} {lock} .com Q W E R T Y U I O P Q W E R T Y U I O P A S D F G H J K L Z X C V B N M q w e r t y u i o p a s d f g h j k l z x c v b n m . - .COM @ $ ( ) ! # % & ' * + / = ? ^ ` { | } ~ [ ] ; , \\ _ : < > ",
                    },
                    {
                      class: "my-double-quote-button",
                      buttons: '"',
                    },
                  ]}
                />
              </div>
            )}
            <PasswordInput
              style={{ marginTop: "10px" }}
              placeholder="Password"
              label="Password"
              {...register("password")}
              withAsterisk
              size="xl"
              required
              value={passwordKeyboardInput}
              onChange={onInputChange}
              onClick={() => handleInputClick("password")}
              visibilityToggleIcon={({ reveal }: { reveal: boolean }) =>
                reveal ? (
                  <IoEyeOutline
                    style={{
                      width: "var(--psi-icon-size)",
                      height: "var(--psi-icon-size)",
                    }}
                  />
                ) : (
                  <IoEyeOffOutline
                    style={{
                      width: "var(--psi-icon-size)",
                      height: "var(--psi-icon-size)",
                    }}
                  />
                )
              }
            />

            {keyboardVisibility && focusedInput === "password" && (
              <div>
                <Keyboard
                  onChange={(input) => setPasswordKeyboardInput(input)}
                  onKeyPress={onKeyPress}
                  layoutName={layoutName}
                  theme={"hg-theme-default hg-layout-default myTheme"}
                  buttonTheme={[
                    {
                      class: "hg-red",
                      buttons:
                        "1 2 3 4 5 6 7 8 9 0 {shift} {enter} {bksp} {tab} {space} {lock} .com Q W E R T Y U I O P Q W E R T Y U I O P A S D F G H J K L Z X C V B N M q w e r t y u i o p a s d f g h j k l z x c v b n m . - .COM @ $ ( ) ! # % & ' * + / = ? ^ ` { | } ~ [ ] ; , \\ _ : < > ",
                    },
                    {
                      class: "my-double-quote-button",
                      buttons: '"',
                    },
                  ]}
                />
              </div>
            )}
            <Group position="center" mt="md">
              <Button type="submit" size="xl" radius="md">
                {isLoading ? (
                  <h2 style={{ textTransform: "uppercase" }}>Please wait </h2>
                ) : (
                  <h2 style={{ textTransform: "uppercase" }}>Submit</h2>
                )}
              </Button>
            </Group>
          </form>
        </div>
        <Button
          radius="md"
          size="xl"
          color="lime"
          style={{ marginTop: "20px" }}
        >
          <a href="/">GO TO HOME</a>
        </Button>
      </div>

      {serverError && (
        <div>
          <p style={{ textAlign: "center", color: "red", fontSize: "2rem" }}>
            Server Error . Please try Again
          </p>
          <Button size="xl" radius="md">
            <a href="/system-admin/login">Click Here</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemAdminAuthenticate;
