import { api } from '../..';
import type { Tables } from '../../supabase/types/database.types';
import {z} from 'zod'

const createUserInput = z.object({
  jwt: z.string().min(1, 'JWT is required'),
  clerkId: z.string().min(1, 'Clerk ID is required'),
});

type CreateUserInput = z.infer<typeof createUserInput>;

export const createUser = async ({ jwt, clerkId }: CreateUserInput) => {
  createUserInput.parse({ jwt, clerkId });
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
