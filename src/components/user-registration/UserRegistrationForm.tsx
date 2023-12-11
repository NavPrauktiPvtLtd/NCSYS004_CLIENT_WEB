import { useState, useEffect } from "react";
import styles from "../../styles/Details.module.css";
import { TextInput, Group, SegmentedControl } from "@mantine/core";
import { FaChevronRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ServerAPI from "../../../API/ServerAPI";
import { GENDER } from "../../../@types/index.";
import {
  UserFormData,
  userDetailsFormSchema,
  phoneSchema,
} from "../../../validation";

import { useAuthStore } from "@/store/store";
import { DateInput } from "@mantine/dates";
import useClickSound from "@/hooks/useClickSound";
import { PageRoutes } from "../../../@types/index.";
import { useMemberDataStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../../styles/keyboard.css";
import UnauthorizedSvg from "../common/svg/Unauthorized";

const UserRegistrationForm = () => {
  const [gender, setGender] = useState<GENDER>(GENDER.MALE);

  const [dob, setDob] = useState(new Date("01/01/2020"));

  const navigate = useNavigate();

  const { playClickSound } = useClickSound();

  const [keyboardVisibility, setKeyboardVisibility] = useState(false);

  const [keyboardNumberVisibility, setKeyboardNumberVisibility] =
    useState(false);

  const [keyboardInput, setKeyboardInput] = useState("");

  const [inputField, setInputField] = useState<string | null>(null);

  const [layoutName, setLayoutName] = useState("default");

  const [noAccessTokenerror, setNoAccessTokenerror] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userDetailsFormSchema) });

  const Fn = watch("name");

  useEffect(() => {
    console.log({ Fn });
  }, [Fn]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleGenderValue = (value: GENDER) => {
    playClickSound();
    setGender(value as GENDER);
  };

  const { accessToken } = useAuthStore();

  const { setMemberData } = useMemberDataStore();

  const onSubmit = handleSubmit(async (data) => {
    console.log("inside handleSubmit");

    playClickSound();
    console.log({ data });

    if (!accessToken) {
      setNoAccessTokenerror(true);
    } else {
      try {
        const result = await ServerAPI.createUser(accessToken, data);
        setGender(GENDER.MALE);
        setDob(dob);
        console.log({ result });
        setMemberData(result.data.user);
        reset();
        const queryParams = new URLSearchParams();
        queryParams.append("gender", data.gender);
        const nextPagePath = `${
          PageRoutes.AUTH_USER_QUESTIONNAIRE
        }?${queryParams.toString()}`;
        navigate(nextPagePath);

        // navigate(PageRoutes.AUTH_USER_QUESTIONNAIRE);
      } catch (error) {
        console.log(error);
      }
    }
  });

  useEffect(() => {
    setValue("gender", gender);
  }, [gender, setValue]);

  useEffect(() => {
    setValue("dob", dob);
  }, [dob, setValue]);

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (button === "{shift}" || button === "{lock}") handleShift();
    if (button === "{enter}") {
      setKeyboardVisibility(false);
    }
  };

  const handleInputClick = (fieldName: string) => {
    setInputField(fieldName);
    setKeyboardNumberVisibility(false);
    setKeyboardVisibility(true);
  };

  const handleKeyboardChange = (input: string | Date) => {
    setValue(inputField as "gender" | "dob" | "name", input);
  };

  const customDisplay = {
    "{bksp}": "bksp",
    "{space}": "space ",
    "{tab}": "tab",
    "{enter}": "enter",
    "{shift}": "shift",
    "{lock}": "caps",
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setKeyboardInput(newValue);
    setValue("phoneNumber", newValue);
  };

  const handleNumberInputClick = () => {
    setKeyboardVisibility(false);
    setKeyboardNumberVisibility(true);
  };

  const onNumberKeyPress = (button: string) => {
    playClickSound();
    if (button === "{enter}") {
      setKeyboardNumberVisibility(false);
    }
    if (button === "{bksp}") {
      const updatedValue = keyboardInput.slice(0, -1);
      setKeyboardInput(updatedValue);
      setValue("phoneNumber", updatedValue);
    } else if (button === "{enter}") {
      setKeyboardNumberVisibility(false);
    } else {
      const newValue = keyboardInput + button;
      setKeyboardInput(newValue);
      setValue("phoneNumber", newValue);
    }
  };

  return (
    <div>
      {noAccessTokenerror ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "2rem",
          }}
        >
          <h1 style={{ fontSize: "5rem" }}>Access Denied</h1>
          <UnauthorizedSvg />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "80vw" }}>
          <TextInput
            withAsterisk
            label="First Name"
            {...register("name")}
            error={errors?.name?.message}
            fullWidth
            size="xl"
            required
            style={{ marginBottom: "1rem" }}
            onClick={() => handleInputClick("firstName")}
          />

          <SegmentedControl
            style={{ marginBottom: "1rem" }}
            color="red"
            transitionDuration={700}
            fullWidth
            value={gender}
            onChange={handleGenderValue}
            name="gender"
            size="xl"
            data={[
              { label: "Male", value: GENDER.MALE },
              { label: "Female", value: GENDER.FEMALE },
              { label: "Others", value: GENDER.OTHERS },
            ]}
          />
          <DateInput
            value={dob}
            onChange={(value: Date) => {
              if (value) {
                setDob(value);
              }
            }}
            label="Your Date of Birth"
            placeholder="January 12,1980"
            name="dob"
            fullWidth
            size="xl"
            maxDate={new Date()}
            style={{ marginBottom: "1rem" }}
          />
          <TextInput
            withAsterisk
            label="Phone number"
            {...register("phoneNumber")}
            error={errors?.phoneNumber?.message}
            fullWidth
            size="xl"
            style={{ marginBottom: "1rem" }}
            // onClick={() => handleInputClick("phoneNumber")}
            value={keyboardInput}
            onChange={onInputChange}
            onClick={handleNumberInputClick}
          />
          {keyboardNumberVisibility && (
            <div className={styles.keyboardContainer}>
              <Keyboard
                onChange={(input) => setKeyboardInput(input)}
                onKeyPress={onNumberKeyPress}
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
          <Group position="center" mt="md">
            <button type="submit" className={styles.button}>
              Submit
              <span style={{ paddingLeft: "10px" }}>
                <FaChevronRight />
              </span>
            </button>
          </Group>
          {keyboardVisibility && inputField && (
            <div style={{ marginTop: "1rem" }}>
              <Keyboard
                inputName={inputField}
                onChange={handleKeyboardChange}
                onKeyPress={onKeyPress}
                display={customDisplay}
                theme={"hg-theme-default hg-layout-default myTheme"}
                layoutName={layoutName}
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
        </form>
      )}
    </div>
  );
};

export default UserRegistrationForm;
