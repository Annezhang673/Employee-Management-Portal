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

export const uploadVisaDocument = createAsyncThunk(
  "userInfo/uploadVisaDocument",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await axiosApi.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });      

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.message);
    }
  }
);

export const fetchVisaDocuments = createAsyncThunk(
  "userInfo/fetchVisaDocuments",
  async () => {
    const response = await axiosApi.get("/api/documents/user");
    return response.data.visaDocs || [];
  }
);

interface VisaDoc {
  type: string;
  s3Key: string;
  previewUrl: string;
  downloadUrl: string;
  status: string;
  feedback: string;
  uploadedAt: string;
}

type UserInfoState = {
  userInfo: UserInfo | null;
  documents: any[];
  visaDocs: VisaDoc[];
  isLoading: boolean;
  error: string | null;
};

const initialState: UserInfoState = {
  userInfo: null,
  documents: [],
  visaDocs: [],
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

    builder
      .addCase(uploadVisaDocument.fulfilled, (state, action) => {
        const idx = state.visaDocs.findIndex(
          (doc) => doc.type === action.payload.type
        );
        if (idx >= 0) {
          state.visaDocs[idx] = action.payload;
        } else {
          state.visaDocs.push(action.payload);
        }
      })

      .addCase(fetchVisaDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVisaDocuments.fulfilled, (state, action) => {
        state.visaDocs = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchVisaDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user info";
      });
  },
});

export const { setUserInfo, updateUserField } = userInfoSlice.actions;
export default userInfoSlice;
