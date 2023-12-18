import styles from '../styles/Details.module.css';
import { FormEvent } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import { Button, Group, Loader, SegmentedControl, Textarea } from '@mantine/core';

import { PageRoutes, QuestionnaireAnswers, Questions, QuestionType } from '../../@types/index.';
import useClickSound from '@/hooks/useClickSound';
import ServerAPI from '../../API/ServerAPI';
import { useState, useEffect } from 'react';
import { useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import HomeButton from '@/components/common/HomeButton';
import { useKioskSerialNumberStore } from '@/store/store';
import { useLanguageStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';

export default function Questionnaire() {
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState<Questions[]>([]);

  const [answersList, setAnswersList] = useState<QuestionnaireAnswers[]>([]);

  const { playClickSound } = useClickSound();

  const { memberData } = useMemberDataStore();

  const [answerObj, setAnswerObj] = useState<Record<string, unknown>>({});

  const [loading, setLoading] = useState(false);

  const [keyboardVisibility, setKeyboardVisibility] = useState(false);

  const [inputField, setInputField] = useState('');

  const [layoutName, setLayoutName] = useState('default');

  const { kioskSerialID } = useKioskSerialNumberStore();

  const { selectedLanguage } = useLanguageStore();

  const { sessionID, setSessionId } = useTestSessionStore();

  useEffect(() => {
    setLoading(true);
    if (!memberData) return;
    const getQuestions = async () => {
      try {
        const {
          data: { questions },
        } = await ServerAPI.getQuestionList(kioskSerialID);
        setQuestionList(questions);
        setLoading(false);
        const initialAnswersList = questions.map(q => {
          if (q.questionType === QuestionType.OPTIONS) {
            return {
              questionId: q.id,
              userId: memberData.id,
              answerType: QuestionType.OPTIONS,
              optionIds: q.options,
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
      await ServerAPI.postQuestionnaireAnswers(answersList, kioskSerialID);
      await getSessionId();
      navigate(PageRoutes.AUTH_USER_REGISTRATION_COMPLETE);
    } catch (error) {
      console.log(error);
    }
  };

  const getSessionId = async () => {
    await ServerAPI.endTestSession({
      statsId: sessionID,
    });
  };

  useEffect(() => {
    answersList.forEach(ans => {
      let answer: string | string[] = '';
      if (ans.answerType === QuestionType.OPTIONS) {
        answer = ans.optionId;
      } else {
        answer = ans.string_answer;
      }
      setAnswerObj(prev => {
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

  // const onKeyboardInputChange = (
  //   input: SetStateAction<QuestionnaireAnswers[]>
  // ) => {
  //   setAnswersList(input);
  // };

  return (
    <div className={styles.contents}>
      <div style={{ position: 'absolute', top: '5%', left: '5%' }}>
        <HomeButton />
      </div>
      <h1
        style={{
          fontSize: '3rem',
          textTransform: 'uppercase',
          color: 'rgb(232, 80, 91)',
          fontFamily: 'Montserrat',
        }}
      >
        {selectedLanguage === 'en' ? 'Please select the answers below' : 'অনুগ্ৰহ কৰি তলৰ উত্তৰসমূহ চয়ন কৰক'}
      </h1>
      {loading ? (
        <Loader size="xl" variant="dots" />
      ) : (
        <form onSubmit={onSubmit}>
          {questionList.map(data => {
            if (data.questionType === QuestionType.OPTIONS) {
              return (
                <div key={data.id}>
                  <h2 className={styles.userdetailsheading}>
                    {selectedLanguage === 'en' ? data.question_text_primary : data.question_text_secondary}
                  </h2>
                  <SegmentedControl
                    style={{ marginTop: '1rem' }}
                    fullWidth
                    size="xl"
                    color="red"
                    value={answerObj[data.id]}
                    withScrollArea={false}
                    styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
                    data={data.options.map(option => ({
                      value: option.id,
                      label: selectedLanguage === 'en' ? option.option_val_primary : option.option_val_secondary,
                    }))}
                    defaultValue={data.options[0].id}
                    onChange={(val: string) => {
                      playClickSound();
                      setAnswersList(prev => {
                        const question = prev.find(i => i.questionId === data.id);
                        if (question) {
                          const filteredAnsList = prev.filter(i => i.questionId !== data.id);
                          return [...filteredAnsList, { ...question, optionId: val }];
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
                  <h2 className={styles.userdetailsheading}>
                    {selectedLanguage === 'en' ? data.question_text_primary : data.question_text_secondary}
                  </h2>
                  <Textarea
                    placeholder="Any Suggestion"
                    withAsterisk
                    size="xl"
                    // onFocus={() => {
                    //   setKeyboardVisibility(true);
                    // }}
                    onChange={(val: { currentTarget: { value: string } }) => {
                      setAnswersList(prev => {
                        const question = prev.find(i => i.questionId === data.id);
                        if (question) {
                          console.log({ question });
                          const filteredAnsList = prev.filter(i => i.questionId !== data.id);
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
          <Group position="center" style={{ marginTop: '2rem' }}>
            <Button size="xl" uppercase type="submit" color="red" radius="md">
              Submit
            </Button>
          </Group>
        </form>
      )}
    </div>
  );
}
