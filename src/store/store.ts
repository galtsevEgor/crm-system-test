import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import commentsReducer from './slices/commentsSlice';
import designerReducer from './slices/designersSlice';
import mainPageReducer from './slices/mainPageSlice';
import themeReducer from './slices/themeSlice';
import localeReducer from './slices/localeSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    comments: commentsReducer,
    designers: designerReducer,
    mainPage: mainPageReducer, 
    theme: themeReducer,
    locale: localeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
