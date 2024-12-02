import styles from '../styles/Details.module.css';
import 'react-simple-keyboard/build/css/index.css';
import { Button, Group } from '@mantine/core';
import { PageRoutes, QuestionnaireAnswers, Questions, QuestionType } from '../../@types/index.';
import useClickSound from '@/hooks/useClickSound';
import ServerAPI from '../../API/ServerAPI';
import { useState, useEffect, FormEvent } from 'react';
import { useAuthStore, useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
// import HomeButton from '@/components/common/HomeButton';
import { useKioskSerialNumberStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';
import { toast, Toaster } from 'react-hot-toast';
import Header from '@/components/common/Header';
import RadioGroupRating from '@/components/common/Ratings';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const QUESTIONS_PER_PAGE = 3;

function convertToAssameseNumber(number: number) {
  const assameseDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return number
    .toString()
    .split('')
    .map(digit => assameseDigits[parseInt(digit, 10)])
    .join('');
}

export default function Questionnaire() {
  const navigate = useNavigate();

  const { language } = useAuthStore();

  const [questionList, setQuestionList] = useState<Questions[]>([]);

  const [currentPage, setCurrentPage] = useState(0);

  const { playClickSound } = useClickSound();

  const { memberData } = useMemberDataStore();

  const [answerObj, setAnswerObj] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);

  const { kioskSerialID } = useKioskSerialNumberStore();

  const { sessionID } = useTestSessionStore();

  const { selectedArea } = useAuthStore();

  // useEffect(() => {
  //   console.log({ answerObj });
  // }, [answerObj]);

  useEffect(() => {
    setLoading(true);
    if (!memberData) {
      toast.error('Member not available. Please register');
      navigate(PageRoutes.HOME);
    } else {
      const getQuestions = async () => {
        try {
          console.log({ selectedArea });
          console.log({ kioskSerialID });
          if (selectedArea) {
            const {
              data: { questions },
            } = await ServerAPI.getQuestionList(kioskSerialID, selectedArea);
            console.log({ questions });
            setQuestionList(questions);

            // Initialize answerObj with default value of 1 for each question
            // const defaultAnswers = questions.reduce((acc: { [key: string]: string }, question: Questions) => {
            //   acc[question.id] = '1';
            //   return acc;
            // }, {});
            // setAnswerObj(defaultAnswers);

            setLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getQuestions();
    }
  }, [memberData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRatingChange = (id: any, value: any) => {
    setAnswerObj(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();
    if (!memberData) {
      toast.error('Member not available. Please register');
      navigate(PageRoutes.HOME);
    } else {
      const answersList: QuestionnaireAnswers[] = questionList.map(question => ({
        questionId: question.id,
        userId: memberData?.id,
        answerType: QuestionType.Rating,
        rating_answer: parseInt(answerObj[question.id], 10),
      }));
      console.log({ answersList });
      try {
        // Validate if all questions have been answered
        const unansweredQuestions = questionList
          .map((question, index) => ({
            index: index + 1,
            questionId: question.id,
          }))
          .filter(question => !answerObj[question.questionId]);

        const length = unansweredQuestions.length;

        if (length > 0) {
          const unansweredQuestionNumbers = unansweredQuestions.map(question => question.index).join(', ');
          toast.error(
            `${length > 1 ? 'Questions' : 'Question'} ${unansweredQuestionNumbers} ${
              length > 1 ? 'are' : 'is'
            } not answered`
          );
          return;
        }

        await ServerAPI.postQuestionnaireAnswers(answersList, kioskSerialID);
        await getSessionId();
        navigate(PageRoutes.AUTH_USER_REGISTRATION_COMPLETE);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getSessionId = async () => {
    await ServerAPI.endTestSession({
      statsId: sessionID,
    });
  };

  const handleNextPage = () => {
    playClickSound();
    if ((currentPage + 1) * QUESTIONS_PER_PAGE < questionList.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    playClickSound();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const endIdx = startIdx + QUESTIONS_PER_PAGE;
  const currentQuestions = questionList.slice(startIdx, endIdx);

  return (
    <div style={{ height: '100%' }}>
      <Header />
      <div className={styles.contents}>
        {loading ? (
          <div className=" flex items-center gap-1">
            <p
              style={{
                fontSize: '3rem',
                textTransform: 'uppercase',
                color: 'rgb(232, 80, 91)',
                fontFamily: 'Montserrat',
              }}
            >
              {language === 'English' ? 'Loading Questions ...' : 'প্ৰশ্নবোৰ লোড হৈ আছে ...'}
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: '2.5rem',
                color: 'rgb(232, 80, 91)',
                fontFamily: 'cursive',
                fontWeight: 500,
                marginBottom: 25,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {language === 'English' ? 'Please select the answer below' : 'অনুগ্ৰহ কৰি তলৰ উত্তৰটো বাছি লওক'}
            </div>
            <form
              onSubmit={onSubmit}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  flexDirection: 'column',
                  height: 520,
                }}
              >
                {currentQuestions.map((data, index) => (
                  <div
                    key={data.id}
                    style={{
                      width: '85%',
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <h2 className={styles.userQuestionHeading}>
                      <span style={{ color: 'rgb(100, 50, 50)', marginRight: 10 }}>
                        {language === 'English'
                          ? startIdx + index + 1 + '.'
                          : `${convertToAssameseNumber(startIdx + index + 1)}.`}
                      </span>
                      {language === 'English' ? data.question_text_primary : data.question_text_secondary}
                    </h2>
                    <RadioGroupRating
                      value={answerObj[data.id]}
                      onChange={(val: string) => {
                        playClickSound();
                        handleRatingChange(data.id, val);
                      }}
                    />
                  </div>
                ))}
              </div>
              <Group
                position="center"
                style={{
                  marginTop: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  width: '85%',
                }}
              >
                <div style={{ display: 'flex', width: '30%' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '35%' }}>
                  {endIdx >= questionList.length && (
                    <Button size="xl" uppercase type="submit" color="red" radius="md">
                      {language === 'English' ? 'Submit' : 'দাখিল কৰক'}
                    </Button>
                  )}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '20px', width: '30%' }}
                >
                  <Button
                    size="md"
                    onClick={handlePreviousPage}
                    color="red"
                    radius="md"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    disabled={currentPage <= 0}
                  >
                    <FaAngleLeft /> {language === 'English' ? 'Prev' : 'পূৰ্বৱৰ্তী'}
                  </Button>
                  <Button
                    size="md"
                    onClick={handleNextPage}
                    color="red"
                    radius="md"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    disabled={endIdx >= questionList.length}
                  >
                    {language === 'English' ? 'Next' : 'পৰৱৰ্তী'} <FaAngleRight />
                  </Button>
                </div>
              </Group>
            </form>
          </>
        )}
        <Toaster />
      </div>
    </div>
  );
}
