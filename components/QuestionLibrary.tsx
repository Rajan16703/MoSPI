import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Search, Plus, Tag, Filter } from 'lucide-react-native';

interface LibraryQuestion {
  id: string;
  title: string;
  type: string;
  category: string;
  options?: string[];
  used: number;
}

export function QuestionLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Demographics', 'Income', 'Housing', 'Education', 'Health', 'Employment'];

  const libraryQuestions: LibraryQuestion[] = [
    {
      id: '1',
      title: 'What is your age group?',
      type: 'Radio',
      category: 'Demographics',
      options: ['18-25', '26-35', '36-45', '46-55', '55+'],
      used: 1247,
    },
    {
      id: '2',
      title: 'What is your monthly household income?',
      type: 'Radio',
      category: 'Income',
      options: ['Below ₹25,000', '₹25,000-₹50,000', '₹50,000-₹1,00,000', 'Above ₹1,00,000'],
      used: 892,
    },
    {
      id: '3',
      title: 'What type of dwelling do you live in?',
      type: 'Radio',
      category: 'Housing',
      options: ['Independent House', 'Apartment', 'Slum', 'Other'],
      used: 654,
    },
    {
      id: '4',
      title: 'What is your highest level of education?',
      type: 'Radio',
      category: 'Education',
      options: ['Primary', 'Secondary', 'Graduate', 'Post-graduate', 'Professional'],
      used: 543,
    },
  ];

  const filteredQuestions = libraryQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToSurvey = (question: LibraryQuestion) => {
    Alert.alert('Added', `"${question.title}" added to your survey!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question Library</Text>
      <Text style={styles.description}>
        Browse and add pre-approved questions from our standardized library.
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
                  <Text style={styles.questionUsage}>Used {question.used} times</Text>
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
              {question.options && (
                <Text style={styles.optionsCount}>{question.options.length} options</Text>
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