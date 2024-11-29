import { useState, useEffect } from 'react';
import styles from '../../styles/Details.module.css';
import { Group, TextInput } from '@mantine/core';
import { FaChevronRight } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ServerAPI from '../../../API/ServerAPI';
import { UserFormData, userDetailsFormSchema } from '../../../validation';
import useClickSound from '@/hooks/useClickSound';
import { PageRoutes } from '../../../@types/index.';
import { useAuthStore, useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import '../../styles/keyboard.css';
import { useKioskSerialNumberStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const UserRegistrationForm = () => {
  const { language } = useAuthStore();
  const { t } = useTranslation();

  const [inputField, setInputField] = useState<'name' | 'phoneNumber'>('name');
  const [keyboardVisibility, setKeyboardVisibility] = useState(true);
  const [keyboardNumberVisibility, setKeyboardNumberVisibility] = useState(false);
  const [inputValue, setInputValue] = useState({ name: '', phoneNumber: '' });
  const [layoutName, setLayoutName] = useState('default');

  const { kioskSerialID } = useKioskSerialNumberStore();
  const { setSessionId } = useTestSessionStore();
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userDetailsFormSchema) });
  const { setMemberData, memberData } = useMemberDataStore();
  const navigate = useNavigate();
  const { playClickSound } = useClickSound();

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data: UserFormData) => {
    playClickSound();

    try {
      const result = await ServerAPI.createUser(data);
      setMemberData(result.data.user);
      navigate(PageRoutes.AUTH_USER_QUESTIONNAIRE);
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong, Click the home button');
    }
  };

  const setSessionIdFn = async () => {
    if (!memberData) return;
    const sessionData = await ServerAPI.startTestSession({
      userId: memberData.id,
      kioskId: kioskSerialID,
    });
    setSessionId(sessionData.id);
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (button === '{shift}') handleShift();
    else if (button === '{bksp}') {
      const updatedValue = inputValue[inputField].slice(0, -1);
      setInputValue(prev => ({ ...prev, [inputField]: updatedValue }));
    } else if (button !== '{space}' && button !== '{enter}') {
      const updatedValue = inputValue[inputField] + button;
      setInputValue(prev => ({ ...prev, [inputField]: updatedValue }));
    }
  };

  const handleShift = () => {
    setLayoutName(prev => (prev === 'default' ? 'shift' : 'default'));
  };

  const handleInputClick = (fieldName: 'name' | 'phoneNumber') => {
    setInputField(fieldName);
    setKeyboardVisibility(fieldName === 'name');
    setKeyboardNumberVisibility(fieldName === 'phoneNumber');
  };

  useEffect(() => {
    setSessionIdFn();
  }, [memberData?.id]);

  const customDisplay = {
    '{bksp}': '⌫ Remove',
    '{space}': 'Space',
    '{enter}': 'Enter',
    '{shift}': 'Shift',
    '{default}': 'Shift',
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80vw', height: '100%' }}>
        <TextInput
          withAsterisk
          autoComplete="off"
          label={language === 'English' ? t('Name of the Patient') : 'ৰোগীৰ নাম'}
          value={inputValue.name}
          onChange={e => setInputValue({ ...inputValue, name: e.target.value })}
          error={errors?.name?.message}
          size="md"
          required
          style={{ marginBottom: '1rem', width: '100%' }}
          onClick={() => handleInputClick('name')}
        />
        <TextInput
          withAsterisk
          autoComplete="off"
          label={language === 'English' ? t('Phone') : 'মোবাইল নম্বৰ'}
          value={inputValue.phoneNumber}
          onChange={e => setInputValue({ ...inputValue, phoneNumber: e.target.value })}
          error={errors?.phoneNumber?.message}
          size="md"
          style={{ marginBottom: '1rem', width: '100%' }}
          onClick={() => handleInputClick('phoneNumber')}
          maxLength={10}
        />
        <Group position="center" mt="md">
          <button type="submit" className={styles.button}>
            {language === 'English' ? 'Submit' : 'দাখিল কৰক'}
            <span style={{ paddingLeft: '10px' }}>
              <FaChevronRight />
            </span>
          </button>
        </Group>
        {keyboardNumberVisibility && (
          <div className={styles.keyboardContainer} style={{ marginTop: '1rem' }}>
            <Keyboard
              onKeyPress={onKeyPress}
              display={customDisplay}
              layout={{
                default: ['1 2 3', '4 5 6', '7 8 9', '0 {bksp}'],
              }}
              theme={'hg-theme-default hg-layout-default myTheme'}
              buttonTheme={[
                {
                  class: 'hg-red',
                  buttons: '1 2 3 4 5 6 7 8 9 0 {bksp}',
                },
              ]}
            />
          </div>
        )}
        {keyboardVisibility && (
          <div style={{ marginTop: '1rem' }} className={styles.keyboardContainer}>
            <Keyboard
              onKeyPress={onKeyPress}
              display={customDisplay}
              theme={'hg-theme-default hg-layout-default myTheme'}
              layoutName={layoutName}
              layout={
                language === 'English'
                  ? {
                      default: ['q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m {bksp}', '{space}'],
                      shift: ['Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M {bksp}', '{space}'],
                    }
                  : {
                      default: [
                        '্ া ি ী ু ূ ৃ ে ৈ ো ৌ',
                        'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ',
                        'ট ঠ ড ঢ ণ ত থ দ ধ ন',
                        '{shift} প ফ ব ভ ম য ৰ ল ৱ {bksp}',
                        '{space}',
                      ],
                      shift: [
                        'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ',
                        'শ ষ স হ ক্ষ ড় ঢ় য়',
                        'ট ঠ ড ঢ ণ ত থ দ ধ ন',
                        '{shift} ৎ ং ঃ ঁ {bksp}',
                        '{space}',
                      ],
                    }
              }
              buttonTheme={[
                {
                  class: 'hg-red',
                  buttons:
                    language === 'English'
                      ? 'q w e r t y u i o p a s d f g h j k l {shift} z x c v b n m {bksp} {space} Q W E R T Y U I O P A S D F G H J K L Z X C V B N M'
                      : 'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য ৰ ল ৱ {shift} {bksp} {space} ্ া ি ী ু ূ ৃ ে ৈ ো ৌ শ ষ স হ ক্ষ ড় ঢ় য় ট ঠ ড ঢ ণ ত থ দ ধ ন ৎ ং ঃ ঁ',
                },
              ]}
            />
          </div>
        )}
      </form>
      <Toaster />
    </div>
  );
};

export default UserRegistrationForm;
