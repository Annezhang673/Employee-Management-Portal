import { configureStore } from "@reduxjs/toolkit";
import onboardingSlice from "./slices/onboardingSlice";
import tokenReducer from "./slices/tokenSlice";
import reviewReducer from "./slices/reviewSlice";
import userInfoSlice from "./slices/userInfoSlice";

const store = configureStore({
  reducer: {
    onboarding: onboardingSlice.reducer,
    userInfo: userInfoSlice.reducer,
    tokens: tokenReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
