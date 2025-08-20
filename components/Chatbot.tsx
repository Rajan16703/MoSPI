import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MessageCircle, Send, X } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

interface ChatbotProps {
  onClose?: () => void;
  floating?: boolean;
}

const SYSTEM_PROMPT = `You are the helpful assistant chatbot for the MoSPI (Ministry of Statistics and Programme Implementation) inspired survey builder app. 
You help users:
1. Understand what the app can do (build surveys, manage analytics, collect responses).
2. Provide best practices for crafting unbiased statistical survey questions for India.
3. Answer questions about features visible in the UI tabs: Home, Create, Survey, Analytics, Settings.
4. Politely decline to answer unrelated or harmful requests and redirect to app usage.
Keep answers concise (<= 180 words) unless the user asks for more detail.`;

// Dynamically import the Gemini client only when used to avoid impacting initial bundle
async function fetchGeminiResponse(apiKey: string, messages: ChatMessage[]): Promise<string> {
  try {
    const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
    if (!lastUser) return 'I did not receive a question. Please ask again.';

    // Using generative language model via REST fetch (avoid adding heavy SDK)
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\nUser question: ' + lastUser.content }] }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return `Gemini API error (${response.status}): ${errText}`;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response content received.';
  } catch (e: any) {
    return 'Failed to reach Gemini API: ' + e.message;
  }
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose, floating = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init',
    role: 'assistant',
    content: 'Hi! I\'m the MoSPI helper bot. Ask me about creating surveys, analytics, or writing good statistical questions.',
    createdAt: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now() + '-user', role: 'user', content: input.trim(), createdAt: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (!apiKey) {
      setMessages(prev => [...prev, { id: Date.now() + '-err', role: 'assistant', content: 'Gemini API key not set. Please configure EXPO_PUBLIC_GEMINI_API_KEY in your .env file.', createdAt: Date.now() }]);
      return;
    }

    setLoading(true);
    const replyText = await fetchGeminiResponse(apiKey, [...messages, userMsg]);
    setLoading(false);
    setMessages(prev => [...prev, { id: Date.now() + '-assistant', role: 'assistant', content: replyText, createdAt: Date.now() }]);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.assistantText]}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, floating && styles.floating]}>      
      <View style={styles.header}>        
        <Text style={styles.headerTitle}>Chat Support</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close chatbot">
            <X size={18} color="#4b5563" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      {loading && (
        <View style={styles.loadingRow}><ActivityIndicator size="small" color="#6366f1" /><Text style={styles.loadingText}>Thinking...</Text></View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about building surveys, analytics, best practices..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Send size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export const FloatingChatLauncher: React.FC = () => {
  const [open, setOpen] = useState(false);
  if (open) return <Chatbot onClose={() => setOpen(false)} />;
  return (
    <View style={styles.launcherWrapper} pointerEvents="box-none">
      <TouchableOpacity style={styles.launcherBtn} onPress={() => setOpen(true)}>
        <MessageCircle size={22} color="#fff" />
        <Text style={styles.launcherText}>Ask</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  floating: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    width: 320,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  listContent: { padding: 12 },
  bubble: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    maxWidth: '90%'
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6366f1' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  bubbleText: { fontSize: 14, lineHeight: 18 },
  userText: { color: '#fff' },
  assistantText: { color: '#1f2937' },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginRight: 8
  },
  sendBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 6 },
  loadingText: { marginLeft: 6, fontSize: 12, color: '#6b7280' },
  launcherWrapper: { position: 'absolute', right: 20, bottom: 95 },
  launcherBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, gap: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 },
  launcherText: { color: '#fff', fontWeight: '600', fontSize: 14 }
});
