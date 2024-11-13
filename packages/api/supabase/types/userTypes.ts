import type { Tables } from "./database.types";

export type User = Tables<"User">;

export type UserOnboarding = Omit<
  Tables<"User">,
  "createdAt" | "updatedAt" | "active" | "email" | "avatar" | "clerkId" | "favoriteRestrooms" | "Review" 
>;

