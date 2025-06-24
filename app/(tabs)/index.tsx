import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Target, Zap, Droplets, Trophy, Dumbbell } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { workouts } = useSelector((state: RootState) => state.workout);
  const { meals, dailyGoals, waterIntake } = useSelector((state: RootState) => state.nutrition);
  const { entries } = useSelector((state: RootState) => state.progress);

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(meal => meal.date === today);
  const todayWater = waterIntake.find(entry => entry.date === today)?.glasses || 0;
  const latestWeight = entries[0]?.weight || 0;
  const recentWorkouts = workouts.slice(0, 3);

  const todayCalories = todayMeals.reduce((total, meal) => 
    total + (meal.food.calories * meal.quantity), 0
  );

  const calorieProgress = dailyGoals.calories ? (todayCalories / dailyGoals.calories) * 100 : 0;
  const waterProgress = (todayWater / 8) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#3B82F6', '#1E40AF']}
              style={[styles.statCard, styles.statCardLarge]}
            >
              <View style={styles.statHeader}>
                <Target size={24} color="#FFFFFF" />
                <Text style={styles.statTitle}>Today's Goals</Text>
              </View>
              <Text style={styles.statValue}>{Math.round(calorieProgress)}%</Text>
              <Text style={styles.statSubtext}>Calories: {Math.round(todayCalories)}/{dailyGoals.calories}</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#10B981', '#059669']}
              style={[styles.statCard, styles.statCardLarge]}
            >
              <View style={styles.statHeader}>
                <Droplets size={24} color="#FFFFFF" />
                <Text style={styles.statTitle}>Hydration</Text>
              </View>
              <Text style={styles.statValue}>{todayWater}/8</Text>
              <Text style={styles.statSubtext}>Glasses of water</Text>
            </LinearGradient>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Trophy size={20} color="#F59E0B" />
              <Text style={styles.statValueSmall}>{latestWeight}</Text>
              <Text style={styles.statSubtextSmall}>lbs</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Zap size={20} color="#EF4444" />
              <Text style={styles.statValueSmall}>{workouts.length}</Text>
              <Text style={styles.statSubtextSmall}>Workouts</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Clock size={20} color="#8B5CF6" />
              <Text style={styles.statValueSmall}>{recentWorkouts.reduce((acc, w) => acc + w.duration, 0)}</Text>
              <Text style={styles.statSubtextSmall}>mins this week</Text>
            </View>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {recentWorkouts.map((workout, index) => (
            <TouchableOpacity key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDate}>{new Date(workout.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStat}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.workoutStatText}>{workout.duration} min</Text>
                </View>
                <View style={styles.workoutStat}>
                  <Zap size={16} color="#6B7280" />
                  <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
                </View>
                <View style={styles.workoutStat}>
                  <Dumbbell size={16} color="#6B7280" />
                  <Text style={styles.workoutStatText}>{workout.exercises.length} exercises</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Last 30 Days</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>Weight trend visualization</Text>
              <Text style={styles.chartSubtext}>Connect to see detailed charts</Text>
            </View>
          </View>
        </View>
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
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardLarge: {
    flex: 1,
    marginRight: 6,
  },
  statCardSmall: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statValueSmall: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statSubtextSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
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
  workoutCard: {
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
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  workoutDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  chartSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
});