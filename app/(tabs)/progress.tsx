import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addProgressEntry, ProgressEntry } from '@/store/slices/progressSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp, TrendingDown, Weight, Target } from 'lucide-react-native';

export default function Progress() {
  const dispatch = useDispatch();
  const { entries, goals } = useSelector((state: RootState) => state.progress);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
  });

  const handleAddEntry = () => {
    if (!newEntry.weight) {
      alert('Please enter at least your weight');
      return;
    }

    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newEntry.weight),
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
      measurements: {
        chest: newEntry.chest ? parseFloat(newEntry.chest) : undefined,
        waist: newEntry.waist ? parseFloat(newEntry.waist) : undefined,
        hips: newEntry.hips ? parseFloat(newEntry.hips) : undefined,
        arms: newEntry.arms ? parseFloat(newEntry.arms) : undefined,
        thighs: newEntry.thighs ? parseFloat(newEntry.thighs) : undefined,
      }
    };

    dispatch(addProgressEntry(entry));
    setNewEntry({
      weight: '',
      bodyFat: '',
      muscleMass: '',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
    });
    setShowAddEntry(false);
  };

  const getWeightTrend = () => {
    if (entries.length < 2) return null;
    const latest = entries[0].weight;
    const previous = entries[1].weight;
    const diff = latest - previous;
    return { diff, isPositive: diff > 0 };
  };

  const weightTrend = getWeightTrend();
  const latestEntry = entries[0];
  const weightProgress = goals.targetWeight ? ((latestEntry?.weight || 0) / goals.targetWeight) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        {/* Current Stats */}
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#3B82F6', '#1E40AF']}
              style={[styles.statCard, styles.statCardLarge]}
            >
              <Weight size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{latestEntry?.weight || 0}</Text>
              <Text style={styles.statLabel}>lbs</Text>
              {weightTrend && (
                <View style={styles.trendContainer}>
                  {weightTrend.isPositive ? (
                    <TrendingUp size={16} color="#FFFFFF" />
                  ) : (
                    <TrendingDown size={16} color="#FFFFFF" />
                  )}
                  <Text style={styles.trendText}>
                    {Math.abs(weightTrend.diff).toFixed(1)} lbs
                  </Text>
                </View>
              )}
            </LinearGradient>

            <LinearGradient
              colors={['#10B981', '#059669']}
              style={[styles.statCard, styles.statCardLarge]}
            >
              <Target size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{goals.targetWeight}</Text>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.goalProgress}>
                {Math.abs(goals.targetWeight - (latestEntry?.weight || 0)).toFixed(1)} lbs to go
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Text style={styles.statValueSmall}>{latestEntry?.bodyFat?.toFixed(1) || '—'}</Text>
              <Text style={styles.statLabelSmall}>Body Fat %</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSmall]}>
              <Text style={styles.statValueSmall}>{latestEntry?.muscleMass || '—'}</Text>
              <Text style={styles.statLabelSmall}>Muscle Mass</Text>
            </View>
          </View>
        </View>

        {/* Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Measurements</Text>
          {latestEntry?.measurements && (
            <View style={styles.measurementsGrid}>
              {Object.entries(latestEntry.measurements).map(([key, value]) => (
                value && (
                  <View key={key} style={styles.measurementCard}>
                    <Text style={styles.measurementValue}>{value}"</Text>
                    <Text style={styles.measurementLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                  </View>
                )
              ))}
            </View>
          )}
        </View>

        {/* Add Entry Button */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowAddEntry(true)}
            style={styles.addEntryButton}
          >
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.addEntryText}>Add New Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Progress History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress History</Text>
          {entries.slice(0, 10).map((entry, index) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
                {index === 0 && <Text style={styles.latestTag}>Latest</Text>}
              </View>
              
              <View style={styles.entryData}>
                <View style={styles.entryItem}>
                  <Text style={styles.entryLabel}>Weight</Text>
                  <Text style={styles.entryValue}>{entry.weight} lbs</Text>
                </View>
                
                {entry.bodyFat && (
                  <View style={styles.entryItem}>
                    <Text style={styles.entryLabel}>Body Fat</Text>
                    <Text style={styles.entryValue}>{entry.bodyFat}%</Text>
                  </View>
                )}
                
                {entry.muscleMass && (
                  <View style={styles.entryItem}>
                    <Text style={styles.entryLabel}>Muscle Mass</Text>
                    <Text style={styles.entryValue}>{entry.muscleMass} lbs</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Add Entry Modal */}
        {showAddEntry && (
          <View style={styles.addEntryModal}>
            <Text style={styles.modalTitle}>Add Progress Entry</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs) *</Text>
              <TextInput
                style={styles.input}
                value={newEntry.weight}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, weight: text }))}
                keyboardType="decimal-pad"
                placeholder="175"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Body Fat %</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.bodyFat}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, bodyFat: text }))}
                  keyboardType="decimal-pad"
                  placeholder="15.0"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Muscle Mass</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.muscleMass}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, muscleMass: text }))}
                  keyboardType="decimal-pad"
                  placeholder="145"
                />
              </View>
            </View>

            <Text style={styles.measurementsTitle}>Measurements (inches)</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Chest</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.chest}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, chest: text }))}
                  keyboardType="decimal-pad"
                  placeholder="42"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Waist</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.waist}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, waist: text }))}
                  keyboardType="decimal-pad"
                  placeholder="32"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hips</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.hips}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, hips: text }))}
                  keyboardType="decimal-pad"
                  placeholder="38"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Arms</Text>
                <TextInput
                  style={styles.input}
                  value={newEntry.arms}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, arms: text }))}
                  keyboardType="decimal-pad"
                  placeholder="15"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Thighs</Text>
              <TextInput
                style={styles.input}
                value={newEntry.thighs}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, thighs: text }))}
                keyboardType="decimal-pad"
                placeholder="24"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowAddEntry(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleAddEntry}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add Entry</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardLarge: {
    flex: 1,
    marginHorizontal: 6,
  },
  statCardSmall: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statValueSmall: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statLabelSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  goalProgress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementCard: {
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
  measurementValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  measurementLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addEntryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  latestTag: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  entryData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryItem: {
    alignItems: 'center',
  },
  entryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  entryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 2,
  },
  addEntryModal: {
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
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
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
    marginRight: 8,
  },
  measurementsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
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
});