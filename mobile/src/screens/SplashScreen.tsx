import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../contexts/AppContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { isHydrating, user } = useAppContext();

  useEffect(() => {
    if (isHydrating) return;

    const timeout = setTimeout(() => {
      navigation.replace(user ? 'MainTabs' : 'Login');
    }, 500);

    return () => clearTimeout(timeout);
  }, [isHydrating, navigation, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SwiftDrop</Text>
      <Text style={styles.subtitle}>Your errands, delivered fast.</Text>
      <ActivityIndicator size="large" color="#132A13" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 24
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#132A13',
    letterSpacing: 0.6
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#4A4A4A'
  },
  loader: {
    marginTop: 20
  }
});
