import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../contexts/AppContext';

export function ProfileScreen() {
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    Alert.alert('Sign out?', 'You can log back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || 'Unknown user'}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'No email'}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone || 'No phone'}</Text>

        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    padding: 20
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#7C2D12'
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  label: {
    marginTop: 12,
    color: '#9A3412',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.7
  },
  value: {
    marginTop: 4,
    color: '#431407',
    fontSize: 16,
    fontWeight: '600'
  },
  button: {
    marginTop: 22,
    borderRadius: 12,
    backgroundColor: '#9A3412',
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
