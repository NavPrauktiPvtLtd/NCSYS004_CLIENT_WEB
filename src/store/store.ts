import { create } from "zustand";
import { User } from "../../@types/index.";

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

//for language
type languageStore = {
  selectedLanguage: string | null;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<languageStore>((set) => ({
  selectedLanguage: null,
  setLanguage: (language) => set({ selectedLanguage: language }),
}));

type kioskIdStore = {
  kioskId: string;
  setKioskId: (id: string) => void;
};

export const useKioskIdStore = create<kioskIdStore>((set) => ({
  kioskId: "1C1D79JBDRRJ",
  setKioskId: (id) => set({ kioskId: id }),
}));
