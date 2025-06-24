import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { startWorkout, endWorkout, addExerciseToWorkout, Exercise } from '@/store/slices/workoutSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Square, Plus, Clock, Zap, Dumbbell, Target } from 'lucide-react-native';

const exerciseLibrary = [
  { name: 'Push-ups', category: 'Chest' },
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Pull-ups', category: 'Back' },
  { name: 'Rows', category: 'Back' },
  { name: 'Squats', category: 'Legs' },
  { name: 'Deadlifts', category: 'Legs' },
  { name: 'Shoulder Press', category: 'Shoulders' },
  { name: 'Bicep Curls', category: 'Arms' },
  { name: 'Tricep Dips', category: 'Arms' },
  { name: 'Plank', category: 'Core' },
];

export default function Workout() {
  const dispatch = useDispatch();
  const { workouts, isWorkoutActive, currentWorkout, workoutStartTime } = useSelector((state: RootState) => state.workout);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    category: 'Chest'
  });

  const handleStartWorkout = () => {
    dispatch(startWorkout());
  };

  const handleEndWorkout = () => {
    if (currentWorkout.length === 0) {
      Alert.alert('No Exercises', 'Add at least one exercise to complete your workout.');
      return;
    }
    
    Alert.alert(
      'Complete Workout',
      'Are you sure you want to end your workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: () => {
            const workoutName = `Workout ${new Date().toLocaleDateString()}`;
            dispatch(endWorkout({ name: workoutName }));
          }
        }
      ]
    );
  };

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: parseInt(newExercise.weight) || 0,
      category: newExercise.category
    };

    dispatch(addExerciseToWorkout(exercise));
    setNewExercise({ name: '', sets: '', reps: '', weight: '', category: 'Chest' });
    setShowAddExercise(false);
  };

  const getWorkoutDuration = () => {
    if (!workoutStartTime) return 0;
    return Math.floor((Date.now() - workoutStartTime) / 60000);
  };

  const recentWorkouts = workouts.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout</Text>
          <Text style={styles.subtitle}>Track your training sessions</Text>
        </View>

        {/* Active Workout Card */}
        <View style={styles.section}>
          {!isWorkoutActive ? (
            <TouchableOpacity onPress={handleStartWorkout}>
              <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                style={styles.startWorkoutCard}
              >
                <Play size={32} color="#FFFFFF" />
                <Text style={styles.startWorkoutText}>Start New Workout</Text>
                <Text style={styles.startWorkoutSubtext}>Begin tracking your exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeWorkoutCard}>
              <View style={styles.activeWorkoutHeader}>
                <View style={styles.activeWorkoutInfo}>
                  <Text style={styles.activeWorkoutTitle}>Workout in Progress</Text>
                  <View style={styles.workoutTimer}>
                    <Clock size={16} color="#10B981" />
                    <Text style={styles.timerText}>{getWorkoutDuration()} min</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleEndWorkout} style={styles.endButton}>
                  <Square size={20} color="#FFFFFF" />
                  <Text style={styles.endButtonText}>End</Text>
                </TouchableOpacity>
              </View>

              {/* Current Exercises */}
              <View style={styles.currentExercises}>
                {currentWorkout.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                      </Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity 
                  onPress={() => setShowAddExercise(true)}
                  style={styles.addExerciseButton}
                >
                  <Plus size={20} color="#3B82F6" />
                  <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Add Exercise Modal */}
        {showAddExercise && (
          <View style={styles.addExerciseModal}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Exercise Name</Text>
              <View style={styles.exerciseSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {exerciseLibrary.map((exercise, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setNewExercise(prev => ({ ...prev, name: exercise.name, category: exercise.category }))}
                      style={[
                        styles.exerciseOption,
                        newExercise.name === exercise.name && styles.exerciseOptionSelected
                      ]}
                    >
                      <Text style={[
                        styles.exerciseOptionText,
                        newExercise.name === exercise.name && styles.exerciseOptionTextSelected
                      ]}>
                        {exercise.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sets</Text>
                <TextInput
                  style={styles.input}
                  value={newExercise.sets}
                  onChangeText={(text) => setNewExercise(prev => ({ ...prev, sets: text }))}
                  keyboardType="numeric"
                  placeholder="3"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={newExercise.reps}
                  onChangeText={(text) => setNewExercise(prev => ({ ...prev, reps: text }))}
                  keyboardType="numeric"
                  placeholder="10"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={newExercise.weight}
                  onChangeText={(text) => setNewExercise(prev => ({ ...prev, weight: text }))}
                  keyboardType="numeric"
                  placeholder="135"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowAddExercise(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleAddExercise}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Workout History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {recentWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutHistoryCard}>
              <View style={styles.workoutHistoryHeader}>
                <Text style={styles.workoutHistoryName}>{workout.name}</Text>
                <Text style={styles.workoutHistoryDate}>
                  {new Date(workout.date).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.workoutHistoryStats}>
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
              
              <View style={styles.exerciseList}>
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <Text key={index} style={styles.exerciseListItem}>
                    {exercise.name} - {exercise.sets}×{exercise.reps}
                    {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                  </Text>
                ))}
                {workout.exercises.length > 3 && (
                  <Text style={styles.moreExercises}>
                    +{workout.exercises.length - 3} more exercises
                  </Text>
                )}
              </View>
            </View>
          ))}
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
  startWorkoutCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  startWorkoutText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  startWorkoutSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  activeWorkoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeWorkoutInfo: {
    flex: 1,
  },
  activeWorkoutTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  workoutTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  currentExercises: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  exerciseDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 12,
  },
  addExerciseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginLeft: 8,
  },
  addExerciseModal: {
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  exerciseSelector: {
    marginBottom: 8,
  },
  exerciseOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  exerciseOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  exerciseOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  exerciseOptionTextSelected: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  workoutHistoryCard: {
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
  workoutHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutHistoryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  workoutHistoryDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workoutHistoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  exerciseList: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  exerciseListItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginTop: 4,
  },
});