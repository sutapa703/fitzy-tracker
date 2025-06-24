import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
}

export interface MealEntry {
  id: string;
  food: Food;
  quantity: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

interface NutritionState {
  meals: MealEntry[];
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  waterIntake: { date: string; glasses: number }[];
}

const initialState: NutritionState = {
  meals: [
    {
      id: '1',
      food: {
        id: '1',
        name: 'Greek Yogurt',
        calories: 130,
        protein: 20,
        carbs: 9,
        fat: 0,
        fiber: 0,
        serving: '1 cup'
      },
      quantity: 1,
      meal: 'breakfast',
      date: '2024-01-15'
    },
    {
      id: '2',
      food: {
        id: '2',
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        serving: '100g'
      },
      quantity: 1.5,
      meal: 'lunch',
      date: '2024-01-15'
    },
    {
      id: '3',
      food: {
        id: '3',
        name: 'Brown Rice',
        calories: 218,
        protein: 4.5,
        carbs: 45,
        fat: 1.6,
        fiber: 3.5,
        serving: '1 cup cooked'
      },
      quantity: 0.75,
      meal: 'lunch',
      date: '2024-01-15'
    }
  ],
  dailyGoals: {
    calories: 2200,
    protein: 140,
    carbs: 275,
    fat: 73,
    fiber: 25
  },
  waterIntake: [
    { date: '2024-01-15', glasses: 6 },
    { date: '2024-01-14', glasses: 8 }
  ]
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    addMealEntry: (state, action: PayloadAction<MealEntry>) => {
      state.meals.push(action.payload);
    },
    removeMealEntry: (state, action: PayloadAction<string>) => {
      state.meals = state.meals.filter(meal => meal.id !== action.payload);
    },
    updateDailyGoals: (state, action: PayloadAction<Partial<NutritionState['dailyGoals']>>) => {
      state.dailyGoals = { ...state.dailyGoals, ...action.payload };
    },
    addWaterIntake: (state, action: PayloadAction<{ date: string; glasses: number }>) => {
      const existingEntry = state.waterIntake.find(entry => entry.date === action.payload.date);
      if (existingEntry) {
        existingEntry.glasses = action.payload.glasses;
      } else {
        state.waterIntake.push(action.payload);
      }
    }
  },
});

export const { addMealEntry, removeMealEntry, updateDailyGoals, addWaterIntake } = nutritionSlice.actions;
export default nutritionSlice.reducer;