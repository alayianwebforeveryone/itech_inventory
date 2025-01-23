import authService from '@/app/appwrite/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: false,
  userData: null,
  role: null,
  isLoading: true,
};



export const fetchUserData = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  try {
    const userSession = await authService.getCurrentUser();
    if (userSession) {
      return { status: true, userData: userSession };
    } else {
      return { status: false, userData: null }; // Explicitly return false status
    }
  } catch (error) {
    console.log("Problem in Redux to get user status", error);
    return rejectWithValue(error); // Handle errors explicitly
  }
});



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true; // Set loading state to true during fetch
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.userData = action.payload.userData;
        state.role = action.payload.userData?.name || null;
        state.isLoading = false; // Set loading state to false after fetch
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.status = false; // Ensure status is false on error
        state.userData = null;
        state.role = null;
        state.isLoading = false; // Set loading state to false on error
      });
  },
});



export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
