import { useState, useEffect } from 'react';
import styles from '../../styles/Details.module.css';
import { TextInput, Group, Select } from '@mantine/core';
import { FaChevronRight } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ServerAPI from '../../../API/ServerAPI';
import { GENDER } from '../../../@types/index.';
import { UserFormData, userDetailsFormSchema } from '../../../validation';
import useClickSound from '@/hooks/useClickSound';
import { PageRoutes } from '../../../@types/index.';
import { useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import '../../styles/keyboard.css';
import { useTranslation } from 'react-i18next';
import { useKioskSerialNumberStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';
import { toast, Toaster } from 'react-hot-toast';
// import DateSelector from './DateSelector';

const departments = [
  'Paediatrics',
  'Surgery',
  'ENT',
  'Eye',
  'Pathology',
  'Radiology',
  'Anaesthesia, Dental',
  'Medicine',
  'Homeopathic',
  'Psychiatry',
  'Emergency',
];

const UserRegistrationForm = () => {
  const [gender, setGender] = useState<GENDER | null>(null);
  const [department, setDepartment] = useState('');
  const [keyboardVisibility, setKeyboardVisibility] = useState(true);
  const [keyboardNumberVisibility, setKeyboardNumberVisibility] = useState(false);
  const [keyboardNumberInput, setKeyboardNumberInput] = useState('');
  const [inputField, setInputField] = useState<'name' | 'phoneNumber'>('name');
  const [layoutName, setLayoutName] = useState('default');
  const { t } = useTranslation();
  const { kioskSerialID } = useKioskSerialNumberStore();
  const { setSessionId } = useTestSessionStore();
  const {
    register,
    setValue,
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

  const handleGenderValue = (value: GENDER) => {
    playClickSound();
    setGender(value as GENDER);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!gender) {
      toast.error('Please select your gender!');
      return;
    }
    // if (!dob) {
    //   toast.error('Please add your Date of Birth!');
    //   return;
    // }
    playClickSound();

    const formattedData = {
      ...data,
      dob: new Date('2000-01-01'),
      gender,
    };

    console.log(formattedData);

    try {
      const result = await ServerAPI.createUser(formattedData);
      setGender(null);
      setMemberData(result.data.user);
      navigate(PageRoutes.AUTH_USER_QUESTIONNAIRE);
      reset();
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    setSessionIdFn();
  }, [memberData?.id]);

  useEffect(() => {
    if (gender) {
      setValue('gender', gender);
    }
  }, [gender, setValue]);

  // useEffect(() => {
  //   if (dob) {
  //     setValue('dob', dob);
  //   }
  // }, [dob, setValue]);

  const handleShift = () => {
    const newLayoutName = layoutName === 'default' ? 'shift' : 'default';
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (button === '{shift}' || button === '{lock}') handleShift();
  };

  const handleInputClick = (fieldName: 'name' | 'phoneNumber') => {
    if (fieldName === 'name') {
      setKeyboardNumberVisibility(false);
      setKeyboardVisibility(true);
      setInputField(fieldName);
    }
    if (fieldName === 'phoneNumber') {
      setKeyboardNumberVisibility(true);
      setKeyboardVisibility(false);
      setInputField(fieldName);
    }
  };

  const customDisplay = {
    '{bksp}': 'bksp',
    '{space}': 'space ',
    '{tab}': 'tab',
    '{enter}': 'enter',
    '{shift}': 'caps',
    '{default}': 'caps',
  };

  const onNumberKeyPress = (button: string) => {
    playClickSound();
    if (button === '{bksp}') {
      const updatedValue = keyboardNumberInput.slice(0, -1);
      setKeyboardNumberInput(updatedValue);
      setValue('phoneNumber', updatedValue);
    } else {
      const newValue = keyboardNumberInput + button;
      setKeyboardNumberInput(newValue);
      setValue('phoneNumber', newValue);
    }
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80vw', height: '100%' }}>
        <TextInput
          withAsterisk
          autoComplete="off"
          label={t('Name of the Patient')}
          {...register('name')}
          error={errors?.name?.message}
          size="md"
          required
          style={{ marginBottom: '1rem', width: '100%' }}
          onClick={() => handleInputClick('name')}
        />

        <div className={styles.genderDateContainer}>
          <div className={styles.parentContainer}>
            <label className={styles.genderDateLabel}>
              {t('gender')}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <div className={styles.genderOptions}>
              <input
                type="checkbox"
                id="male"
                value={GENDER.MALE}
                checked={gender === GENDER.MALE}
                onChange={() => handleGenderValue(GENDER.MALE)}
              />
              <label htmlFor="male">{t('male')}</label>

              <input
                type="checkbox"
                id="female"
                value={GENDER.FEMALE}
                checked={gender === GENDER.FEMALE}
                onChange={() => handleGenderValue(GENDER.FEMALE)}
              />
              <label htmlFor="female">{t('female')}</label>

              <input
                type="checkbox"
                id="others"
                value={GENDER.OTHERS}
                checked={gender === GENDER.OTHERS}
                onChange={() => handleGenderValue(GENDER.OTHERS)}
              />
              <label htmlFor="others">{t('others')}</label>
            </div>
          </div>

          {/* <div className={styles.parentContainer}>
            <label className={styles.genderDateLabel}>
              {t('dob')}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <DateSelector onDateChange={(value: string) => setDob(value)} />
          </div> */}

          <div className={styles.parentContainer}>
            <label className={styles.genderDateLabel}>
              {t('Admitted Department')}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <Select
              data={departments}
              placeholder="Select the department"
              value={department}
              onChange={val => {
                setDepartment(val as string);
                setValue('department', val as string);
                playClickSound();
              }}
              style={{ width: '500px' }}
              maxDropdownHeight={450}
            />
          </div>
        </div>

        <TextInput
          withAsterisk
          autoComplete="off"
          label={t('phone')}
          {...register('phoneNumber')}
          error={errors?.phoneNumber?.message}
          size="md"
          style={{ marginBottom: '1rem', width: '100%' }}
          onClick={() => handleInputClick('phoneNumber')}
          maxLength={10}
        />
        <Group position="center" mt="md">
          <button type="submit" className={styles.button}>
            Submit
            <span style={{ paddingLeft: '10px' }}>
              <FaChevronRight />
            </span>
          </button>
        </Group>
        {keyboardNumberVisibility && (
          <div className={styles.keyboardContainer} style={{ marginTop: '1rem' }}>
            <Keyboard
              inputName={inputField}
              onChange={input => setKeyboardNumberInput(input)}
              onKeyPress={onNumberKeyPress}
              layout={{
                default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {enter}'],
              }}
              theme={'hg-theme-default hg-layout-default myTheme'}
              buttonTheme={[
                {
                  class: 'hg-red',
                  buttons: '1 2 3 4 5 6 7 8 9 0 {bksp} {enter}',
                },
              ]}
            />
          </div>
        )}
        {keyboardVisibility && (
          <div style={{ marginTop: '1rem' }} className={styles.keyboardContainer}>
            <Keyboard
              inputName={inputField}
              onChange={input => setValue('name', input)}
              onKeyPress={onKeyPress}
              display={customDisplay}
              theme={'hg-theme-default hg-layout-default myTheme'}
              layoutName={layoutName}
              layout={{
                default: ['q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m {bksp}', '{space}'],
                shift: ['Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M {bksp}', '{space}'],
              }}
              buttonTheme={[
                {
                  class: 'hg-red',
                  buttons:
                    'q w e r t y u i o p a s d f g h j k l {shift} z x c v b n m {bksp} {space} Q W E R T Y U I O P A S D F G H J K L Z X C V B N M',
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
