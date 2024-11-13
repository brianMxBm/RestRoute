import type { User } from "./userTypes";

export type Session = { //@TODO: Other tokens might be important here? If not abstract to just utilize User type
  user: User;
};
