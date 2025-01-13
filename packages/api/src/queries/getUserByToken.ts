import { api } from '../..';
import type { Session } from '../../supabase/types/authType';
import { z } from 'zod';

export const getUserByTokenInput = z.object({
  jwt: z.string().min(1, 'JWT is required'),
});

type GetUserByTokenType = z.infer<typeof getUserByTokenInput>;

export const getUserByToken = async ({ jwt }: GetUserByTokenType) => {
  getUserByTokenInput.parse({ jwt });
  try {    
    const response = await api.get<Session>('/auth/getUserFromToken', {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        // authorization: `Bearer ${jwt}`,
      },
    });
  return response.data;
  } catch (error) {
    throw error;
  }
};

