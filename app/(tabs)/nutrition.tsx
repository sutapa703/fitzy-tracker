import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addMealEntry, addWaterIntake, MealEntry, Food } from '@/store/slices/nutritionSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Droplets, Target, Apple, Coffee, Utensils, Moon } from 'lucide-react-native';

const foodDatabase: Food[] = [
  { id: '1', name: 'Greek Yogurt', calories: 130, protein: 20, carbs: 9, fat: 0, fiber: 0, serving: '1 cup' },
  { id: '2', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: '100g' },
  { id: '3', name: 'Brown Rice', calories: 218, protein: 4.5, carbs: 45, fat: 1.6, fiber: 3.5, serving: '1 cup cooked' },
  { id: '4', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, serving: '1 medium' },
  { id: '5', name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, serving: '100g' },
  { id: '6', name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, serving: '1/2 avocado' },
  { id: '7', name: 'Oatmeal', calories: 147, protein: 5.4, carbs: 28, fat: 2.8, fiber: 4, serving: '1/2 cup dry' },
  { id: '8', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, serving: '2 large' },
];

export default function Nutrition() {
  const dispatch = useDispatch();
  const { meals, dailyGoals, waterIntake } = useSelector((state: RootState) => state.nutrition);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(meal => meal.date === today);
  const todayWater = waterIntake.find(entry => entry.date === today)?.glasses || 0;

  const mealsByType = {
    breakfast: todayMeals.filter(meal => meal.meal === 'breakfast'),
    lunch: todayMeals.filter(meal => meal.meal === 'lunch'),
    dinner: todayMeals.filter(meal => meal.meal === 'dinner'),
    snack: todayMeals.filter(meal => meal.meal === 'snack'),
  };

  const todayTotals = todayMeals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.food.calories * meal.quantity),
      protein: totals.protein + (meal.food.protein * meal.quantity),
      carbs: totals.carbs + (meal.food.carbs * meal.quantity),
      fat: totals.fat + (meal.food.fat * meal.quantity),
      fiber: totals.fiber + (meal.food.fiber * meal.quantity),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const handleAddFood = () => {
    if (!selectedFood) {
      Alert.alert('No Food Selected', 'Please select a food item.');
      return;
    }

    const mealEntry: MealEntry = {
      id: Date.now().toString(),
      food: selectedFood,
      quantity: parseFloat(quantity) || 1,
      meal: selectedMeal,
      date: today,
    };

    dispatch(addMealEntry(mealEntry));
    setSelectedFood(null);
    setQuantity('1');
    setShowAddFood(false);
  };

  const handleWaterIntake = (glasses: number) => {
    dispatch(addWaterIntake({ date: today, glasses }));
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee size={20} color="#F59E0B" />;
      case 'lunch': return <Utensils size={20} color="#10B981" />;
      case 'dinner': return <Moon size={20} color="#8B5CF6" />;
      case 'snack': return <Apple size={20} color="#EF4444" />;
      default: return <Apple size={20} color="#6B7280" />;
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Track your daily intake</Text>
        </View>

        {/* Daily Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.macroCards}>
            <LinearGradient
              colors={['#3B82F6', '#1E40AF']}
              style={[styles.macroCard, styles.macroCardLarge]}
            >
              <Target size={24} color="#FFFFFF" />
              <Text style={styles.macroValue}>{Math.round(todayTotals.calories)}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
              <Text style={styles.macroGoal}>Goal: {dailyGoals.calories}</Text>
            </LinearGradient>

            <View style={styles.macroColumn}>
              <View style={[styles.macroCard, styles.macroCardSmall, { backgroundColor: '#10B981' }]}>
                <Text style={styles.macroValueSmall}>{Math.round(todayTotals.protein)}g</Text>
                <Text style={styles.macroLabelSmall}>Protein</Text>
              </View>
              <View style={[styles.macroCard, styles.macroCardSmall, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.macroValueSmall}>{Math.round(todayTotals.carbs)}g</Text>
                <Text style={styles.macroLabelSmall}>Carbs</Text>
              </View>
            </View>

            <View style={styles.macroColumn}>
              <View style={[styles.macroCard, styles.macroCardSmall, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.macroValueSmall}>{Math.round(todayTotals.fat)}g</Text>
                <Text style={styles.macroLabelSmall}>Fat</Text>
              </View>
              <View style={[styles.macroCard, styles.macroCardSmall, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.macroValueSmall}>{Math.round(todayTotals.fiber)}g</Text>
                <Text style={styles.macroLabelSmall}>Fiber</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Water Intake */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Intake</Text>
          <View style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <Droplets size={24} color="#3B82F6" />
              <Text style={styles.waterTitle}>Daily Hydration</Text>
            </View>
            <View style={styles.waterGlasses}>
              {[...Array(8)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleWaterIntake(index + 1)}
                  style={[
                    styles.waterGlass,
                    index < todayWater && styles.waterGlassFilled
                  ]}
                >
                  <Droplets 
                    size={16} 
                    color={index < todayWater ? '#3B82F6' : '#D1D5DB'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.waterText}>{todayWater}/8 glasses</Text>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
            <View key={mealType} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealInfo}>
                  {getMealIcon(mealType)}
                  <Text style={styles.mealName}>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMeal(mealType);
                    setShowAddFood(true);
                  }}
                  style={styles.addFoodButton}
                >
                  <Plus size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              {mealsByType[mealType].length > 0 ? (
                <View style={styles.mealItems}>
                  {mealsByType[mealType].map((meal) => (
                    <View key={meal.id} style={styles.mealItem}>
                      <View style={styles.mealItemInfo}>
                        <Text style={styles.mealItemName}>
                          {meal.food.name} × {meal.quantity}
                        </Text>
                        <Text style={styles.mealItemDetails}>
                          {Math.round(meal.food.calories * meal.quantity)} cal, 
                          {Math.round(meal.food.protein * meal.quantity)}g protein
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noMealsText}>No {mealType} logged yet</Text>
              )}
            </View>
          ))}
        </View>

        {/* Add Food Modal */}
        {showAddFood && (
          <View style={styles.addFoodModal}>
            <Text style={styles.modalTitle}>Add Food to {selectedMeal}</Text>
            
            <View style={styles.foodSelector}>
              <Text style={styles.inputLabel}>Select Food</Text>
              <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
                {foodDatabase.map((food) => (
                  <TouchableOpacity
                    key={food.id}
                    onPress={() => setSelectedFood(food)}
                    style={[
                      styles.foodOption,
                      selectedFood?.id === food.id && styles.foodOptionSelected
                    ]}
                  >
                    <View style={styles.foodOptionInfo}>
                      <Text style={[
                        styles.foodOptionName,
                        selectedFood?.id === food.id && styles.foodOptionNameSelected
                      ]}>
                        {food.name}
                      </Text>
                      <Text style={[
                        styles.foodOptionDetails,
                        selectedFood?.id === food.id && styles.foodOptionDetailsSelected
                      ]}>
                        {food.calories} cal, {food.protein}g protein per {food.serving}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowAddFood(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleAddFood}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  macroCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  macroCardLarge: {
    flex: 1,
    marginRight: 8,
  },
  macroCardSmall: {
    flex: 1,
    marginBottom: 8,
    padding: 12,
  },
  macroColumn: {
    flex: 1,
    marginLeft: 4,
  },
  macroValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 4,
  },
  macroGoal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  macroValueSmall: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  macroLabelSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 2,
  },
  waterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  waterGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  waterGlassFilled: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  waterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  addFoodButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  mealItems: {
    marginTop: 8,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mealItemInfo: {
    flex: 1,
  },
  mealItemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  mealItemDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  noMealsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  addFoodModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  foodSelector: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  foodList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  foodOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  foodOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  foodOptionInfo: {
    flex: 1,
  },
  foodOptionName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  foodOptionNameSelected: {
    color: '#FFFFFF',
  },
  foodOptionDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  foodOptionDetailsSelected: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});