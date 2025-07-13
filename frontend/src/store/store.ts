import { configureStore } from "@reduxjs/toolkit";
import onboardingSlice from "./slices/onboardingSlice";
import userInfoSlice from "./slices/userInfoSlice";

const store = configureStore({
  reducer: {
    onboarding: onboardingSlice.reducer,
    userInfo: userInfoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
