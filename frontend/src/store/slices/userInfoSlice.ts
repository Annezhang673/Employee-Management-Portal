import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../../pages/OnboardingPage";

const initialState = null as UserInfo | null;


export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      return action.payload;
    },
    updateUserField: (
      state,
      action: PayloadAction<{ field: keyof UserInfo; value: any }>
    ) => {
      if (state) {
        (state as any)[action.payload.field] = action.payload.value;
      }
    },
  },
});

export const { setUserInfo, updateUserField } = userInfoSlice.actions;

export default userInfoSlice;