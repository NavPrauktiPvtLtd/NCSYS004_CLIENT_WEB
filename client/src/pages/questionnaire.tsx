import styles from '../styles/Details.module.css';
import 'react-simple-keyboard/build/css/index.css';
import { Button, Group, SegmentedControl } from '@mantine/core';
import { PageRoutes, QuestionnaireAnswers, Questions, QuestionType } from '../../@types/index.';
import useClickSound from '@/hooks/useClickSound';
import ServerAPI from '../../API/ServerAPI';
import { useState, useEffect, FormEvent } from 'react';
import { useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import HomeButton from '@/components/common/HomeButton';
import { useKioskSerialNumberStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';
import { toast, Toaster } from 'react-hot-toast';

export default function Questionnaire() {
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState<Questions[]>([]);

  const { playClickSound } = useClickSound();

  const { memberData } = useMemberDataStore();

  const [answerObj, setAnswerObj] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);

  const { kioskSerialID } = useKioskSerialNumberStore();

  const { sessionID } = useTestSessionStore();

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
          const {
            data: { questions },
          } = await ServerAPI.getQuestionList(kioskSerialID);
          setQuestionList(questions);

          // Initialize answerObj with default value of 1 for each question
          const defaultAnswers = questions.reduce((acc: { [key: string]: string }, question: Questions) => {
            acc[question.id] = '1';
            return acc;
          }, {});
          setAnswerObj(defaultAnswers);

          setLoading(false);
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

  return (
    <div className={styles.contents}>
      <div style={{ position: 'fixed', top: '5%', left: '5%' }}>
        {/* <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      > */}
        <HomeButton />
      </div>

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
            Loading Questions ...
          </p>
        </div>
      ) : (
        <>
          <h1
            style={{
              fontSize: '3rem',
              textTransform: 'uppercase',
              color: 'rgb(232, 80, 91)',
              fontFamily: 'Montserrat',
            }}
          >
            Please select the answers below
          </h1>
          <form onSubmit={onSubmit}>
            {questionList.map(data => (
              <div key={data.id}>
                <h2 className={styles.userdetailsheading}>{data.question_text_primary}</h2>
                <SegmentedControl
                  style={{ marginTop: '1rem' }}
                  fullWidth
                  size="xl"
                  color="red"
                  value={answerObj[data.id]}
                  withScrollArea={false}
                  styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
                  data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                  onChange={(val: string) => {
                    playClickSound();
                    handleRatingChange(data.id, val);
                  }}
                />
              </div>
            ))}
            <Group position="center" style={{ marginTop: '2rem' }}>
              <Button size="xl" uppercase type="submit" color="red" radius="md">
                Submit
              </Button>
            </Group>
          </form>
        </>
      )}
      <Toaster />
    </div>
  );
}
