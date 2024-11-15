import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';

export const createUser = async (clerkId: string) => {
  try {
    const response = await api.post<Tables<'User'>>(
      `/auth/createUser`,
      {
        clerkId
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json', // Ensure the content type is JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
