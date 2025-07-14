import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosApi from "../../lib/axiosApi";


export interface AppRow {
   appId: string;
   userName: string;
   email: string;
   submitted: string;
   }

interface ReviewState {
   pending:   AppRow[];
   rejected:  AppRow[];
   approved:  AppRow[];
   loading:   boolean;
   error:     string | null;
}

const initialState: ReviewState = {
   pending: [],
   rejected: [],
   approved: [],
   loading: false,
   error: null
};

export const fetchBucket = createAsyncThunk<
   { status: 'Pending'|'Rejected'|'Approved'; data: AppRow[] },
   'Pending'|'Rejected'|'Approved'
   >(
   'review/fetchBucket',
   async (status) => {
      const res = await axiosApi.get<AppRow[]>('/api/hiring/review', { params: { status } });
      return { status, data: res.data };
   }
);

export const approveApp = createAsyncThunk<void, string>(
   'review/approveApp',
   async (appId, thunkAPI) => {
      await axiosApi.put(`/api/hiring/review/${appId}/approve`);
      thunkAPI.dispatch(fetchBucket('Pending'));
      thunkAPI.dispatch(fetchBucket('Approved'));
   }
);

export const rejectApp = createAsyncThunk<void, { appId: string; feedback: string }>(
   'review/rejectApp',
   async ({ appId, feedback }, thunkAPI) => {
      await axiosApi.put(`/api/hiring/review/${appId}/reject`, { feedback });
      thunkAPI.dispatch(fetchBucket('Pending'));
      thunkAPI.dispatch(fetchBucket('Rejected'));
   }
);

const reviewSlice = createSlice({
   name: 'review',
   initialState,
   reducers: {},
   extraReducers: builder => {
      builder
         .addCase(fetchBucket.pending, state => { state.loading = true; state.error = null; })

         .addCase(fetchBucket.fulfilled, (state, { payload }) => {
         state.loading = false;
         state[payload.status.toLowerCase() as 'pending'|'rejected'|'approved'] = payload.data;
         })
         
         .addCase(fetchBucket.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message ?? 'Failed to load applications';
         });
   }
});

export default reviewSlice.reducer;
