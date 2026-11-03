import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  costCentre: string;
  spendingLimit: number;
  currency: string;
  avatarInitials: string;
  isAuthenticated: boolean;
}

export interface UserState {
  profile: UserProfile;
}

const initialState: UserState = {
  profile: {
    id: "usr-0941",
    name: "Sarah Jones",
    email: "sarah.jones@worshipstreet.com",
    organization: "Northwind Distribution",
    role: "Requester",
    costCentre: "CC-401 (Operations)",
    spendingLimit: 500.0,
    currency: "£",
    avatarInitials: "SJ",
    isAuthenticated: true,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    logout: (state) => {
      state.profile.isAuthenticated = false;
    },
    login: (state, action: PayloadAction<{ email: string; name?: string }>) => {
      state.profile.email = action.payload.email;
      if (action.payload.name) state.profile.name = action.payload.name;
      state.profile.isAuthenticated = true;
    },
  },
});

export const { updateProfile, logout, login } = userSlice.actions;

export default userSlice.reducer;

