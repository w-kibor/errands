import { StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../contexts/AppContext';

export function HomeScreen() {
  const { user, orders, services } = useAppContext();

  const activeOrders = orders.filter((order) => order.status !== 'Delivered' && order.status !== 'Cancelled');

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>SwiftDrop</Text>
      <Text style={styles.title}>Hi, {user?.name?.split(' ')[0] || 'there'}</Text>
      <Text style={styles.subtitle}>Here is a quick view of your errands.</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Active Orders</Text>
          <Text style={styles.cardValue}>{activeOrders.length}</Text>
        </View>
        <View style={[styles.card, styles.cardAlt]}>
          <Text style={styles.cardLabel}>Available Services</Text>
          <Text style={styles.cardValue}>{services.length}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Next Step</Text>
        <Text style={styles.panelText}>
          Continue migrating screens from the web app into mobile/src/screens, one route at a time.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
    padding: 20
  },
  eyebrow: {
    marginTop: 4,
    color: '#1D3557',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '900',
    color: '#0B2545'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#4A5C6A'
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12
  },
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    elevation: 2
  },
  cardAlt: {
    backgroundColor: '#EAF4FF'
  },
  cardLabel: {
    fontSize: 12,
    color: '#42627A',
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  cardValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: '#0B2545'
  },
  panel: {
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: '#132A13',
    padding: 16
  },
  panelTitle: {
    color: '#D8F3DC',
    fontSize: 16,
    fontWeight: '700'
  },
  panelText: {
    marginTop: 8,
    color: '#EDF6F9',
    fontSize: 14,
    lineHeight: 20
  }
});
