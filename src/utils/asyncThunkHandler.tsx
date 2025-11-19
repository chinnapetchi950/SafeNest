// src/utils/asyncThunkHandler.js

/**
 * Utility to automatically handle common Redux async thunk states:
 * pending, fulfilled, and rejected.
 *
 * @template S
 * @template T
 * @param {import('@reduxjs/toolkit').ActionReducerMapBuilder<S>} builder - Redux builder object
 * @param {import('@reduxjs/toolkit').AsyncThunk<T, any, {}>} asyncThunk - The async thunk
 * @param {keyof S['loading']} key - Key under which to store loading/error/data state
 */
export const createAsyncThunkHandlers = (builder, asyncThunk, key) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.loading[key] = true;
      state.error[key] = null;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.loading[key] = false;
      state.data[key] = action.payload;
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.loading[key] = false;
      state.error[key] = action.payload || action.error.message;
    });
};
