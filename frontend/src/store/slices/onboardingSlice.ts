import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOnboarding = createAsyncThunk(
  "onboarding/fetch",
  async () => {
    const res = await axios.get("http://localhost:8080/api/onboarding");
    return res.data;
  }
);

export const submitOnboarding = createAsyncThunk(
  "onboarding/submit",
  async (formData: FormData) => {
    const res = await axios.post(
      "http://localhost:8080/api/onboarding",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  }
);

export type OnboardingState = {
  onboarding: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  submitted: boolean;
};

const initialState: OnboardingState = {
  onboarding: [],
  status: "idle",
  error: null,
  submitted: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboarding.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.onboarding = action.payload;

        // Automatically set submitted to true if application exists
        if (action.payload && action.payload._id) {
          state.submitted = true;
        }
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(submitOnboarding.fulfilled, (state) => {
        state.submitted = true;
      });
  },
});

export default onboardingSlice;
