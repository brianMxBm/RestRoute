import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';
import { z } from 'zod';


const updateUserByIdInput = z.object({
    clerkId: z.string().min(1, 'Clerk ID is required'),
    jwt: z.string().min(1, 'JWT is required'),
    fullName: z.string().min(1, 'Name is required'),
    birthday: z.string().min(1, 'Birthday is required'),

  });

type UpdateUserByIdType = z.infer<typeof updateUserByIdInput>;
 


export const updateUser = async ({ clerkId, jwt, fullName, birthday }: UpdateUserByIdType) => {

  updateUserByIdInput.parse({ clerkId, jwt, fullName, birthday });

  try {
    const response = await api.post<Tables<'User'>>(
      `/user/updateUser`,
      {
        clerkId,
        fullName,
        birthdate: birthday,
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
