import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';
import {z} from 'zod'

const getUserByClerkIdInput = z.object({
  jwt: z.string().min(1, 'JWT is required'),
  clerkId: z.string().min(1, 'Clerk ID is required'),
});

type GetUserByClerkIdType = z.infer<typeof getUserByClerkIdInput>;

export const getUserByClerkId = async ({jwt, clerkId}: GetUserByClerkIdType) => {
  getUserByClerkIdInput.parse({ jwt, clerkId});
  try {
    const response = await api.get<Tables<'User'>>(`/user/getUserById?userId=${clerkId}`, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};
