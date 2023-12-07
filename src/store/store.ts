import { create } from "zustand";
import { User } from "../../@types/index.";
import { ECGResult } from "../../API/AppAPI";

interface AuthState {
  accessToken: string | null;
  selectedUser: string | null; // store the selcted user id here
  setSelectedUser: (user: string) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setSelectedUserId: (id: string) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  selectedUser: null,
  setSelectedUser: (user) => set((state) => ({ ...state, selectedUser: user })),
  setToken: (token) => set((state) => ({ ...state, accessToken: token })),
  clearToken: () => set((state) => ({ ...state, accessToken: null })),
  setSelectedUserId: (id) => set((state) => ({ ...state, selectedUser: id })),
}));

export interface NibpResult {
  systolic: number;
  diastolic: number;
}

export interface Tests {
  height: number;
  weight: number;
  bmi: number;
  temperature: number;
  nibp: NibpResult;
  spo2: number;
  ecg: ECGResult;
}

// state to store different test result which we can use later to generate report
interface TestResultState {
  height: number;
  weight: number;
  bmi: number;
  temperature: number;
  nibp: {
    systolic: number;
    diastolic: number;
  };
  spo2: number;
  ecg: ECGResult;
  setTestValues: (newValues: Partial<Tests>) => void;
  clearTestValues: () => void;
}

export const useTestResultStore = create<TestResultState>()((set) => ({
  height: 0,
  weight: 0,
  bmi: 0,
  temperature: 0,
  nibp: {
    systolic: 0,
    diastolic: 0,
  },
  stress: 0,
  spo2: 0,
  ecg: {
    avg_heart_rate: "",
    text: "",
    desc: "",
    image: "",
  },
  setTestValues: (newValues) => set((state) => ({ ...state, ...newValues })),
  clearTestValues: () =>
    set((state) => ({
      ...state,
      height: 0,
      weight: 0,
      bmi: 0,
      temperature: 0,
      nibp: {
        systolic: 0,
        diastolic: 0,
      },
      stress: 0,
      spo2: 0,
      ecg: {
        avg_heart_rate: "",
        text: "",
        desc: "",
        image: "",
      },
    })),
}));

//state for storing kiosk serial id
interface KioskSerialNumber {
  kioskSerialID: string | null;
  setKioskId: (id: string) => void;
}

export const useKioskSerialNumberStore = create<KioskSerialNumber>()((set) => ({
  kioskSerialID: null,
  setKioskId: (id) => set((state) => ({ ...state, kioskSerialID: id })),
}));

//state for storing test-sessionId
interface TestSession {
  sessionID: string | null;
  setSessionId: (id: string | null) => void;
}

export const useTestSessionStore = create<TestSession>()((set) => ({
  sessionID: null,
  setSessionId: (id) => set((state) => ({ ...state, sessionID: id })),
}));

//state for storing member data

interface MemberDataState {
  memberData: User | null;
  setMemberData: (data: User) => void;
}

export const useMemberDataStore = create<MemberDataState>()((set) => ({
  memberData: null,
  setMemberData: (data) => set((state) => ({ ...state, memberData: data })),
}));

// state for audio

interface AudioState {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isOn: true,
  setIsOn: (value) => set({ isOn: value }),
}));
