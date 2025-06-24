import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { generateRecommendations, markAsRead } from '@/store/slices/aiSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Sparkles, Dumbbell, Apple, Lightbulb, RefreshCw } from 'lucide-react-native';

export default function AICoach() {
  const dispatch = useDispatch();
  const { recommendations, isGenerating } = useSelector((state: RootState) => state.ai);

  const handleGenerateRecommendations = () => {
    dispatch(generateRecommendations());
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={20} color="#3B82F6" />;
      case 'nutrition':
        return <Apple size={20} color="#10B981" />;
      case 'tip':
        return <Lightbulb size={20} color="#F59E0B" />;
      default:
        return <Brain size={20} color="#8B5CF6" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'workout':
        return '#DBEAFE';
      case 'nutrition':
        return '#D1FAE5';
      case 'tip':
        return '#FEF3C7';
      default:
        return '#EDE9FE';
    }
  };

  const unreadCount = recommendations.filter(rec => !rec.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Personalized fitness recommendations</Text>
        </View>

        {/* AI Hero Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <Brain size={32} color="#FFFFFF" />
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Your AI Fitness Coach</Text>
                <Text style={styles.heroSubtitle}>
                  Get personalized recommendations based on your progress and goals
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={handleGenerateRecommendations}
              disabled={isGenerating}
              style={styles.generateButton}
            >
              {isGenerating ? (
                <RefreshCw size={20} color="#8B5CF6" />
              ) : (
                <Sparkles size={20} color="#8B5CF6" />
              )}
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating...' : 'Generate New Tips'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{recommendations.length}</Text>
              <Text style={styles.statLabel}>Total Tips</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {recommendations.filter(r => r.type === 'workout').length}
              </Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {recommendations.filter(r => r.type === 'nutrition').length}
              </Text>
              <Text style={styles.statLabel}>Nutrition</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <TouchableOpacity
                key={recommendation.id}
                onPress={() => handleMarkAsRead(recommendation.id)}
                style={[
                  styles.recommendationCard,
                  { backgroundColor: getRecommendationColor(recommendation.type) },
                  !recommendation.isRead && styles.unreadCard
                ]}
              >
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationTypeContainer}>
                    {getRecommendationIcon(recommendation.type)}
                    <Text style={styles.recommendationType}>
                      {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                    </Text>
                  </View>
                  {!recommendation.isRead && <View style={styles.unreadDot} />}
                </View>
                
                <Text style={styles.recommendationTitle}>
                  {recommendation.title}
                </Text>
                
                <Text style={styles.recommendationContent}>
                  {recommendation.content}
                </Text>
                
                <Text style={styles.recommendationDate}>
                  Generated on {new Date(recommendation.dateGenerated).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Brain size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No recommendations yet</Text>
              <Text style={styles.emptySubtitle}>
                Generate your first AI recommendations to get started
              </Text>
            </View>
          )}
        </View>

        {/* AI Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          
          <View style={styles.featureCard}>
            <Dumbbell size={24} color="#3B82F6" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Workout Optimization</Text>
              <Text style={styles.featureDescription}>
                Get personalized workout plans based on your progress and preferences
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Apple size={24} color="#10B981" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Nutrition Guidance</Text>
              <Text style={styles.featureDescription}>
                Receive meal suggestions and nutrition tips tailored to your goals
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Lightbulb size={24} color="#F59E0B" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Tips</Text>
              <Text style={styles.featureDescription}>
                Get lifestyle and recovery tips to maximize your fitness results
              </Text>
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
  heroCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroText: {
    flex: 1,
    marginLeft: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationType: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
});