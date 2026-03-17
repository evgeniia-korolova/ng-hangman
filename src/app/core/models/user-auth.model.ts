import { User } from "./user.model";

export interface UserAuth extends User {
    isRegistered: boolean;
    isAuthenticated: boolean;
  }
  
  