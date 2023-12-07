import styles from "../../styles/Details.module.css";
import { FormEvent } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import {
  Button,
  SegmentedControl,
  Group,
  Loader,
  TextInput,
  MultiSelect,
} from "@mantine/core";

import {
  PageRoutes,
  QuestionnaireAnswers,
  Questions,
  QuestionType,
} from "../../../@types/index.";
import useClickSound from "@/hooks/useClickSound";
import ServerAPI from "../../../API/ServerAPI";
import { useState, useEffect } from "react";
import { useMemberDataStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import HomeButton from "@/components/common/HomeButton";

export default function Questionnaire() {
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState<Questions[]>([]);

  const [answersList, setAnswersList] = useState<QuestionnaireAnswers[]>([]);

  const { playClickSound } = useClickSound();

  const { memberData } = useMemberDataStore();

  const [answerObj, setAnswerObj] = useState<Record<string, unknown>>({});

  const [loading, setLoading] = useState(false);

  const [keyboardVisibility, setKeyboardVisibility] = useState(false);

  const [inputField, setInputField] = useState("");

  const [layoutName, setLayoutName] = useState("default");

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const gender = searchParams.get("gender");

  console.log({ gender });

  useEffect(() => {
    setLoading(true);
    if (!memberData) return;
    const getQuestions = async () => {
      try {
        const {
          data: { questions },
        } = await ServerAPI.getQuestionList();
        setQuestionList(questions);
        setLoading(false);
        const initialAnswersList = questions.map((q) => {
          if (q.questionType === QuestionType.OPTIONS) {
            return {
              questionId: q.id,
              userId: memberData.id,
              answerType: QuestionType.OPTIONS,
              optionIds: q.options[0].id,
            };
          } else {
            return {
              questionId: q.id,
              userId: memberData.id,
              answerType: QuestionType.STRING,
              string_answer: q.questionType,
            };
          }
        }) as QuestionnaireAnswers[];

        setAnswersList(initialAnswersList);
        console.log(questions);
      } catch (error) {
        console.log(error);
      }
    };
    getQuestions();
  }, [memberData]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();
    if (!memberData) return;
    try {
      await ServerAPI.postQuestionnaireAnswers(answersList);
      console.log("filteredanswersList", answersList);

      navigate(PageRoutes.AUTH_USER_REGISTRATION_COMPLETE);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log({ answersList });
    answersList.forEach((ans) => {
      let answer: string | string[] = "";
      if (ans.answerType === QuestionType.OPTIONS) {
        answer = ans.optionIds;
      } else {
        answer = ans.string_answer;
      }
      setAnswerObj((prev) => {
        return {
          ...prev,
          [ans.questionId]: answer,
        };
      });
    });
  }, [answersList]);

  // const handleShift = () => {
  //   const newLayoutName = layoutName === "default" ? "shift" : "default";
  //   setLayoutName(newLayoutName);
  // };

  // const onKeyPress = (button: string) => {
  //   playClickSound();
  //   if (button === "{shift}" || button === "{lock}") {
  //     handleShift();
  //     return;
  //   }
  //   if (button === "{enter}") {
  //     setKeyboardVisibility(false);
  //   }
  // };

  // const onKeyboardInputChange = (input: string) => {
  //   setAnswersList(input);
  // };

  return (
    <div className={styles.contents}>
      <div style={{ position: "absolute", top: "5%", left: "5%" }}>
        <HomeButton />
      </div>
      <div className={styles.imagecontainer} style={{ width: "400px" }}>
        <img src="/images/logo.png" alt="object" className={styles.img} />
      </div>
      <h1 style={{ fontSize: "3rem", textTransform: "uppercase" }}>
        Please select the answers below
      </h1>
      {loading ? (
        <Loader size="xl" variant="dots" />
      ) : (
        <form onSubmit={onSubmit}>
          {questionList.map((data) => {
            if (data.questionType === QuestionType.OPTIONS) {
              return (
                <div key={data.id}>
                  <h2 className={styles.userdetailsheading}>{data.question}</h2>
                  <MultiSelect
                    style={{ marginTop: "1rem" }}
                    placeholder="Pick value"
                    size="xl"
                    color="#0d879a"
                    value={answerObj[data.id]}
                    withScrollArea={false}
                    styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
                    data={data.options.map((option) => ({
                      value: option.id,
                      label: option.optionVal,
                    }))}
                    onChange={(val: [""]) => {
                      playClickSound();
                      console.log({ val });

                      setAnswersList((prev) => {
                        const question = prev.find(
                          (i) => i.questionId === data.id
                        );
                        if (question) {
                          console.log({ question });

                          const filteredAnsList = prev.filter(
                            (i) => i.questionId !== data.id
                          );
                          return [
                            ...filteredAnsList,
                            { ...question, optionIds: val },
                          ];
                        }
                        return prev;
                      });
                    }}
                  />
                </div>
              );
            } else {
              return (
                <div key={data.id}>
                  <h2 className={styles.userdetailsheading}>{data.question}</h2>
                  <TextInput
                    placeholder="Any Queries"
                    withAsterisk
                    size="xl"
                    // onFocus={() => {
                    //   setKeyboardVisibility(true);
                    // }}
                    onChange={(val: { currentTarget: { value: string } }) => {
                      setAnswersList((prev) => {
                        const question = prev.find(
                          (i) => i.questionId === data.id
                        );
                        if (question) {
                          console.log({ question });
                          const filteredAnsList = prev.filter(
                            (i) => i.questionId !== data.id
                          );
                          return [
                            ...filteredAnsList,
                            {
                              ...question,
                              string_answer: val.currentTarget.value,
                            },
                          ];
                        }
                        return prev;
                      });
                    }}
                  />
                  {/* {keyboardVisibility && (
                    <div
                      className={styles.keyboardContainer}
                      style={{ marginTop: "10px" }}
                    >
                      <Keyboard
                        onChange={onKeyboardInputChange}
                        onKeyPress={onKeyPress}
                        layoutName={layoutName}
                        theme={"hg-theme-default hg-layout-default myTheme"}
                        buttonTheme={[
                          {
                            class: "hg-red",
                            buttons:
                              "1 2 3 4 5 6 7 8 9 0 {bksp} $ ( ) _ < > :  {tab} Q W E R T Y U I O P A S D F G H J K L ! # % & Z X C V B N M q w e r t y u i o p a s d f g h j k l z x c v b n m .com {shift} {enter} {lock} ; , [ ]  . ' * + /  = .COM @ {space} - ? ^ ` { | } ~ ",
                          },
                        ]}
                      />
                    </div>
                  )} */}
                </div>
              );
            }
          })}
          <Group position="center" style={{ marginTop: "2rem" }}>
            <Button size="xl" uppercase type="submit">
              Submit
            </Button>
          </Group>
        </form>
      )}
    </div>
  );
}
