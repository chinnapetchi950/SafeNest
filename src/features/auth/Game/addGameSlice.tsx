import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

// ------------------------------------------------------
// 🔵 FETCH MESSAGE LIST
// GET: /api/admin/messages
// ------------------------------------------------------
export const fetchMessages = createAsyncThunk(
  "api/admin/messages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMessagelist();
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

// ------------------------------------------------------
// 🔵 CREATE GAME TYPE
// POST: /api/admin/game-types
// ------------------------------------------------------
export const createGameType = createAsyncThunk(
  "api/admin/game-types",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authService.createGame(formData)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create game type"
      );
    }
  }
);

// ------------------------------------------------------
// 🔵 INITIAL STATE
// ------------------------------------------------------

// initial state
const initialState = {
  loading: false,
  error: null,
  messages: [],          // full API data (optional)
  messageList: [],       // processed array for UI
  messagesLoading: false,
  createSuccess: false,
  createdGame: null,
};


// ------------------------------------------------------
// 🔵 SLICE
// ------------------------------------------------------
const gameTypeSlice = createSlice({
  name: "gameType",
  initialState,
  reducers: {
    resetGameTypeState(state) {
      state.loading = false;
      state.error = null;
      state.createSuccess = false;
      state.createdGame = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ------------------------------------------------------
      // 🔵 FETCH MESSAGES
      // ------------------------------------------------------
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
  state.messagesLoading = false;
  state.messages = action.payload.data; 
  console.log(action.payload,"action.payload");
  
  // optional: keep full API
  // store only id + name for easy use in UI
  state.messageList = action.payload.data?.map((msg) => ({
    id: msg.id,
    name: msg.name,
  })) || [];
})

      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      // ------------------------------------------------------
      // 🔵 CREATE GAME TYPE
      // ------------------------------------------------------
      .addCase(createGameType.pending, (state) => {
        state.loading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createGameType.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.createdGame = action.payload;
      })
      .addCase(createGameType.rejected, (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { resetGameTypeState } = gameTypeSlice.actions;
export default gameTypeSlice.reducer;
