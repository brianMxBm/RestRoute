import { api } from '../..';
import type { Session } from '../../supabase/types/authType';

export const getUserByToken = async (jwt: string) => {
  try {
    const response = await api.get<Session>('/auth/getUserFromToken', {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
