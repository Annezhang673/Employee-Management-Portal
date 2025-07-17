import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "../../lib/axiosApi";

/* 
 * Types
*/
export interface VisaRecord {
   userId: string;
   fullName: string;
   visaType: string;
   startDate: string | null;
   endDate:   string | null;
   daysRemaining: number;
   nextStep?:     string;           // only on inProgress
   pendingDoc?:   { type: string; url: string } | null;
   approvedDocs?: Array<{ type: string; url: string; status: string }>;
}

interface VisaState {
   inProgress: VisaRecord[];
   all: VisaRecord[];
   loading: boolean;
   error: string | null;
   searchTerm: string;
}

const initialState: VisaState = {
   inProgress: [],
   all: [],
   loading: false,
   error: null,
   searchTerm: "",
};



/*
 * Thunks part
*/

// Fetch users with any non-approved docs
export const fetchInProgress = createAsyncThunk(
   "visa/fetchInProgress",
   async () => {
      const resp = await axiosApi.get("/api/visa/in-progress");
      return resp.data as VisaRecord[];
   }
);

// Fetch all visa-status users, optional filter
export const fetchAll = createAsyncThunk<
   VisaRecord[],
   string /* search term */
>(
   "visa/fetchAll",
   async (searchTerm) => {
      const resp = await axiosApi.get("/api/visa/all", {
      params: { search: searchTerm },
      });
      return resp.data as VisaRecord[];
   }
);

// Approve a doc (OPT Receipt no dates, OPT EAD with dates)
export const approveDoc = createAsyncThunk<
   { userId: string; docType: string },
   { userId: string; docType: string; startDate?: string; endDate?: string }
>(
   "visa/approveDoc",
   async ({ userId, docType, startDate, endDate }) => {
      await axiosApi.put(
         `/api/visa/${userId}/docs/${encodeURIComponent(docType)}/approve`,
         { startDate, endDate }
      );
      return { userId, docType };
   }
);

// Reject a doc with feedback
export const rejectDoc = createAsyncThunk<
   { userId: string; docType: string },
   { userId: string; docType: string; feedback: string }
>(
   "visa/rejectDoc",
   async ({ userId, docType, feedback }) => {
      await axiosApi.put(
         `/api/visa/${userId}/docs/${encodeURIComponent(docType)}/reject`,
         { feedback }
      );
      return { userId, docType };
   }
);

// Send reminder email
export const sendReminder = createAsyncThunk<
  string /* userId */,
  string /* userId */
>(
   "visa/sendReminder",
   async (userId) => {
      await axiosApi.post(`/api/visa/${userId}/notify`);
      return userId;
   }
);


/*
 * Slice definition
*/
const visaSlice = createSlice( {
   name: "visa",
   initialState,
   reducers: {
      setSearchTerm(state, action: PayloadAction<string>) {
         state.searchTerm = action.payload;
      },
   },

   extraReducers: (builder) => {
      // fetchInProgress
      builder
      .addCase(fetchInProgress.pending, (s) => {
         s.loading = true;
         s.error = null;
      })
      .addCase(fetchInProgress.fulfilled, (s, a) => {
         s.loading = false;
         s.inProgress = a.payload;
      })
      .addCase(fetchInProgress.rejected, (s, a) => {
         s.loading = false;
         s.error = a.error.message || "Failed to load in-progress list";
      });

      // fetchAll
      builder
      .addCase(fetchAll.pending, (s) => {
         s.loading = true;
         s.error = null;
      })
      .addCase(fetchAll.fulfilled, (s, a) => {
         s.loading = false;
         s.all = a.payload;
      })
      .addCase(fetchAll.rejected, (s, a) => {
         s.loading = false;
         s.error = a.error.message || "Failed to load all list";
      });

      // approveDoc: on success, refetch inProgress and all
      builder
      .addCase(approveDoc.pending, (s) => {
         s.loading = true;
         s.error = null;
      })
      .addCase(approveDoc.fulfilled, (s) => {
         s.loading = false;
      })
      .addCase(approveDoc.rejected, (s, a) => {
         s.loading = false;
         s.error = a.error.message || "Failed to approve document";
      })

      // rejectDoc: on success, refetch inProgress and all
      builder
      .addCase(rejectDoc.pending, (s) => {
         s.loading = true;
         s.error = null;
      })
      .addCase(rejectDoc.fulfilled, (s) => {
         s.loading = false;
      })
      .addCase(rejectDoc.rejected, (s, a) => {
         s.loading = false;
         s.error = a.error.message || "Failed to reject document";
      });

      // sendReminder: on success, refetch inProgress and all
      builder
      .addCase(sendReminder.pending, (s, a) => {
         s.loading = true;
         s.error = null;
      })
      .addCase(sendReminder.fulfilled, (s) => {
         s.loading = false;
      })
      .addCase(sendReminder.rejected, (s, a) => {
         s.loading = false;
         s.error = a.error.message || "Failed to send reminder email";
      });
   }
})

export const { setSearchTerm } = visaSlice.actions;
export default visaSlice.reducer;