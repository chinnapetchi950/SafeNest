import { createSlice } from "@reduxjs/toolkit";
import { fetchGameTypes } from "./createChildSlice";

const gameTypesSlice = createSlice({
  name: "gameTypes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGameTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchGameTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gameTypesSlice.reducer;
