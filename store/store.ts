import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './slices/workoutSlice';
import nutritionReducer from './slices/nutritionSlice';
import progressReducer from './slices/progressSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    nutrition: nutritionReducer,
    progress: progressReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;