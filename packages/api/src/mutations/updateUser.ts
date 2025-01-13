import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';
import { z } from 'zod';


const updateUserByIdInput = z.object({
    clerkId: z.string().min(1, 'Clerk ID is required'),
    jwt: z.string().min(1, 'JWT is required'),
  });

type UpdateUserByIdType = z.infer<typeof updateUserByIdInput>;
  

export const updateUser = async ({clerkId, jwt}: UpdateUserByIdType) => {
  updateUserByIdInput.parse({clerkId, jwt})
  try {
    const response = await api.post<Tables<'User'>>(
      `/auth/onboardUser`,
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
