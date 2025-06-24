import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateDailyGoals } from '@/store/slices/nutritionSlice';
import { updateGoals } from '@/store/slices/progressSlice';
import { useAuth } from '@/components/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Target, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();
  const { dailyGoals } = useSelector((state: RootState) => state.nutrition);
  const { goals } = useSelector((state: RootState) => state.progress);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [editedGoals, setEditedGoals] = useState({
    calories: dailyGoals.calories.toString(),
    protein: dailyGoals.protein.toString(),
    carbs: dailyGoals.carbs.toString(),
    fat: dailyGoals.fat.toString(),
    targetWeight: goals.targetWeight.toString(),
  });

  const handleSaveGoals = () => {
    dispatch(updateDailyGoals({
      calories: parseInt(editedGoals.calories),
      protein: parseInt(editedGoals.protein),
      carbs: parseInt(editedGoals.carbs),
      fat: parseInt(editedGoals.fat),
    }));

    dispatch(updateGoals({
      targetWeight: parseInt(editedGoals.targetWeight),
    }));

    setIsEditingGoals(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  const profileStats = [
    { label: 'Workouts This Month', value: '12' },
    { label: 'Calories Burned', value: '4,250' },
    { label: 'Average Session', value: '45 min' },
    { label: 'Streak', value: '5 days' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your fitness journey</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#3B82F6', '#1E40AF']}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user?.name || 'Fitness Enthusiast'}
                </Text>
                <Text style={styles.profileEmail}>
                  {user?.email || 'user@fitnessapp.com'}
                </Text>
                <Text style={styles.joinDate}>Member since January 2024</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Goals & Targets</Text>
            <TouchableOpacity
              onPress={() => setIsEditingGoals(!isEditingGoals)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditingGoals ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalsCard}>
            {isEditingGoals ? (
              <>
                <View style={styles.goalInputGroup}>
                  <Text style={styles.goalLabel}>Daily Calories</Text>
                  <TextInput
                    style={styles.goalInput}
                    value={editedGoals.calories}
                    onChangeText={(text) => setEditedGoals(prev => ({ ...prev, calories: text }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.goalInputRow}>
                  <View style={styles.goalInputGroup}>
                    <Text style={styles.goalLabel}>Protein (g)</Text>
                    <TextInput
                      style={styles.goalInput}
                      value={editedGoals.protein}
                      onChangeText={(text) => setEditedGoals(prev => ({ ...prev, protein: text }))}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.goalInputGroup}>
                    <Text style={styles.goalLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.goalInput}
                      value={editedGoals.carbs}
                      onChangeText={(text) => setEditedGoals(prev => ({ ...prev, carbs: text }))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.goalInputRow}>
                  <View style={styles.goalInputGroup}>
                    <Text style={styles.goalLabel}>Fat (g)</Text>
                    <TextInput
                      style={styles.goalInput}
                      value={editedGoals.fat}
                      onChangeText={(text) => setEditedGoals(prev => ({ ...prev, fat: text }))}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.goalInputGroup}>
                    <Text style={styles.goalLabel}>Target Weight</Text>
                    <TextInput
                      style={styles.goalInput}
                      value={editedGoals.targetWeight}
                      onChangeText={(text) => setEditedGoals(prev => ({ ...prev, targetWeight: text }))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <TouchableOpacity onPress={handleSaveGoals} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Goals</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.goalItem}>
                  <Target size={20} color="#3B82F6" />
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalText}>Daily Calories: {dailyGoals.calories}</Text>
                    <Text style={styles.goalSubtext}>Target for daily intake</Text>
                  </View>
                </View>

                <View style={styles.goalItem}>
                  <Target size={20} color="#10B981" />
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalText}>
                      Macros: {dailyGoals.protein}g protein, {dailyGoals.carbs}g carbs, {dailyGoals.fat}g fat
                    </Text>
                    <Text style={styles.goalSubtext}>Daily macro targets</Text>
                  </View>
                </View>

                <View style={styles.goalItem}>
                  <Target size={20} color="#F59E0B" />
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalText}>Target Weight: {goals.targetWeight} lbs</Text>
                    <Text style={styles.goalSubtext}>Goal weight by {goals.targetDate}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#6B7280" />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings size={20} color="#6B7280" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#6B7280" />
                <Text style={styles.settingText}>Privacy & Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <HelpCircle size={20} color="#6B7280" />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
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
  profileCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  goalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  goalSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  goalInputGroup: {
    marginBottom: 16,
    flex: 1,
  },
  goalInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 8,
  },
});