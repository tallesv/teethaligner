import api from '@/client/api';
import { parseCookies } from 'nookies';
import { create } from 'zustand';

type User = {
  name: string;
  email: string;
  user_type: 'Admin' | 'Client';
  firebase_id: string;
  avatar: string | null;
};

interface useAuthProps {
  userLogged: User | null;
  fetchUser: () => Promise<void>;
  setUserLogged: (user: User | null) => void;
}

const useAuth = create<useAuthProps>(set => ({
  userLogged: null,
  fetchUser: async () => {
    const { 'teethaligner.use-firebase-id': userFirebaseId } =
      parseCookies(null);
    if (userFirebaseId) {
      const { data } = await api.get(`/users/${userFirebaseId}`);
      set({ userLogged: data });
    }
  },
  setUserLogged: (user: User | null) => {
    set(() => ({ userLogged: user }));
  },
}));

export default useAuth;

// {
//   avatar: null,
//   email: 'talles17.a@gmail.com',
//   firebase_id: '4SWWYZcVMCYzXy7TuTRy1jFne0S2',
//   name: 'Talles Vieira',
//   user_type: 'Admin',
// },