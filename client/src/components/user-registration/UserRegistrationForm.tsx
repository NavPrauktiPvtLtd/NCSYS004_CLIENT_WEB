import { useState, useEffect } from "react";
import styles from "../../styles/Details.module.css";
import { TextInput, Group, SegmentedControl } from "@mantine/core";
import { FaChevronRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ServerAPI from "../../../API/ServerAPI";
import { GENDER } from "../../../@types/index.";
import { UserFormData, userDetailsFormSchema } from "../../../validation";
import { DateInput } from "@mantine/dates";
import useClickSound from "@/hooks/useClickSound";
import { PageRoutes } from "../../../@types/index.";
import { useMemberDataStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../../styles/keyboard.css";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/store";
import asLayout from "simple-keyboard-layouts/build/layouts/assamese";
import { useKioskIdStore } from "@/store/store";
import { useTestSessionStore } from "@/store/store";

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

  const { t } = useTranslation();
  const { selectedLanguage } = useLanguageStore();
  const { kioskId } = useKioskIdStore();
  const { setSessionId } = useTestSessionStore();

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userDetailsFormSchema) });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleGenderValue = (value: GENDER) => {
    playClickSound();
    setGender(value as GENDER);
  };

  const { setMemberData, memberData } = useMemberDataStore();

  const onSubmit = async (data: unknown) => {
    playClickSound();
    console.log({ memberData });

    // if (!memberData) return;
    try {
      const result = await ServerAPI.createUser(data);
      setGender(GENDER.MALE);
      setDob(dob);
      console.log({ result });
      setMemberData(result.data.user);

      // const sessionData = await ServerAPI.startTestSession({
      //   userId: memberData?.id ?? null,
      //   kioskId: kioskId,
      // });
      // const id = await setSessionIdFn();
      // setSessionId(id.id);

      navigate(PageRoutes.AUTH_USER_QUESTIONNAIRE);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const setSessionIdFn = async () => {
    if (!memberData) return;
    const sessionData = await ServerAPI.startTestSession({
      userId: memberData.id,
      kioskId: kioskId,
    });
    setSessionId(sessionData.id);
  };

  useEffect(() => {
    setSessionIdFn();
  }, [memberData?.id]);

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

  useEffect(() => {
    console.log({ selectedLanguage });
  }, [selectedLanguage]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "80vw" }}>
        <TextInput
          withAsterisk
          autoComplete="off"
          label={t("name")}
          {...register("name")}
          error={errors?.name?.message}
          fullWidth
          size="xl"
          required
          style={{ marginBottom: "1rem" }}
          onClick={() => handleInputClick("name")}
        />

        <SegmentedControl
          label={t("gender")}
          style={{ marginBottom: "1rem" }}
          color="red"
          transitionDuration={700}
          fullWidth
          value={gender}
          onChange={handleGenderValue}
          name="gender"
          size="xl"
          data={[
            { label: t("male"), value: GENDER.MALE },
            { label: t("female"), value: GENDER.FEMALE },
            { label: t("others"), value: GENDER.OTHERS },
          ]}
        />
        <DateInput
          value={dob}
          onChange={(value: Date) => {
            if (value) {
              setDob(value);
            }
          }}
          label={t("dob")}
          placeholder="January 12,1980"
          name="dob"
          fullWidth
          size="xl"
          maxDate={new Date()}
          style={{ marginBottom: "1rem" }}
        />
        <TextInput
          withAsterisk
          autoComplete="off"
          label={t("phone")}
          {...register("phoneNumber")}
          error={errors?.phoneNumber?.message}
          fullWidth
          size="xl"
          style={{ marginBottom: "1rem" }}
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
            {selectedLanguage === "as" ? (
              <Keyboard
                inputName={inputField}
                onChange={handleKeyboardChange}
                onKeyPress={onKeyPress}
                display={customDisplay}
                theme={"hg-theme-default hg-layout-default myTheme"}
                layoutName={layoutName}
                {...asLayout}
                buttonTheme={[
                  {
                    class: "hg-red",
                    buttons:
                      "১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ১ ০ {shift} {enter} {bksp} {tab} {space} .com ঃ ।  ৌ  ৈ া  ী  ূ  ৃ  ঁ  ং  ় ুুুুুুুু  ॥  ে  ্  ি    ু  ০ য় ো অ আ ই ঈ উ ঊ ঋ ৠ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য ৰ ল ৱ শ ষ স হ ক্ষ ণ্ট ণ্ঠ ণ্ড ণ্ঢ ণ্ণ য় ৰ ল় . -  @ $ ( ) ! # % ' * + / = ? ^ ` { | } ~ [ ] ; , \\ _ : < > ",
                  },

                  {
                    class: "my-double-quote-button",
                    buttons: '"',
                  },
                ]}
              />
            ) : (
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
                  // {
                  //   class: "hg-red",
                  //   buttons: selectedLanguage
                  //     ? keyboardLayouts[selectedLanguage][layoutName]
                  //     : "",
                  // },

                  {
                    class: "my-double-quote-button",
                    buttons: '"',
                  },
                ]}
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserRegistrationForm;
