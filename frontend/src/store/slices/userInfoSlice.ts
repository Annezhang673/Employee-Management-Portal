import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "../../lib/axiosApi";
import type { UserInfo } from "../../pages/OnboardingPage";

interface User {
  _id: string;
  userName: string;
  email: string;
  profilePicUrl: string | null;
  role: string;
  house: string;
}

interface ApplicationResponse {
  _id: string;
  data: UserInfo;
  documents?: any[];
}

interface UserApiResponse {
  user: User;
  application: ApplicationResponse[];
}

export const fetchUserInfo = createAsyncThunk("userInfo/fetch", async () => {
  const response = await axiosApi.get<UserApiResponse>("/api/users/me");
  return response.data || null;
});

export const updateUserInfo = createAsyncThunk(
  "userInfo/update",
  async (data: Partial<UserInfo>) => {
    // data might contains file
    const formData = new FormData();

    const { profilePic, ...rest } = data;

    formData.append("data", JSON.stringify(rest));

    if (profilePic) formData.append("profilePic", profilePic);

    const response = await axiosApi.put<UserInfo>(`/api/users/me`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

type UserInfoState = {
  userInfo: UserInfo | null;
  documents: any[];
  isLoading: boolean;
  error: string | null;
};

const initialState: UserInfoState = {
  userInfo: null,
  documents: [],
  isLoading: false,
  error: null,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    updateUserField: (
      state,
      action: PayloadAction<{ field: keyof UserInfo; value: any }>
    ) => {
      if (state.userInfo) {
        (state.userInfo as any)[action.payload.field] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        const user = action.payload.user;
        const application = action.payload.application[0];
        const profilePicUrl = user.profilePicUrl || null;
        state.userInfo = {
          ...application.data,
          profilePic: profilePicUrl,
        };

        state.documents = application.documents || [];
        state.isLoading = false;
      })

      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user info";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  },
});

export const { setUserInfo, updateUserField } = userInfoSlice.actions;
export default userInfoSlice;
