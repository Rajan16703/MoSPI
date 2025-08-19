import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartBar as BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing 
} from 'react-native-reanimated';

export function LoadingScreen() {
  const { colors } = useTheme();
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
            <BarChart3 size={48} color={colors.primary} />
          </Animated.View>
          
          <Animated.View style={[styles.sparkleContainer, animatedSparkleStyle]}>
            <Sparkles size={24} color={colors.primary} />
          </Animated.View>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>MoSPI</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Survey & Analytics Platform
        </Text>
        
        <View style={styles.loadingIndicator}>
          <View style={[styles.loadingBar, { backgroundColor: colors.border }]}>
            <Animated.View 
              style={[
                styles.loadingProgress, 
                { backgroundColor: colors.primary },
                animatedIconStyle
              ]} 
            />
          </View>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Initializing...
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Ministry of Statistics & Programme Implementation
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Government of India
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 48,
    textAlign: 'center',
  },
  loadingIndicator: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    height: '100%',
    width: '60%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});