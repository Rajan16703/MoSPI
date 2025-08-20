import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Search, Plus, Tag, Filter } from 'lucide-react-native';

interface LibraryQuestion {
  id: string;
  title: string;
  type: string;
  category: string;
  options?: string[];
  used?: number;
  description?: string;
  source?: string;
}
import { useMospiSurveys } from '@/hooks/useMospiSurveys';

export function QuestionLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: surveyMeta, loading } = useMospiSurveys();

  const categories = useMemo(() => {
    const base = new Set<string>(['All']);
    surveyMeta.forEach(s => base.add(s.category));
    return Array.from(base);
  }, [surveyMeta]);

  // Convert survey meta into pseudo-questions (representative root entries)
  const libraryQuestions: LibraryQuestion[] = useMemo(() => {
    if (!surveyMeta.length) return [];
    return surveyMeta.map(m => ({
      id: m.id,
      title: m.title,
      type: m.frequency ? m.frequency : (m.lastKnownCycle ? 'Periodic' : 'Static'),
      category: m.category,
      description: m.description,
      source: m.officialUrl
    }));
  }, [surveyMeta]);

  const filteredQuestions = libraryQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToSurvey = (question: LibraryQuestion) => {
    if (question.source) {
      Alert.alert('Reference', `${question.title} is a MoSPI dataset reference. Use it to design domain-specific questions.`);
    } else {
      Alert.alert('Added', `"${question.title}" added to your survey!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question Library</Text>
      <Text style={styles.description}>
        {loading ? 'Loading MoSPI survey metadata...' : 'Browse MoSPI statistical survey & dataset references to base your questions on.'}
      </Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Questions */}
      <View style={styles.questions}>
        {filteredQuestions.map(question => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionInfo}>
                <Text style={styles.questionTitle}>{question.title}</Text>
                <View style={styles.questionMeta}>
                  <Tag size={12} color="#9ca3af" />
                  <Text style={styles.questionCategory}>{question.category}</Text>
                  {question.used && <Text style={styles.questionUsage}>Used {question.used} times</Text>}
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToSurvey(question)}
              >
                <Plus size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.questionType}>
              <Text style={styles.typeLabel}>{question.type}</Text>
              {question.description && (
                <Text style={styles.optionsCount}>{question.description.slice(0, 80)}{question.description.length > 80 ? '…' : ''}</Text>
              )}
            </View>
          </View>
        ))}

        {filteredQuestions.length === 0 && (
          <View style={styles.emptyState}>
            <Filter size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No questions found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or category filter</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeCategoryChip: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  questions: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionInfo: {
    flex: 1,
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  questionUsage: {
    fontSize: 12,
    color: '#9ca3af',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionsCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});