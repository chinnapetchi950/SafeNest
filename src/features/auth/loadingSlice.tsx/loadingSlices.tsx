import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loadingSlice",
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
