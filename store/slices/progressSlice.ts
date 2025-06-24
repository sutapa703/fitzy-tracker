import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

interface ProgressState {
  entries: ProgressEntry[];
  goals: {
    targetWeight: number;
    targetBodyFat?: number;
    targetDate: string;
  };
}

const initialState: ProgressState = {
  entries: [
    {
      id: '1',
      date: '2024-01-15',
      weight: 175,
      bodyFat: 15.2,
      muscleMass: 145,
      measurements: {
        chest: 42,
        waist: 32,
        hips: 38,
        arms: 15,
        thighs: 24
      }
    },
    {
      id: '2',
      date: '2024-01-08',
      weight: 177,
      bodyFat: 15.8,
      muscleMass: 143,
      measurements: {
        chest: 41.5,
        waist: 32.5,
        hips: 38.2,
        arms: 14.8,
        thighs: 23.8
      }
    },
    {
      id: '3',
      date: '2024-01-01',
      weight: 180,
      bodyFat: 16.5,
      muscleMass: 141,
      measurements: {
        chest: 41,
        waist: 33,
        hips: 38.5,
        arms: 14.5,
        thighs: 23.5
      }
    }
  ],
  goals: {
    targetWeight: 170,
    targetBodyFat: 12,
    targetDate: '2024-06-01'
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addProgressEntry: (state, action: PayloadAction<ProgressEntry>) => {
      state.entries.unshift(action.payload);
    },
    updateProgressEntry: (state, action: PayloadAction<ProgressEntry>) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteProgressEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
    updateGoals: (state, action: PayloadAction<Partial<ProgressState['goals']>>) => {
      state.goals = { ...state.goals, ...action.payload };
    }
  },
});

export const { addProgressEntry, updateProgressEntry, deleteProgressEntry, updateGoals } = progressSlice.actions;
export default progressSlice.reducer;