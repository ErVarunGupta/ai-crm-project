import { configureStore, createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {},
  reducers: {
    setFormData: (state, action) => {
      return action.payload;
    }
  }
});

export const { setFormData } = formSlice.actions;

export const store = configureStore({
  reducer: {
    form: formSlice.reducer
  }
});