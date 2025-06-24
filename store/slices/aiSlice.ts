import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AIRecommendation {
  id: string;
  type: 'workout' | 'nutrition' | 'tip';
  title: string;
  content: string;
  dateGenerated: string;
  isRead: boolean;
}

interface AIState {
  recommendations: AIRecommendation[];
  isGenerating: boolean;
}

const initialState: AIState = {
  recommendations: [
    {
      id: '1',
      type: 'workout',
      title: 'High-Intensity Interval Training (HIIT) Session',
      content: 'Based on your recent progress, try this 20-minute HIIT workout: 4 rounds of 30 seconds burpees, 30 seconds mountain climbers, 30 seconds jump squats, and 90 seconds rest. This will boost your metabolism and help with fat loss while maintaining muscle mass.',
      dateGenerated: '2024-01-15',
      isRead: false
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Protein-Rich Post-Workout Meal Plan',
      content: 'After your strength training sessions, consume 25-30g of protein within 2 hours. Try grilled salmon (25g protein) with quinoa (8g protein) and steamed broccoli. This combination provides essential amino acids for muscle recovery and complex carbs for energy replenishment.',
      dateGenerated: '2024-01-15',
      isRead: false
    },
    {
      id: '3',
      type: 'tip',
      title: 'Sleep Optimization for Better Recovery',
      content: 'Your workout intensity suggests you need 7-9 hours of quality sleep for optimal recovery. Create a bedtime routine: dim lights 1 hour before bed, keep your room at 65-68°F, and avoid screens 30 minutes before sleep. Good sleep improves protein synthesis by up to 30%.',
      dateGenerated: '2024-01-14',
      isRead: true
    }
  ],
  isGenerating: false
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addRecommendation: (state, action: PayloadAction<AIRecommendation>) => {
      state.recommendations.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const recommendation = state.recommendations.find(rec => rec.id === action.payload);
      if (recommendation) {
        recommendation.isRead = true;
      }
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    generateRecommendations: (state) => {
      state.isGenerating = true;
      
      // Simulate AI generation with different content
      const recommendations = [
        {
          id: Date.now().toString(),
          type: 'workout' as const,
          title: 'Compound Movement Focus Week',
          content: 'This week, focus on compound movements to maximize muscle growth. Include deadlifts, squats, bench press, and rows. These exercises work multiple muscle groups simultaneously, leading to better hormone response and overall strength gains. Aim for 3-4 sets of 6-8 reps with progressive overload.',
          dateGenerated: new Date().toISOString().split('T')[0],
          isRead: false
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'nutrition' as const,
          title: 'Meal Timing for Fat Loss',
          content: 'Optimize your meal timing for better fat loss results. Eat your largest meal post-workout when insulin sensitivity is highest. Include healthy fats like avocado and nuts in your morning meal to support hormone production. Consider a 16:8 intermittent fasting window to enhance fat oxidation.',
          dateGenerated: new Date().toISOString().split('T')[0],
          isRead: false
        },
        {
          id: (Date.now() + 2).toString(),
          type: 'tip' as const,
          title: 'Stress Management for Better Results',
          content: 'High cortisol from stress can sabotage your fitness goals. Incorporate 10 minutes of daily meditation, practice deep breathing between sets, and schedule regular rest days. Consider adaptogenic herbs like ashwagandha to help manage stress response and improve recovery.',
          dateGenerated: new Date().toISOString().split('T')[0],
          isRead: false
        }
      ];
      
      state.recommendations = [...recommendations, ...state.recommendations];
      state.isGenerating = false;
    }
  },
});

export const { addRecommendation, markAsRead, setGenerating, generateRecommendations } = aiSlice.actions;
export default aiSlice.reducer;