import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get<Tables<'User'>>(`/user/getUserById?userId=${userId}`, {
      headers: {
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};
