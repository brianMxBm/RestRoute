import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';

export const createUser = async (jwt: string, clerkId: string) => {
  try {
    const response = await api.post<Tables<'User'>>(
      `/auth/createUser`,
      {
        clerkId,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
