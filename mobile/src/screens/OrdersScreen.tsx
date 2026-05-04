import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../contexts/AppContext';

export function OrdersScreen() {
  const { orders } = useAppContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemId}>{item.id}</Text>
                <Text style={styles.itemStatus}>{item.status}</Text>
              </View>
              <Text style={styles.itemText}>Pickup: {item.pickup.address}</Text>
              <Text style={styles.itemText}>Dropoff: {item.dropoff.address}</Text>
              <Text style={styles.itemPrice}>KES {item.price.toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1D3557'
  },
  empty: {
    marginTop: 20,
    fontSize: 16,
    color: '#666666'
  },
  list: {
    paddingTop: 16,
    gap: 12
  },
  item: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#F8F9FA'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  itemId: {
    fontWeight: '700',
    color: '#0D1B2A'
  },
  itemStatus: {
    fontWeight: '600',
    color: '#3A86FF'
  },
  itemText: {
    color: '#415A77',
    marginBottom: 3
  },
  itemPrice: {
    marginTop: 6,
    color: '#132A13',
    fontWeight: '800'
  }
});
