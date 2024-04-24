import { atom, selector } from 'recoil';
import { getCookie } from 'cookies-next';

const access_token = getCookie('access_token');
const defaultAuthState = Boolean(access_token);
const defaultStudentId = getCookie('student_id') || '';

export const authState = atom({
  key: 'auth',
  default: defaultAuthState,
});

export const studentIdState = atom({
  key: 'student_id',
  default: defaultStudentId,
});

export const isAuthenticated = selector({
  key: 'isAuthenticated',
  get: ({ get }) => {
    const authenticatedState = get(authState);
    return authenticatedState;
  },
});
