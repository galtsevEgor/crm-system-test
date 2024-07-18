import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface LocaleState {
  locale: string;
}

const initialState: LocaleState = {
  locale: localStorage.getItem('language') || 'en',
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
      localStorage.setItem('language', state.locale);
    },
  },
});

export const { setLocale } = localeSlice.actions;
export const selectLocale = (state: RootState) => state.locale.locale;
export default localeSlice.reducer;
