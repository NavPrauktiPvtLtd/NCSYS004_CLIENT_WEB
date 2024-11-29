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
import { useAuthStore, useMemberDataStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import '../../styles/keyboard.css';
import { useTranslation } from 'react-i18next';
import { useKioskSerialNumberStore } from '@/store/store';
import { useTestSessionStore } from '@/store/store';
import { toast, Toaster } from 'react-hot-toast';

const UserRegistrationForm = () => {
  const { language } = useAuthStore();

  const departments = [
    {
      label: language === 'English' ? 'Obstetrics & Gynaecology' : 'প্ৰসূতি আৰু গাইনিক’লজি',
      value: 'Obstetrics & Gynaecology',
    },
    {
      label: language === 'English' ? 'Paediatrics' : 'শিশু চিকিৎসা',
      value: 'Paediatrics',
    },
    {
      label: language === 'English' ? 'Surgery' : 'শল্য চিকিৎসা',
      value: 'Surgery',
    },
    {
      label: language === 'English' ? 'ENT' : 'কান-নাক-ডিঙি',
      value: 'ENT',
    },
    {
      label: language === 'English' ? 'Eye' : 'চকু',
      value: 'Eye',
    },
    {
      label: language === 'English' ? 'Pathology' : 'পাথলজি',
      value: 'Pathology',
    },
    {
      label: language === 'English' ? 'Radiology' : 'ৰেডিঅ’লজি',
      value: 'Radiology',
    },
    {
      label: language === 'English' ? 'Anaesthesia' : 'এনেস্থেচিয়া',
      value: 'Anaesthesia',
    },
    {
      label: language === 'English' ? 'Dental' : 'দন্ত চিকিৎসা',
      value: 'Dental',
    },
    {
      label: language === 'English' ? 'Medicine' : 'ঔষধ',
      value: 'Medicine',
    },
    {
      label: language === 'English' ? 'Homeopathic' : 'হোমিঅ’পেথিক',
      value: 'Homeopathic',
    },
    {
      label: language === 'English' ? 'Psychiatry' : 'মনোৰোগবিদ্যা',
      value: 'Psychiatry',
    },
    {
      label: language === 'English' ? 'Emergency' : 'জৰুৰীকালীন',
      value: 'Emergency',
    },
  ];

  const [gender, setGender] = useState<GENDER | null>(null);
  const [department, setDepartment] = useState('');
  const [keyboardVisibility, setKeyboardVisibility] = useState(true);
  const [keyboardNumberVisibility, setKeyboardNumberVisibility] = useState(false);
  const [inputField, setInputField] = useState<'name' | 'phoneNumber'>('name');
  const [inputValue, setInputValue] = useState({ name: '', phoneNumber: '' });
  const [layoutName, setLayoutName] = useState('default');
  const { t } = useTranslation();
  const { kioskSerialID } = useKioskSerialNumberStore();
  const { setSessionId } = useTestSessionStore();

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userDetailsFormSchema) });

  const { setMemberData, memberData } = useMemberDataStore();
  const navigate = useNavigate();
  const { playClickSound } = useClickSound();

  const phoneNumber = watch('phoneNumber');

  useEffect(() => {
    if (phoneNumber && phoneNumber.length > 10) {
      toast.error('Phone number cannot exceed 10 digits');
      setValue('phoneNumber', phoneNumber.slice(0, 10));
    }
  }, [phoneNumber, setValue]);

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
    if (!department) {
      toast.error('Please select the department!');
      return;
    }
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

  const handleShift = () => {
    const newLayoutName = layoutName === 'default' ? 'shift' : 'default';
    setLayoutName(newLayoutName);
  };

  const handleInputClick = (fieldName: 'name' | 'phoneNumber') => {
    setInputField(fieldName);
    setKeyboardVisibility(fieldName === 'name');
    setKeyboardNumberVisibility(fieldName === 'phoneNumber');
  };

  const customDisplay = {
    '{bksp}': '⌫ Remove',
    '{space}': 'Space',
    '{shift}': 'Shift',
    '{default}': 'Shift',
  };

  const onKeyPress = (button: string) => {
    playClickSound();
    if (inputField === 'phoneNumber' && /\d/.test(button)) {
      const currentValue = inputValue[inputField];

      if (currentValue.length >= 10) {
        return;
      }
    }
    if (button === '{shift}') handleShift();
    else if (button === '{bksp}') {
      const updatedValue = inputValue[inputField].slice(0, -1);
      setInputValue(prev => ({ ...prev, [inputField]: updatedValue }));
    } else if (button === '{space}') {
      const updatedValue = inputValue[inputField] + ' ';
      setInputValue(prev => ({ ...prev, [inputField]: updatedValue }));
    } else {
      const updatedValue = inputValue[inputField] + button;
      setInputValue(prev => ({ ...prev, [inputField]: updatedValue }));
    }
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

        <div className={styles.genderDateContainer}>
          <div className={styles.parentContainer}>
            <label className={styles.genderDateLabel}>
              {language === 'English' ? t('gender') : 'লিংগ'}
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
              <label htmlFor="male">{language === 'English' ? t('male') : 'পুৰুষ'}</label>

              <input
                type="checkbox"
                id="female"
                value={GENDER.FEMALE}
                checked={gender === GENDER.FEMALE}
                onChange={() => handleGenderValue(GENDER.FEMALE)}
              />
              <label htmlFor="female">{language === 'English' ? t('female') : 'মহিলা'}</label>

              <input
                type="checkbox"
                id="others"
                value={GENDER.OTHERS}
                checked={gender === GENDER.OTHERS}
                onChange={() => handleGenderValue(GENDER.OTHERS)}
              />
              <label htmlFor="others">{language === 'English' ? t('others') : 'অন্যান্য'}</label>
            </div>
          </div>

          <div className={styles.parentContainer}>
            <label className={styles.genderDateLabel}>
              {language === 'English' ? t('Admitted Department') : 'নামভৰ্তি বিভাগ'}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <Select
              data={departments}
              placeholder={language === 'English' ? 'Select the department' : 'বিভাগ বাছনি কৰক'}
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
                      : '্ া ি ী ু ূ ৃ ে ৈ ো ৌ অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য ৰ ল ৱ {shift} {bksp} {space} অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ শ ষ স হ ক্ষ ড় ঢ় য় ট ঠ ড ঢ ণ ত থ দ ধ ন ৎ ং ঃ ঁ',
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
