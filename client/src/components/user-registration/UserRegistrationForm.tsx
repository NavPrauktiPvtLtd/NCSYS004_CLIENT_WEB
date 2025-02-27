import { useState, useEffect } from 'react';
import styles from '../../styles/Details.module.css';
import { Group } from '@mantine/core';
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
  const { language, selectedArea } = useAuthStore();

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
      label: language === 'English' ? 'Surgery' : 'অস্ত্ৰোপচাৰ',
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
  const [inputField, setInputField] = useState<'name' | 'phoneNumber' | 'age' | 'address'>('name');
  const [inputValue, setInputValue] = useState({ name: '', phoneNumber: '', age: '', address: '' });
  const [layoutName, setLayoutName] = useState('default');
  const { t } = useTranslation();
  const { kioskSerialID } = useKioskSerialNumberStore();
  const { setSessionId } = useTestSessionStore();

  const {
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

  useEffect(() => {
    if (selectedArea) {
      setValue('category', selectedArea);
    }
  }, [selectedArea, setValue]);

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

    try {
      const result = await ServerAPI.createUser(data);
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

  const handleInputClick = (fieldName: 'name' | 'phoneNumber' | 'age' | 'address') => {
    setInputField(fieldName);
    setKeyboardVisibility(fieldName === 'name' || fieldName === 'address');
    setKeyboardNumberVisibility(fieldName === 'phoneNumber' || fieldName === 'age');
  };

  const customDisplay = {
    '{bksp}': '⌫ Remove',
    '{space}': 'Space',
    '{shift}': 'Shift',
    '{default}': 'Shift',
  };

  useEffect(() => {
    if (inputField === 'phoneNumber') {
      const currentValue = inputValue[inputField];
      setValue('phoneNumber', currentValue);
    }
    if (inputField === 'age') {
      const currentValue = inputValue[inputField];
      setValue('age', Number(currentValue));
    }
    if (inputField === 'name') {
      const currentValue = inputValue[inputField];
      setValue('name', currentValue);
    }
    if (inputField === 'address') {
      const currentValue = inputValue[inputField];
      setValue('address', currentValue);
    }
  }, [inputField, inputValue, setValue]);

  const onKeyPress = (button: string) => {
    playClickSound();
    if (inputField === 'phoneNumber' && button !== '{bksp}') {
      const currentValue = inputValue[inputField];

      if (currentValue.length >= 10) {
        return;
      }
    }
    if (inputField === 'age' && button !== '{bksp}') {
      const currentValue = inputValue[inputField];

      if (currentValue.length >= 2) {
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
        <div className={styles.parentContainer}>
          <label
            className={styles.genderDateLabel}
            style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
          >
            {language === 'English' ? t('Name of the Patient') : 'ৰোগীৰ নাম'}
            <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
          </label>
          <input
            value={inputValue.name}
            onChange={e => {
              setInputValue({ ...inputValue, name: e.target.value });
              setValue('name', e.target.value);
            }}
            type="text"
            style={{
              marginBottom: '1rem',
              width: '100%',
              fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined,
              height: 42,
              borderColor: '#00000030',
              paddingLeft: 7,
              paddingRight: 7,
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 4,
              MozAppearance: 'textfield',
              appearance: 'none',
            }}
            onClick={() => handleInputClick('name')}
          />
        </div>
        <div className={styles.genderDateContainer}>
          <div className={styles.parentContainer}>
            <label
              className={styles.genderDateLabel}
              style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
            >
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
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              />
              <label
                htmlFor="male"
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              >
                {language === 'English' ? t('male') : 'পুৰুষ'}
              </label>

              <input
                type="checkbox"
                id="female"
                value={GENDER.FEMALE}
                checked={gender === GENDER.FEMALE}
                onChange={() => handleGenderValue(GENDER.FEMALE)}
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              />
              <label
                htmlFor="female"
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              >
                {language === 'English' ? t('female') : 'মহিলা'}
              </label>

              <input
                type="checkbox"
                id="others"
                value={GENDER.OTHERS}
                checked={gender === GENDER.OTHERS}
                onChange={() => handleGenderValue(GENDER.OTHERS)}
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              />
              <label
                htmlFor="others"
                style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
              >
                {language === 'English' ? t('others') : 'অন্যান্য'}
              </label>
            </div>
          </div>

          <div className={styles.parentContainer}>
            <label
              className={styles.genderDateLabel}
              style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
            >
              {language === 'English' ? 'Age' : 'বয়স'}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <input
              value={inputValue.age}
              onChange={e => {
                setInputValue({ ...inputValue, age: e.target.value });
                setValue('age', Number(e.target.value));
              }}
              type="number"
              style={{
                width: '250px',
                fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined,
                height: 40,
                borderColor: '#00000030',
                paddingLeft: 7,
                paddingRight: 7,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 4,
                MozAppearance: 'textfield',
                appearance: 'none',
              }}
              onClick={() => handleInputClick('age')}
            />
          </div>

          <div className={styles.parentContainer}>
            <label
              className={styles.genderDateLabel}
              style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
            >
              {language === 'English' ? t('Admitted Department') : 'নামভৰ্তি বিভাগ'}
              <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
            </label>
            <select
              value={department}
              onChange={e => {
                const selectedValue = e.target.value;
                setDepartment(selectedValue);
                setValue('department', selectedValue);
                playClickSound();
              }}
              style={{
                width: '350px',
                maxHeight: '450px',
                overflowY: 'auto',
                height: 40,
                borderColor: '#00000030',
                paddingLeft: 7,
                paddingRight: 7,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 4,
                fontFamily: language !== 'English' ? 'Banikanta' : undefined,
              }}
            >
              <option value="" style={{ fontFamily: language !== 'English' ? 'Banikanta' : undefined }}>
                {language === 'English' ? 'Select the department' : 'বিভাগ বাছনি কৰক'}
              </option>
              {departments.map(dept => (
                <option
                  key={dept.value}
                  value={dept.value}
                  style={{ fontFamily: language !== 'English' ? 'Banikanta' : undefined }}
                >
                  {dept.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.parentContainer}>
          <label
            className={styles.genderDateLabel}
            style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
          >
            {language === 'English' ? t('Phone') : 'মোবাইল নম্বৰ'}
            <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
          </label>
          <input
            value={inputValue.phoneNumber}
            onChange={e => {
              setInputValue({ ...inputValue, phoneNumber: e.target.value });
              setValue('phoneNumber', e.target.value);
            }}
            type="number"
            style={{
              marginBottom: '1rem',
              width: '100%',
              fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined,
              height: 42,
              borderColor: '#00000030',
              paddingLeft: 7,
              paddingRight: 7,
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 4,
              MozAppearance: 'textfield',
              appearance: 'none',
            }}
            onClick={() => handleInputClick('phoneNumber')}
          />
        </div>

        <div className={styles.parentContainer}>
          <label
            className={styles.genderDateLabel}
            style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
          >
            {language === 'English' ? t('Address') : 'ঠিকনা'}
            <span style={{ color: 'red', fontWeight: 'normal' }}>*</span>
          </label>
          <input
            value={inputValue.address}
            onChange={e => {
              setInputValue({ ...inputValue, address: e.target.value });
              setValue('address', e.target.value);
            }}
            type="text"
            style={{
              marginBottom: '1rem',
              width: '100%',
              fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined,
              height: 42,
              borderColor: '#00000030',
              paddingLeft: 7,
              paddingRight: 7,
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 4,
              MozAppearance: 'textfield',
              appearance: 'none',
            }}
            onClick={() => handleInputClick('address')}
          />
        </div>

        <Group position="center" mt="md">
          <button
            type="submit"
            className={styles.button}
            style={{ fontFamily: language !== 'English' ? 'Banikanta, sans-serif' : undefined }}
          >
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
          <div
            style={{ marginTop: '1rem', fontFamily: language !== 'English' ? 'Banikanta' : undefined }}
            className={styles.keyboardContainer}
          >
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
