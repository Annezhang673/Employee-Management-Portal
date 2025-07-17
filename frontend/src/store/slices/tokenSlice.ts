import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../lib/axiosApi';

export interface TokenRecord {
   email:      string;
   link:       string;
   status:     'Used' | 'Expired' | 'Unused';
   createdAt:  string;
}

interface TokenState {
   history: TokenRecord[];
   loading: boolean;
   error:   string | null;
}

const initialState: TokenState = {
   history: [],
   loading: false,
   error:   null
};

export const fetchTokens = createAsyncThunk(
   'tokens/fetchTokens',
   async () => {
      const response = await axiosApi.get< {tokens: TokenRecord[]}>('/api/tokens/status');
      return response.data.tokens;
   }
);

export const generateToken = createAsyncThunk<
   void,          // return type
   string,        // payload type (email)
   { rejectValue: string }
   >(
   'tokens/generateToken',
   async (email, thunkAPI) => {
      try {
         await axiosApi.post('/api/tokens/generate', { email });
         // after success, re-fetch history
         thunkAPI.dispatch(fetchTokens());
      } catch (err: any) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

const tokenSlice = createSlice({
   name: 'tokens',
   initialState,
   reducers: {},
   extraReducers: builder => {
      builder
         // fetchTokens
         .addCase(fetchTokens.pending, state => {
         state.loading = true;
         state.error = null;
         })
         .addCase(fetchTokens.fulfilled, (state, action: PayloadAction<TokenRecord[]>) => {
         state.history = action.payload;
         state.loading = false;
         })
         .addCase(fetchTokens.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message ?? 'Failed to load tokens';
         })

         // generateToken
         .addCase(generateToken.pending, state => {
         state.error = null;
         })
         .addCase(generateToken.rejected, (state, action) => {
         state.error = action.payload ?? 'Failed to generate token';
         });
   }
});

export default tokenSlice.reducer;