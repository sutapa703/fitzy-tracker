import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration?: number;
  category: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  duration: number;
  calories: number;
}

interface WorkoutState {
  workouts: Workout[];
  exercises: Exercise[];
  currentWorkout: Exercise[];
  isWorkoutActive: boolean;
  workoutStartTime: number | null;
}

const initialState: WorkoutState = {
  workouts: [
    {
      id: '1',
      name: 'Upper Body Strength',
      date: '2024-01-15',
      exercises: [
        { id: '1', name: 'Bench Press', sets: 3, reps: 10, weight: 135, category: 'Chest' },
        { id: '2', name: 'Pull-ups', sets: 3, reps: 8, weight: 0, category: 'Back' },
        { id: '3', name: 'Shoulder Press', sets: 3, reps: 12, weight: 95, category: 'Shoulders' }
      ],
      duration: 45,
      calories: 320
    },
    {
      id: '2',
      name: 'Cardio Session',
      date: '2024-01-14',
      exercises: [
        { id: '4', name: 'Treadmill', sets: 1, reps: 1, weight: 0, duration: 30, category: 'Cardio' },
        { id: '5', name: 'Cycling', sets: 1, reps: 1, weight: 0, duration: 20, category: 'Cardio' }
      ],
      duration: 50,
      calories: 450
    }
  ],
  exercises: [],
  currentWorkout: [],
  isWorkoutActive: false,
  workoutStartTime: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.workouts.unshift(action.payload);
    },
    startWorkout: (state) => {
      state.isWorkoutActive = true;
      state.workoutStartTime = Date.now();
      state.currentWorkout = [];
    },
    endWorkout: (state, action: PayloadAction<{ name: string }>) => {
      if (state.workoutStartTime && state.currentWorkout.length > 0) {
        const duration = Math.round((Date.now() - state.workoutStartTime) / 60000);
        const calories = Math.round(duration * 8); // Rough estimate
        
        const workout: Workout = {
          id: Date.now().toString(),
          name: action.payload.name,
          date: new Date().toISOString().split('T')[0],
          exercises: [...state.currentWorkout],
          duration,
          calories
        };
        
        state.workouts.unshift(workout);
      }
      
      state.isWorkoutActive = false;
      state.workoutStartTime = null;
      state.currentWorkout = [];
    },
    addExerciseToWorkout: (state, action: PayloadAction<Exercise>) => {
      state.currentWorkout.push(action.payload);
    },
    updateExerciseInWorkout: (state, action: PayloadAction<{ index: number; exercise: Exercise }>) => {
      state.currentWorkout[action.payload.index] = action.payload.exercise;
    },
    removeExerciseFromWorkout: (state, action: PayloadAction<number>) => {
      state.currentWorkout.splice(action.payload, 1);
    },
  },
});

export const {
  addWorkout,
  startWorkout,
  endWorkout,
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;